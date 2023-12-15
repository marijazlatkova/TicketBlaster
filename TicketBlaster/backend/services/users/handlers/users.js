const bcrypt = require("bcryptjs");
const User = require("../../../pkg/users");

const getAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).send(user);
  } catch(err) {
    return res.status(500).send("Internal Server Error");
  }
};

const update = async (req, res) => {
  try {
    if(req.file) {
      req.body.image = req.file.filename;
    }
    await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    return res.status(204).send("User updated successfully");
  } catch(err) {
    return res.status(500).send("Internal Server Error");
  }
};

const remove = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { deleted: true } }, { new: true });
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(204).send("User deleted successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const upgradeDegrade = async (req, res) =>  {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    const newRole = user.role === "admin" ? "user" : "admin";
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true }
    );
    return res.status(200).send(updatedUser);
  } catch(err) {
    return res.status(500).send("Internal Server Error");
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedPassword = await User.findByIdAndUpdate(
        id, 
        { password: hashedPassword },
        { new: true, runValidators: true}
      );
    return res.status(200).send(updatedPassword)
  } catch(err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAll,
  getOne,
  update,
  remove,
  upgradeDegrade,
  changePassword
};