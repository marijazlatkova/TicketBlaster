import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./shopping-cart.module.css";

export const ShoppingCart = () => {
  const [tickets, setTickets] = useState([]);
  const { userId } = useContext(AuthContext);
  console.log("USERID", userId);

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
        prevTickets.filter((t) => t._id !== ticketId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const calculatePrice = (t) => {
    const quantity = t.quantity;
    const price = t.event.price;
    const priceParts = price.split("$");
    const priceValue = Number(priceParts[1]);
    return quantity * priceValue;
  };

  return (
    <div className={style["shopping-cart"]}>
      <h2 className={style["title"]}>Shopping Cart</h2>
      {tickets.length === 0 ? (
        <p>Your shopping cart is empty.</p>
      ) : (
        <>
          {tickets.map((t, i) => {
            const totalPrice = calculatePrice(t);
            return (
              <div key={i}>
                <div className={style["wrapper"]}>
                  <div className={style["first-section"]}>
                    {t.event && t.event.image && (
                      <img
                        className={style["event-image"]}
                        src={`http://localhost:10002/images/${t.event.image}`}
                        alt={t.event.name}
                      />
                    )}
                    <div className={style["event-info"]}>
                      <h2 className={style["event-name"]}>
                        {t.event && t.event.name}
                      </h2>
                      <p className={style["event-date"]}>
                        {t.event &&
                          new Date(t.event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </p>
                      <p className={style["event-location"]}>
                        {t.event && t.event.location}
                      </p>
                    </div>
                  </div>

                  <div className={style["second-section"]}>
                    <p className={style["event-price"]}>
                      ${totalPrice.toFixed(2)} USD
                    </p>
                    <p className={style["event-total-price"]}>
                      {t.quantity} x {t.event && t.event.price} USD
                    </p>
                    <button
                      className={style["remove-button"]}
                      type="button"
                      onClick={() => removeFromCart(userId, t._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <br />
                {i === tickets.length - 1 && <hr className={style["hr"]} />}
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
