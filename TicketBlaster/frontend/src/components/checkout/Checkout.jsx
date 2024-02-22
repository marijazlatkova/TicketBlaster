import validator from "validator";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./checkout.module.css";

export const Checkout = () => {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [fullName, setFullName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expires, setExpires] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState({});

  const fetchTickets = async () => {
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
    fetchTickets();
  }, [userId]);

  const processPayment = async () => {
    try {
      const userData = {
        user: userId,
      };
      const res = await fetch(
        "http://localhost:10004/api/v1/ecommerce/process-payment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (res.ok) {
        console.log("Payment processed successfully!");
      } else {
        console.log("Payment failed:", res.status);
      }
    } catch (err) {
      console.log("Error processing payment:", err);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!validator.isLength(fullName, { min: 2 })) {
      errors.fullName = "Full Name must be at least 2 characters long";
    }

    if (!validator.isCreditCard(cardNo)) {
      errors.cardNo = "Invalid credit card number";
    }

    if (!validator.isAfter(expires)) {
      errors.expires = "Expiration date must be in the future";
    }

    if (
      !validator.isNumeric(pin) ||
      !validator.isLength(pin, { min: 3, max: 3 })
    ) {
      errors.pin = "PIN must be a 3-digit number";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      await processPayment();
      navigate("/purchase");
      setErrors({});
    } else {
      setErrors(errors);
    }
  };

  const calculatePrice = (t) => {
    const quantity = t.quantity;
    const price = t.event.price;
    const priceParts = price.split("$");
    const priceValue = Number(priceParts[1]);
    return quantity * priceValue;
  };

  const calculateAmount = () => {
    let amount = 0;
    tickets.forEach((t) => {
      const price = calculatePrice(t);
      amount += price;
    });
    return amount;
  };

  return (
    <div className={style["checkout"]}>
      <h2 className={style["title"]}>Checkout</h2>
      <div className={style["section-container"]}>
        <div className={style["first-section"]}>
          {tickets &&
            tickets.map((t, i) => {
              const totalPrice = calculatePrice(t);
              return (
                <div key={i} className={style["content"]}>
                  <div className={style["event-wrapper"]}>
                    <img
                      className={style["event-image"]}
                      src={`http://localhost:10002/images/${t.event.image}`}
                      alt={t.event.name}
                    />
                    <div className={style["name-date-location-wrapper"]}>
                      <h2 className={style["event-name"]}>{t.event.name}</h2>
                      <p className={style["event-date"]}>
                        {new Date(t.event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className={style["event-location"]}>
                        {t.event.location}
                      </p>
                    </div>
                  </div>
                  <div className={style["price-wrapper"]}>
                    <p className={style["event-price"]}>
                      ${totalPrice.toFixed(2)} USD
                    </p>
                    <p className={style["event-price-calculated"]}>
                      {t.quantity} x {t.event.price} USD
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className={style["second-section"]}>
          <form>
            <div>
              <label>Full Name</label>
              <br />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <p>{errors.fullName}</p>}
            </div>
            <div>
              <label>Card No.</label>
              <br />
              <input
                type="text"
                value={cardNo}
                onChange={(e) => setCardNo(e.target.value)}
              />
              {errors.cardNo && <p>{errors.cardNo}</p>}
            </div>
            <div>
              <label>Expires</label>
              <br />
              <input
                type="month"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
              />
              {errors.expires && <p>{errors.expires}</p>}
            </div>
            <div>
              <label>Pin</label>
              <br />
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              {errors.pin && <p>{errors.pin}</p>}
            </div>
          </form>
        </div>
      </div>
      <hr className={style["hr"]} />
      <div className={style["total-price-wrapper"]}>
        <p className={style["total"]}>Total:</p>
        <p className={style["total-price"]}>
          ${calculateAmount().toFixed(2)} USD
        </p>
      </div>
      <div className={style["buttons-wrapper"]}>
        <Link className={style["back"]} to="/shopping-cart">
          Back
        </Link>
        <button className={style["pay-now"]} onClick={handleSubmit}>
          Pay Now
        </button>
      </div>
    </div>
  );
};
