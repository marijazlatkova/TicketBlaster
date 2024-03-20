import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import logo from "../logo+qr/logo-black.png";
import qr from "../logo+qr/qr.png";
import style from "./purchase.module.css";

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

  const calculatePrice = (ticket) => {
    const quantity = ticket.quantity;
    const price = ticket.event.price;
    const priceParts = price.split("$");
    const priceValue = Number(priceParts[1]);
    return quantity * priceValue;
  };

  const closePopup = () => {
    setPopup(false);
    setPopupTicket(null);
  };

  return (
    <div className={style["purchase"]}>
      <h2 className={style["title"]}>Thank you for your purchase!</h2>
      {tickets &&
        tickets.map((ticket, index) => {
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
                    <h2 className={style["event-name"]}>{ticket.event.name}</h2>
                    <p className={style["event-date"]}>
                      {new Date(ticket.event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className={style["event-location"]}>
                      {ticket.event.location}
                    </p>
                  </div>
                </div>

                <div className={style["second-section"]}>
                  <div className={style["price-wrapper"]}>
                    <div>
                      <p className={style["event-price"]}>
                        ${totalPrice.toFixed(2)} USD
                      </p>
                      <p className={style["event-total-price"]}>
                        {ticket.quantity} x {ticket.event.price} USD
                      </p>
                    </div>
                    <button
                      className={style["print-button"]}
                      onClick={() => {
                        setPopup(true);
                        setPopupTicket(ticket);
                      }}
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
              <br />
              {index === tickets.length - 1 && <hr className={style["hr"]} />}
            </div>
          );
        })}
      {popupTicket && (
        <div className={style["popup-wrapper"]}>
          <img className={style["logo"]} src={logo} alt="logo" />
          <button
            className={style["close-button"]}
            type="button"
            onClick={closePopup}
          >
            x
          </button>
          <img
            className={style["popup-image"]}
            src={`http://localhost:10002/images/${popupTicket.event.image}`}
            alt={popupTicket.event.name}
          />
          <div className={style["popup-info"]}>
            <div>
              <p className={style["popup-name"]}>{popupTicket.event.name}</p>
              <p className={style["popup-date"]}>
                {new Date(popupTicket.event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className={style["popup-location"]}>
                {popupTicket.event.location}
              </p>
            </div>
            <div>
              <img className={style["qr-code"]} src={qr} alt="scan-qr-code" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
