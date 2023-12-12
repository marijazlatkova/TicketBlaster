const jwt = require("jsonwebtoken");
const Event = require("../../../pkg/events");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(500).send("Forbidden: Invalid token");
  }
};

const create = async (req, res) => {
  try {
    if (req.user.role !== "administrator") {
      return res.status(401).send("Unauthorized action!");
    }
    if (req.file) {
      const filename = req.file.filename;
      req.body.image = filename;
    }
    const relatedActs = req.body.relatedActs.split(",");
    const event = await Event.create({
      ...req.body,
      relatedActs: relatedActs
    });
    return res.status(201).send(event);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getAll = async (req, res) => {
  try {
    const event = await Event.find().populate("relatedActs");
    event.sort((a, b) => new Date(a.date) - new Date(b.date));
    return res.status(200).send(event);
  } catch(err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getOne = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("relatedActs");
    return res.status(200).send(event);
  } catch(err) {
    return res.status(500).send("Internal Server Error");
  }
};

const update = async (req, res) => {
  try {
    if (req.user.role !== "administrator") {
      return res.status(401).send("Unauthorized action!");
    }
    await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    return res.status(204).send("Event updated successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const remove = async (req, res) => {
  try {
    if (req.user.role !== "administrator") {
      return res.status(401).send("Unauthorized action!");
    }
    await Event.findByIdAndDelete(req.params.id);
    return res.status(204).send("Event removed successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  create: [authenticate, create],
  update: [authenticate, update],
  remove: [authenticate, remove],
  getAll,
  getOne
};