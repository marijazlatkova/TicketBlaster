import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "./events.module.css";

export const Events = () => {
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const res = await fetch("http://localhost:10003/api/v1/events");
      const events = await res.json();
      setEvents(events);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className={style["events"]}>
      <div>
        {events && events.length > 0 && (
          <div>
            <div>
              <img
                src={`http://localhost:10002/images/${events[5].image}`}
                alt={events[5].name}
              />
              <div>
                <div>
                  <h2>{events[5].name}</h2>
                  <div>
                    <p>
                      {new Date(events[5].date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      ,
                    </p>
                    <p>{events[5].location}</p>
                  </div>
                </div>
              </div>
              <Link to={`/event/${events[5]._id}`}>Get Tickets</Link>
            </div>
          </div>
        )}
      </div>
      <div>
        <div>
          <h2>Musical Concerts</h2>
          <div>
            {events &&
              events
                .filter((event) => event.category === "Musical Concert")
                .slice(1)
                .map((event, i) => {
                  if (i >= 5) return null;
                  return (
                    <div key={i}>
                      <div>
                        <img
                          src={`http://localhost:10002/images/${event.image}`}
                          alt={event.name}
                        />
                      </div>
                      <div>
                        <p>{event.name}</p>
                        <p>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>{event.eventDetails}</p>
                        <div>
                          <p>{event.location}</p>
                          <Link to={`/event/${event._id}`}>Get Tickets</Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
          <Link to="/musical-concerts">See All Musical Concerts</Link>
        </div>
        <div>
          <h2>Stand-up Comedy</h2>
          <div>
            {events &&
              events
                .filter((event) => event.category === "Stand-up Comedy")
                .slice(1)
                .map((event, i) => {
                  if (i >= 5) return null;
                  return (
                    <div key={i}>
                      <div>
                        <img
                          src={`http://localhost:10002/images/${event.image}`}
                          alt={event.name}
                        />
                      </div>
                      <div>
                        <p>{event.name}</p>
                        <p>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>{event.eventDetails}</p>
                        <div>
                          <p>{event.location}</p>
                          <Link to={`/event/${event._id}`}>Get Tickets</Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
          <Link to="/stand-up-comedy">See All Stand-up Comedy Shows</Link>
        </div>
      </div>
    </div>
  );
};
