import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import logo from "../logo+qr/logo-black.png";
import qr from "../logo+qr/qr.png";

export const Purchase = () => {
  const { userId } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [popup, setPopup] = useState(false);
  const [popupTicket, setPopupTicket] = useState(null);

  const fetchPurchasedTickets = async () => {
    try {
      const res = await fetch(
        `http://localhost:10004/api/v1/ecommerce/purchased-tickets/${userId}`
      );
      const data = await res.json();
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPurchasedTickets();
  }, [userId]);

  const calculatePrice = (t) => {
    const quantity = t.quantity;
    const price = t.event.price;
    const priceParts = price.split("$");
    const priceValue = Number(priceParts[1]);
    return quantity * priceValue;
  };

  const closePopup = () => {
    setPopup(false);
    setPopupTicket(null);
  };

  return (
    <>
      <h1>Thank you for your purchase!</h1>
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
                <p>${totalPrice.toFixed(2)}</p>
                <p>
                  {t.quantity} x {t.event.price} USD
                </p>
                <button
                  onClick={() => {
                    setPopup(true);
                    setPopupTicket(t);
                  }}
                >
                  Print
                </button>
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          );
        })}
      {popup && popupTicket && (
        <div onClick={closePopup}>
          <div>
            <img src={logo} alt="logo" />
            <img
              src={`http://localhost:10002/images/${popupTicket.event.image}`}
              alt={popupTicket.event.name}
            />
            <div>
              <p>{popupTicket.event.name}</p>
              <p>
                {new Date(popupTicket.event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>{popupTicket.event.location}</p>
              <img src={qr} alt="scan-qr-code" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
