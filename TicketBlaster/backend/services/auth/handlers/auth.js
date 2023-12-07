const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../../pkg/users");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("../../../pkg/mailer");

const createAccount = async (req, res) => {
  try {
    const { fullname, email, password, retype_password, role } = req.body;
    if (password !== retype_password) {
      return res.status(400).send("Passwords do not match");
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).send("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      fullname,
      email,
      role,
      password: hashedPassword
    });
    await sendWelcomeEmail(email);
    return res.status(201).send(newUser);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found!");
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send("Incorrect password!");
    }
    const payload = {
      name: user.name,
      email: user.email,
      id: user._id,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    }
    if (user.role === "admin" || user.role === "administrator") {
      console.log(`Logged in as ${user.role}: ${user.email}`);
      payload.role = user.role;
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const refreshToken = async (req, res) => {
  try {
    const payload = {
      ...req.auth,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).send(token);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.resetToken = resetToken;
    await user.save();
    const resetLink = `${process.env.RESET_PASSWORD_LINK}?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);
    return res.status(200).send(resetToken);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, retype_password } = req.body;
    const resetToken = req.query.token;
    if (!password || !retype_password || !resetToken) {
      return res.status(400).send("All fields are required");
    }
    const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send("User not found!");
    }
    const hashedPassword = bcrypt.hashSync(password, 12);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).send("Password reset successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { 
  createAccount,
  login,
  refreshToken,
  forgotPassword, 
  resetPassword
};