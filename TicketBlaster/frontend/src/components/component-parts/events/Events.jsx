import { useEffect, useState } from "react";

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
    <div>
      {events.map((event) => (
        <div key={event_id}>
          <div>
            <img
              width="200px"
              height="200px"
              src={`http://localhost:10002/images/${event.image}`}
              alt={event.name}
            />
            <p>{event.name}</p>
            <p>
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>{event.location}</p>
          </div>
          <button onClick={() => openPopUp(event._id)}>Delete Event</button>
        </div>
      ))}
      {popUp && (
        <div>
          <h2>Are you sure?</h2>
          <p>
            You are about to delete an event from the system. Please proceed
            with caution.
          </p>
          <div>
            <button onClick={closePopUp}>Cancel</button>
            <button onClick={() => removeEvent(eventToRemove)}>
              Delete Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
