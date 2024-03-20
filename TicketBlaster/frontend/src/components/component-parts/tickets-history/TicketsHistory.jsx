import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

import logo from "../../logo+qr/logo-black.png";
import qr from "../../logo+qr/qr.png";

export const TicketsHistory = () => {
  const { userId } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [popup, setPopup] = useState(false);
  const [popupTicket, setPopupTicket] = useState(null);

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

  const closePopup = () => {
    setPopup(false);
    setPopupTicket(null);
  };

  return (
    <div>
      {tickets.length === 0 ? (
        <p>You haven't purchased any tickets yet.</p>
      ) : (
        <div>
          {tickets.map((ticket) => (
            <div key={ticket._id}>
              <img
                src={`http://localhost:10002/images/${ticket.event.image}`}
                alt={ticket.event.name}
              />
              <h2>{ticket.event.name}</h2>
              <p>
                {new Date(ticket.event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>{ticket.event.eventDetails}</p>
              <div>
                <p>{ticket.event.location}</p>
                <button
                  onClick={() => {
                    setPopup(true);
                    setPopupTicket(ticket);
                  }}
                >
                  Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {popupTicket && (
        <div>
          <img src={logo} alt="logo" />
          <button type="button" onClick={closePopup}>
            x
          </button>
          <img
            src={`http://localhost:10002/images/${popupTicket.event.image}`}
            alt={popupTicket.event.name}
          />
          <div>
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
            </div>
            <div>
              <img src={qr} alt="scan-qr-code" />
            </div>
          </div>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};
