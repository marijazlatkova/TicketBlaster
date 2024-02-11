import validator from "validator";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

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
    const userData = { userId };
    try {
      await fetch("http://localhost:10004/api/v1/ecommerce/process-payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
    } catch (err) {
      console.log(err);
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
    <div>
      <h2>Checkout</h2>
      <div>
        {tickets &&
          tickets.map((t, i) => {
            const totalPrice = calculatePrice(t);
            return (
              <div key={i}>
                <img
                  src={`http://localhost:10002/images/${t.event.image}`}
                  alt={t.event.name}
                />
                <div>
                  <h2>{t.event.name}</h2>
                  <p>
                    {new Date(t.event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>{t.event.location}</p>
                </div>
                <div>
                  <p>${totalPrice.toFixed(2)} USD</p>
                  <div>
                    {t.quantity} x {t.event.price} USD
                  </div>
                </div>
              </div>
            );
          })}
        <div>
          <p>Total:</p>
          <p>${calculateAmount().toFixed(2)} USD</p>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p>{errors.fullName}</p>}
          </div>
          <div>
            <label>Card No.</label>
            <input
              type="text"
              value={cardNo}
              onChange={(e) => setCardNo(e.target.value)}
            />
            {errors.cardNo && <p>{errors.cardNo}</p>}
          </div>
          <div>
            <label>Expires</label>
            <input
              type="month"
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
            />
            {errors.expires && <p>{errors.expires}</p>}
          </div>
          <div>
            <label>Pin</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            {errors.pin && <p>{errors.pin}</p>}
          </div>
          <div>
            <Link to="/shopping-cart">Back</Link>
          </div>
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </div>
  );
};
