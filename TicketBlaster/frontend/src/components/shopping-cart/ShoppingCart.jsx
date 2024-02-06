import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const ShoppingCart = () => {
  const [tickets, setTickets] = useState([]);
  const { userId } = useContext(AuthContext);

  const fetchUserTickets = async () => {
    try {
      const res = await fetch(
        `http://localhost:10004/api/v1/ecommerce/cart-tickets/${userId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const resData = await res.json();
      setTickets(resData.tickets);
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
    <div>
      <h2>Shopping Cart</h2>
      {tickets.length === 0 ? (
        <p>Your shopping cart is empty.</p>
      ) : (
        <div>
          {tickets.map((t, i) => {
            const totalPrice = calculatePrice(t);
            return (
              <div key={i}>
                {t.event && t.event.image && (
                  <img
                    src={`http://localhost:10002/images/${t.event.image}`}
                    alt={t.event.name}
                  />
                )}
                <h2>{t.event && t.event.name}</h2>
                <p>
                  {t.event &&
                    new Date(t.event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
                <p>{t.event && t.event.location}</p>
                <p>${totalPrice.toFixed(2)} USD</p>
                <p>
                  {t.quantity} x {t.event && t.event.price} USD
                </p>
                <button
                  type="button"
                  onClick={() => removeFromCart(userId, t._id)}
                >
                  Remove
                </button>
                {t.event && t.event._id && (
                  <Link to={`/event/${t.event._id}`}>Back</Link>
                )}
              </div>
            );
          })}
        </div>
      )}
      {tickets.length > 0 && <Link to="/checkout">Check Out</Link>}
    </div>
  );
};
