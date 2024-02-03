import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "./events.module.css";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const maxWordsPerRow = 10;
  const maxRows = 2;

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:10003/api/v1/events");
      const events = await res.json();
      setEvents(events);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const truncateEventDetails = (details) => {
    const words = details.split(" ");
    const truncatedWords = words.slice(0, maxWordsPerRow * maxRows);
    return (
      truncatedWords.join(" ") +
      (words.length > maxWordsPerRow * maxRows ? "..." : "")
    );
  };

  return (
    <div className={style["events"]}>
      <div className={style["hero-section"]}>
        {events && events.length > 0 && (
          <div className={style["hero-container"]}>
            <img
              className={style["hero-image"]}
              src={`http://localhost:10002/images/${events[13].image}`}
              alt={events[13].name}
            />
            <div>
              <div className={style["hero-content"]}>
                <h2 className={style["hero-name"]}>{events[13].name}</h2>
                <div className={style["hero-date-location-wrapper"]}>
                  <p className={style["hero-date"]}>
                    {new Date(events[13].date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    ,
                  </p>
                  <p className={style["hero-location"]}>
                    {events[13].location}
                  </p>
                </div>
              </div>
            </div>
            <Link
              className={style["get-tickets-hero-button"]}
              to={`/event/${events[13]._id}`}
            >
              Get tickets
            </Link>
          </div>
        )}
      </div>
      <div className={style["events-section"]}>
        <div className={style["events-container"]}>
          <div className={style["event-category"]}>
            <h2>Musical Concerts</h2>
            <div className={style["events"]}>
              {events &&
                events
                  .filter((event) => event.category === "Musical Concert")
                  .slice(5, 10)
                  .map((event, i) => (
                    <div key={i} className={style["event"]}>
                      <div>
                        <img
                          src={`http://localhost:10002/images/${event.image}`}
                          alt={event.name}
                        />
                      </div>
                      <div className={style["first-section"]}>
                        <p className={style["event-name"]}>{event.name}</p>
                        <p className={style["event-date"]}>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className={style["event-details"]}>
                          {truncateEventDetails(event.eventDetails)}
                        </p>
                        <div className={style["second-section"]}>
                          <p className={style["event-location"]}>
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
            <Link className={style["link-to-category"]} to="/musical-concerts">
              See All Musical Concerts
            </Link>
          </div>
          <div className={style["event-category"]}>
            <h2>Stand-up Comedy</h2>
            <div className={style["events"]}>
              {events &&
                events
                  .filter((event) => event.category === "Stand-up Comedy")
                  .slice(0, 5)
                  .map((event, i) => (
                    <div key={i} className={style["event"]}>
                      <div>
                        <img
                          src={`http://localhost:10002/images/${event.image}`}
                          alt={event.name}
                        />
                      </div>
                      <div className={style["first-section"]}>
                        <p className={style["event-name"]}>{event.name}</p>
                        <p className={style["event-date"]}>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className={style["event-details"]}>
                          {truncateEventDetails(event.eventDetails)}
                        </p>
                        <div className={style["second-section"]}>
                          <p className={style["event-location"]}>
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
            <Link className={style["link-to-category"]} to="/stand-up-comedy">
              See All Stand-up Comedy Shows
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
