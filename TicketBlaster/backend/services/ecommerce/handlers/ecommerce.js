const ShoppingCart = require("../../../pkg/ecommerce/cart");
const PurchaseHistory = require("../../../pkg/ecommerce/ticketsHistory");

const addToCart = async (req, res) => {
  try {
    const { userId, event, quantity } = req.body;
    let cart = await ShoppingCart.findOne({ user: userId });
    if (!cart) {
      cart = new ShoppingCart({ user: userId, tickets: [] });
    }
    cart.tickets.push({ event, quantity });
    await cart.save();
    return res.status(201).send("Ticket added to cart successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getCartTickets = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await ShoppingCart.findOne({ user: userId }).populate({
      path: "tickets.event",
      model: "Event",
      select: "-relatedActs"
    });
    return res.status(200).send({ tickets: cart ? cart.tickets : [] });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const processPaymentAndAddToHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await ShoppingCart.findOne({ user: userId }).populate("tickets.event");
    if (cart && cart.tickets.length > 0) {
      const history = await PurchaseHistory.create({
        user: userId,
        ticketsHistory: cart.tickets.map(ticket => ({ event: ticket.event, quantity: ticket.quantity })),
      });
      await history.save();
      await ShoppingCart.findOneAndUpdate({ user: userId }, { $set: { tickets: [] } });
      return res.status(200).send("Payment processed and added to history successfully");
    } else {
      return res.status(400).send("Cart is empty");
    }
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getPurchasedTicketsHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await PurchaseHistory.findOne({ user: userId }).populate("ticketsHistory.event");
    return res.status(200).send({ purchasedTickets: history ? history.ticketsHistory : [] });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getAllTicketsHistoryForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await PurchaseHistory.find({ user: userId }).populate({
      path: "ticketsHistory.event",
      model: "Event",
      select: "-relatedActs"
    });
    return res.status(200).send({ allTicketsHistory: history });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const ticketId = req.params.ticketId;
    await ShoppingCart.findOneAndUpdate({ user: userId }, { $pull: { tickets: { _id: ticketId } } });
    return res.status(200).send("Ticket removed from cart successfully");
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addToCart,
  getCartTickets,
  processPaymentAndAddToHistory,
  getPurchasedTicketsHistory,
  getAllTicketsHistoryForUser,
  removeFromCart
};