import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./search-events.module.css";

export const SearchEvents = () => {
  const [events, setEvents] = useState([]);
  const { searchQuery } = useContext(AuthContext);

  useEffect(() => {
    const searchedEvents = async () => {
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
            event.eventDetails.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setEvents(filteredEvents);
      } catch (err) {
        console.log(err);
      }
    };

    searchedEvents();
  }, [searchQuery]);

  return (
    <div className={style["search-events"]}>
      <h1>Search Results for: {searchQuery}</h1>
      <div>
        {events.length > 0 ? (
          events.map((event, i) => (
            <div key={i}>
              <div>
                <img
                  src={`http://localhost:10002/images/${event.image}`}
                  alt={event.name}
                />
              </div>
              <div>
                <div>
                  <p className={style["event-name"]}>{event.name}</p>
                  <p className={style["event-details"]}>{event.eventDetails}</p>
                  <p className={style["event-date"]}>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className={style["event-location"]}>{event.location}</p>
                </div>
                <div>
                  <Link to={`/event/${event._id}`}>Get tickets</Link>
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
