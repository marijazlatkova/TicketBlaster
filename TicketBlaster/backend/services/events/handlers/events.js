const Event = require("../../../pkg/events");

const create = async (req, res) => {
  try {
    if (req.file) {
      const filename = req.file.filename;
      req.body.image = filename;
    }
    let relatedActs = [];
    if (req.body.relatedActs) {
      relatedActs = req.body.relatedActs.split(",");
    }
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
    const { category } = req.query;
    const query = category ? { category } : {};
    const events = await Event.find(query).populate("relatedActs");
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    return res.status(200).json(events);
  } catch (err) {
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
    if (req.file) {
      const filename = req.file.filename;
      req.body.image = filename;
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
    await Event.findByIdAndDelete(req.params.id);
    return res.status(204).send("Event removed successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
};