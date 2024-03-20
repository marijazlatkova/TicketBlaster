import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateEvent = () => {
  const [events, setEvents] = useState([]);
  const [eventToAdd, setEventToAdd] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [eventData, setEventData] = useState({
    name: "",
    category: "",
    date: "",
    eventDetails: "",
    location: "",
    price: "",
    image: "",
    relatedActs: [],
  });
  const [dateError, setDateError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e, field) => {
    setEventData({ ...eventData, [field]: e.target.value });
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const currDate = new Date();
    if (date < currDate) {
      setDateError("Please select in the future");
    } else {
      setDateError("");
    }
    handleInputChange(e, "date");
  };

  const handleAddEvent = () => {
    if (!eventToAdd || relatedEvents.length >= 2) return;
    const eventId = eventToAdd._id.toString();
    if (relatedEvents.some((event) => event._id === eventId)) return;
    setRelatedEvents([...relatedEvents, eventToAdd]);
    setEventData((prevEventData) => ({
      ...prevEventData,
      relatedActs: [...prevEventData.relatedActs, eventId].filter(
        (id) => typeof id === "string"
      ),
    }));
  };

  const handleRemoveEvent = (i) => {
    const updateEvents = [...relatedEvents];
    updateEvents.splice(i, 1);
    setRelatedEvents(updateEvents);
  };

  const handleSelectEvent = (e) => {
    const eventName = e.target.value;
    const addEvent = events.find((event) => event.name === eventName);
    setEventData({
      ...eventData,
      relatedActs: [...eventData.relatedActs, addEvent],
    });
    setEventToAdd(addEvent);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    handleInputChange(e, "category");
  };

  const handleImagePreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setSelectedImage(e.target.files[0]);
    }
  };

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

  const createEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      for (let key in eventData) {
        formData.append(key, eventData[key]);
      }
      const res = await fetch("http://localhost:10003/api/v1/events", {
        method: "POST",
        body: formData,
      });
      await res.json();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form method="post" encType="multipart/form-data">
        <div>
          <div>
            <label htmlFor="event-name">Event Name</label>
            <input
              type="text"
              value={eventData.name}
              onChange={(e) => handleInputChange(e, "name")}
            />
          </div>
          <div>
            <label htmlFor="file">Upload Event Art</label>
            <input type="file" onChange={handleImagePreview} required />
          </div>
          <div>
            <img src={previewImage} alt="Event Preview Image" />
            <p>Event Photo</p>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="category">Category</label>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value=""></option>
              <option value="Musical Concert">Musical Concert</option>
              <option value="Stand-up Comedy">Stand Up Comedy</option>
            </select>
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              value={eventData.date}
              onChange={handleDateChange}
            />
            {dateError && <p>{dateError}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="eventDetails">Event Details</label>
          <textarea
            value={eventData.eventDetails}
            onChange={(e) => handleInputChange(e, "eventDetails")}
          />
        </div>
        <div>
          <div>
            <label htmlFor="price">Ticket Price</label>
            <input
              type="text"
              value={eventData.price}
              onChange={(e) => handleInputChange(e, "price")}
            />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) => handleInputChange(e, "location")}
            />
          </div>
        </div>
        <div>
          <h2>Related Events</h2>
          <div>
            <div>
              <select
                onChange={handleSelectEvent}
                value={eventToAdd ? eventToAdd.name : ""}
              >
                <option value=""></option>
                {selectedCategory !== "" &&
                  events
                    .filter((event) => event.category === selectedCategory)
                    .map((event) => {
                      return (
                        <option key={event._id} value={event.name}>
                          {event.name} -{" "}
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          - {event.location}
                        </option>
                      );
                    })}
              </select>
              {selectedCategory === "" && <p>Please select a category.</p>}
            </div>
            <div>
              <button type="button" onClick={handleAddEvent}>
                Add
              </button>
              {relatedEvents.length === 2 ? (
                <p>You've reached maxiumum amount of events.</p>
              ) : relatedEvents.find(
                  (event) => event._id === eventToAdd._id
                ) ? (
                <p>This event is already added.</p>
              ) : null}
            </div>
          </div>
          <div>
            {relatedEvents.map((event) => {
              return (
                <div key={event._id}>
                  <div>
                    <img
                      src={`http://localhost:10002/images/${event.image}`}
                      alt="Related Event"
                    />
                    <div>
                      <div>
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
                      <div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button type="button" onClick={createEvent}>
          Save
        </button>
      </form>
    </div>
  );
};
