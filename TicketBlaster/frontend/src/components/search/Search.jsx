import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./search.module.css";

export const Search = () => {
  const { searchQuery } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const maxWordsPerRow = 10;
  const maxRows = 7;

  useEffect(() => {
    const searchEvents = async () => {
      try {
        const res = await fetch("http://localhost:10003/api/v1/events");
        if (!res.ok) {
          throw new Error("An error has occurred", res.status);
        }

        const resData = await res.json();
        const allEvents = resData;

        const filteredEvents = allEvents.filter(
          (event) =>
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setEvents(filteredEvents);
      } catch (err) {
        console.log(err);
      }
    };

    searchEvents();
  }, [searchQuery]);

  const truncateEventDetails = (details) => {
    const words = details.split(" ");
    const truncatedWords = words.slice(0, maxWordsPerRow * maxRows);
    return (
      truncatedWords.join(" ") +
      (words.length > maxWordsPerRow * maxRows ? "..." : "")
    );
  };

  return (
    <div className={style["search-events"]}>
      <div className={style["search-container"]}>
        <h2>Search Results for: {searchQuery}</h2>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className={style["search"]}>
              <div>
                <img
                  src={`http://localhost:10002/images/${event.image}`}
                  alt={event.name}
                />
              </div>
              <div>
                <div className={style["first-section"]}>
                  <p className={style["event-name"]}>{event.name}</p>
                  <p className={style["event-details"]}>
                    {truncateEventDetails(event.eventDetails)}
                  </p>
                </div>
                <div className={style["second-section"]}>
                  <div className={style["event-date-location-wrapper"]}>
                    <p className={style["event-date"]}>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className={style["event-location"]}>{event.location}</p>
                  </div>
                  <Link
                    className={style["get-tickets"]}
                    to={`/event/${event._id}`}
                  >
                    Get tickets
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No matches found...</p>
        )}
      </div>
    </div>
  );
};
