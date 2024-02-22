const mongoose = require ("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  tickets: [
    {
      event: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Event"
      },
      quantity: {
        type: Number
      }
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema, "cart");