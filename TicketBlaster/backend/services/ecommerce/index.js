const express = require("express");
const cors = require("cors");
const db = require("../../pkg/db");
const ecommerce = require("./handlers/ecommerce");

db.init();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/v1/ecommerce/add-to-cart", ecommerce.addToCart);
app.post("/api/v1/ecommerce/process-payment", ecommerce.processPayment);
app.get("/api/v1/ecommerce/cart-tickets/:userId", ecommerce.getCartTickets);
app.get("/api/v1/ecommerce/purchased-tickets/:userId", ecommerce.getPurchasedTickets);
app.get("/api/v1/ecommerce/tickets-history/:userId", ecommerce.getAllTickets);
app.delete("/api/v1/ecommerce/remove-from-cart/:userId/:ticketId", ecommerce.removeFromCart);

app.listen(process.env.PORTECOMMERCE, (err) => {
  err
  ? console.log(err)
  : console.log(`Service [ecommerce] successfully started at port ${process.env.PORTECOMMERCE}`);
});