import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./shopping-cart.module.css";

export const ShoppingCart = () => {
  const [tickets, setTickets] = useState([]);
  const { userId } = useContext(AuthContext);

  const fetchUserTickets = async () => {
    try {
      const res = await fetch(
        `http://localhost:10004/api/v1/ecommerce/cart-tickets/${userId}`
      );
      const data = await res.json();
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, [userId]);

  const removeFromCart = async (userId, ticketId) => {
    try {
      await fetch(
        `http://localhost:10004/api/v1/ecommerce/remove-from-cart/${userId}/${ticketId}`,
        {
          method: "DELETE",
        }
      );
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const calculatePrice = (ticket) => {
    const quantity = ticket.quantity;
    const price = ticket.event.price;
    const priceParts = price.split("$");
    const priceValue = Number(priceParts[1]);
    return quantity * priceValue;
  };

  return (
    <div className={style["shopping-cart"]}>
      <h2 className={style["title"]}>Shopping Cart</h2>
      {tickets.length === 0 ? (
        <p className={style["empty-cart"]}>No items in cart</p>
      ) : (
        <>
          {tickets.map((ticket, index) => {
            const totalPrice = calculatePrice(ticket);
            return (
              <div key={ticket._id}>
                <div className={style["wrapper"]}>
                  <div className={style["first-section"]}>
                    <img
                      className={style["event-image"]}
                      src={`http://localhost:10002/images/${ticket.event.image}`}
                      alt={ticket.event.name}
                    />
                    <div className={style["event-info"]}>
                      <h2 className={style["event-name"]}>
                        {ticket.event.name}
                      </h2>
                      <p className={style["event-date"]}>
                        {new Date(ticket.event.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className={style["event-location"]}>
                        {ticket.event.location}
                      </p>
                    </div>
                  </div>

                  <div className={style["second-section"]}>
                    <p className={style["event-price"]}>
                      ${totalPrice.toFixed(2)} USD
                    </p>
                    <p className={style["event-total-price"]}>
                      {ticket.quantity} x {ticket.event.price} USD
                    </p>
                    <button
                      className={style["remove-button"]}
                      type="button"
                      onClick={() => removeFromCart(userId, ticket._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <br />
                {index === tickets.length - 1 && <hr className={style["hr"]} />}
              </div>
            );
          })}
          <div className={style["third-section"]}>
            {tickets.length > 0 && (
              <Link
                className={style["back"]}
                to={`/event/${tickets[0].event._id}`}
              >
                Back
              </Link>
            )}
            {tickets.length > 0 && (
              <Link className={style["checkout"]} to="/checkout">
                Check Out
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};
