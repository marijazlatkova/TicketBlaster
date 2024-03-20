import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import logo from "../logo+qr/logo-black.png";
import style from "./event-details.module.css";

export const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [eventDetails, setEventDetails] = useState({});
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const maxWordsPerRow = 10.5;
  const maxRows = 2;

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`http://localhost:10003/api/v1/events/${id}`);
      const event = await res.json();
      setEventDetails(event);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const truncateEventDetails = (details) => {
    const words = details.split(" ");
    const truncatedWords = words.slice(0, maxWordsPerRow * maxRows);
    return (
      truncatedWords.join(" ") +
      (words.length > maxWordsPerRow * maxRows ? "..." : "")
    );
  };

  const handleAddToCart = async () => {
    try {
      const quantityToAdd =
        selectedQuantity && selectedQuantity > 0 ? selectedQuantity : 1;

      const res = await fetch(
        "http://localhost:10004/api/v1/ecommerce/add-to-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: userId,
            tickets: [{ event: id, quantity: quantityToAdd }],
          }),
        }
      );

      if (res.ok) {
        navigate("/shopping-cart");
      } else {
        console.log(`Failed to add to cart. Status: ${res.status}`);
      }
    } catch (err) {
      console.log("Error adding to cart:", err);
    }
  };

  const handleAddToCartPopUp = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsPopUpVisible(true);
    } else {
      handleAddToCart();
    }
  };

  return (
    <div className={style["event"]}>
      <div className={style["first-section"]}>
        <h2 className={style["event-name"]}>{eventDetails.name}</h2>
        <p className={style["event-date"]}>
          {new Date(eventDetails.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className={style["event-location"]}>{eventDetails.location}</p>
      </div>

      <div className={style["second-section"]}>
        <img
          className={style["event-image"]}
          src={`http://localhost:10002/images/${eventDetails.image}`}
          alt={eventDetails.name}
        />
        <div className={style["event-about-tickets-wrapper"]}>
          <p className={style["about"]}>About</p>
          <p className={style["event-details"]}>{eventDetails.eventDetails}</p>

          <div className={style["event-tickets-price-wrapper"]}>
            <p className={style["tickets"]}>Tickets</p>
            <p className={style["event-price"]}>{eventDetails.price} USD</p>
          </div>

          <form method="POST">
            <input
              className={style["quantity"]}
              type="number"
              name="quantity"
              placeholder="1"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(e.target.value)}
            />
            <button
              className={style["add-to-cart"]}
              type="submit"
              onClick={handleAddToCartPopUp}
            >
              Add to cart
            </button>
          </form>
        </div>
      </div>

      {isPopUpVisible && (
        <div className={style["popup-wrapper"]}>
          <img className={style["logo"]} src={logo} alt="logo" />
          <button
            className={style["close-button"]}
            type="button"
            onClick={() => setIsPopUpVisible(false)}
          >
            x
          </button>
          <p>Please sign in or create an account to add items to your cart.</p>
          <button
            className={style["login"]}
            type="button"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
          <button
            className={style["create-account"]}
            type="button"
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
        </div>
      )}

      <h2 className={style["related-acts-title"]}>Related Acts</h2>
      <div className={style["third-section"]}>
        {eventDetails.relatedActs &&
          eventDetails.relatedActs.map((event) => (
            <div key={event._id} className={style["related-acts"]}>
              <img
                src={`http://localhost:10002/images/${event.image}`}
                alt={event.name}
                className={style["related-acts-image"]}
              />
              <div className={style["section-1"]}>
                <h2 className={style["related-acts-name"]}>{event.name}</h2>
                <h2 className={style["related-acts-date"]}>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <p className={style["related-acts-details"]}>
                  {truncateEventDetails(event.eventDetails)}
                </p>
                <div className={style["section-2"]}>
                  <p className={style["related-acts-location"]}>
                    {event.location}
                  </p>
                  <Link
                    className={style["get-tickets"]}
                    to={`/event/${event._id}`}
                  >
                    Get Tickets
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
