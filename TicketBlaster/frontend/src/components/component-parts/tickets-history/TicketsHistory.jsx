import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

import logo from "../../logo+qr/logo-black.png";
import qr from "../../logo+qr/qr.png";
import style from "./tickets-history.module.css";

export const TicketsHistory = () => {
  const { userId } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [popup, setPopup] = useState(false);
  const [popupTicket, setPopupTicket] = useState(null);
  const maxWordsPerRow = 10;
  const maxRows = 2;

  const fetchTicketsHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:10004/api/v1/ecommerce/tickets-history/${userId}`
      );
      const data = await res.json();
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTicketsHistory();
  }, [userId]);

  const truncateEventDetails = (details) => {
    const words = details.split(" ");
    const truncatedWords = words.slice(0, maxWordsPerRow * maxRows);
    return (
      truncatedWords.join(" ") +
      (words.length > maxWordsPerRow * maxRows ? "..." : "")
    );
  };

  const closePopup = () => {
    setPopup(false);
    setPopupTicket(null);
  };

  return (
    <div className={style["tickets-history"]}>
      {tickets.length === 0 ? (
        <p>You haven't purchased any tickets yet.</p>
      ) : (
        <div className={style["wrapper"]}>
          {tickets.map((ticket) => (
            <div key={ticket._id} className={style["content"]}>
              <img
                src={`http://localhost:10002/images/${ticket.event.image}`}
                alt={ticket.event.name}
              />
              <div>
                <h3 className={style["event-name"]}>{ticket.event.name}</h3>
                <p className={style["event-date"]}>
                  {new Date(ticket.event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={style["event-details"]}>
                  {truncateEventDetails(ticket.event.eventDetails)}
                </p>
                <div className={style["location-print-wrapper"]}>
                  <p className={style["event-location"]}>
                    {ticket.event.location}
                  </p>
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
          ))}
        </div>
      )}
      {popup && popupTicket && (
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
            <div className={style["qr-code"]}>
              <img src={qr} alt="scan-qr-code" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
