const mongoose = require("mongoose");

const ticketHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  ticketsHistory: [
    {
      event: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Event"
      },
      quantity: {
        type: Number
      },
      timestamps: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("TicketsHistory", ticketHistorySchema, "ticketsHistory");