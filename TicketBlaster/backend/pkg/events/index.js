const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String
  },
  date: {
    type: Date
  },
  location : {
    type: String
  },
  category: {
    type: String,
    enum: ["Musical Concert", "Stand-up Comedy"]
  },
  genre: {
    type: String,
    enum: ["rock", "metal", "electronic", "rap", "pop", "jazz", "grunge", "comedy"]
  },
  eventDetails: {
    type: String
  },
  price: {
    type: String
  },
  relatedActs: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Event"
    }
  ]
});

module.exports = mongoose.model("Event", eventSchema, "events");