import { useEffect, useState } from "react";

import style from "./events.module.css";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [eventToRemove, setEventToRemove] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:10003/api/v1/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const removeEvent = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:10003/api/v1/events/${eventId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
        setPopUp(false);
      } else {
        throw new Error("Failed to remove event");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openPopUp = (eventId) => {
    setEventToRemove(eventId);
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
  };

  return (
    <div className={style["events"]}>
      {events.map((event) => (
        <div>
          <div key={event._id} className={style["container"]}>
            <div className={style["content"]}>
              <img
                className={style["event-image"]}
                src={`http://localhost:10002/images/${event.image}`}
                alt={event.name}
              />
              <div className={style["name-date-location-wrapper"]}>
                <p className={style["event-name"]}>{event.name}</p>
                <div className={style["date-location-wrapper"]}>
                  <p className={style["event-date"]}>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className={style["event-location"]}>{event.location}</p>
                </div>
              </div>
            </div>
            <button
              className={style["popup-delete"]}
              onClick={() => openPopUp(event._id)}
            >
              Delete Event
            </button>
          </div>
          <hr className={style["hr"]} />
        </div>
      ))}
      {popUp && (
        <div className={style["popup-wrapper"]}>
          <h2>Are you sure?</h2>
          <p>
            You are about to delete an event from the system. Please proceed
            with caution.
          </p>
          <div className={style["cancel-delete-wrapper"]}>
            <button className={style["cancel"]} onClick={closePopUp}>
              Cancel
            </button>
            <button
              className={style["delete-event"]}
              onClick={() => removeEvent(eventToRemove)}
            >
              Delete Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
