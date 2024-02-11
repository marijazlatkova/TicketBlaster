const ShoppingCart = require("../../../pkg/ecommerce/cart");
const PurchaseHistory = require("../../../pkg/ecommerce/ticketsHistory");
const Event = require("../../../pkg/events").model("Event");

const addToCart = async (req, res) => {
  try {
    const { user, tickets } = req.body;
    let cart = await ShoppingCart.findOne({ user });
    if (!cart) {
      cart = await ShoppingCart.create({ user, tickets });
      return res.status(201).json({ message: "New cart created", tickets: cart.tickets });
    }
    tickets.forEach(newTicket => {
      const ticket = cart.tickets.find(ticket => ticket.event._id.toString() === newTicket.event.toString());
      if (ticket) {
        ticket.quantity += newTicket.quantity;
      } else {
        cart.tickets.push(newTicket);
      }
    });
    await cart.save();
    return res.status(201).json({ message: "Tickets added to cart:", tickets: cart.tickets });
  } catch(err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getCartTickets = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await ShoppingCart.findOne({ user: userId }).populate({
      model: Event,
      path: "tickets.event",
      select: "-relatedActs"
    });
    return res.status(200).json({ tickets: cart ? cart.tickets : [] });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const processPaymentAndAddToHistory = async (req, res) => {
  try {
    const { user } = req.body;
    const cart = await ShoppingCart.findOne({ user }).populate("tickets.event");
    if (cart && cart.tickets.length > 0) {
      const history = await PurchaseHistory.create({
        user: user,
        ticketsHistory: cart.tickets.map(ticket => ({ event: ticket.event, quantity: ticket.quantity })),
      });
      await history.save();
      await ShoppingCart.findOneAndUpdate({ user }, { $set: { tickets: [] } });
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
    return res.status(200).json({ purchasedTickets: history ? history.ticketsHistory : [] });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const getAllTicketsHistoryForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await PurchaseHistory.find({ user: userId }).populate({
      model: Event,
      path: "ticketsHistory.event",
      select: "-relatedActs"
    });
    return res.status(200).json({ allTicketsHistory: history });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const ticketId = req.params.ticketId;
    const cart = await ShoppingCart.findOneAndUpdate(
      { user: userId },
      { $pull: { tickets: { _id: ticketId } } },
      { new: true }
    );
    if (!cart) {
      return res.status(404).send("User not found");
    }
    await cart.save();
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