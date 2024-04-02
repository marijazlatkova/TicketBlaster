import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import style from "./create-event.module.css";

export const CreateEvent = () => {
  const navigate = useNavigate();
  const fileInput = useRef(null);
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

  const handleUploadClick = () => {
    fileInput.current.click();
  };

  return (
    <div className={style["create-event"]}>
      <form method="POST" encType="multipart/form-data">
        <div className={style["first-section"]}>
          <div className={style["event-name"]}>
            <label htmlFor="event-name">Event Name</label>
            <br />
            <input
              type="text"
              value={eventData.name}
              onChange={(e) => handleInputChange(e, "name")}
            />
          </div>
          <div className={style["event-category"]}>
            <label htmlFor="category">Category</label>
            <br />
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value=""></option>
              <option value="Musical Concert">Musical Concert</option>
              <option value="Stand-up Comedy">Stand Up Comedy</option>
            </select>
          </div>
          <div className={style["event-date"]}>
            <label htmlFor="date">Date</label>
            <br />
            <input
              type="date"
              value={eventData.date}
              onChange={handleDateChange}
            />
            {dateError && <p>{dateError}</p>}
          </div>
        </div>
        <div className={style["second-section"]}>
          <div className={style["image-wrapper"]}>
            <button
              className={style["upload-image"]}
              type="button"
              onClick={handleUploadClick}
            >
              Upload Event Art
            </button>
            <input
              className={style["file-input"]}
              type="file"
              ref={fileInput}
              onChange={handleImagePreview}
              required
            />
            <div className={style["event-image"]}>
              <p>Event Photo</p>
              {previewImage && (
                <img className={style["preview-image"]} src={previewImage} />
              )}
            </div>
          </div>
          <div className={style["event-details-wrapper"]}>
            <div>
              <label htmlFor="eventDetails">Event Details</label>
              <br />
              <textarea
                className={style["event-details"]}
                value={eventData.eventDetails}
                onChange={(e) => handleInputChange(e, "eventDetails")}
              />
            </div>
            <div className={style["location-price-wrapper"]}>
              <div>
                <label htmlFor="location">Location</label>
                <br />
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => handleInputChange(e, "location")}
                />
              </div>
              <div>
                <label htmlFor="price">Ticket Price</label>
                <br />
                <input
                  type="text"
                  value={eventData.price}
                  onChange={(e) => handleInputChange(e, "price")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={style["related-events"]}>
          <h3>Related Events</h3>
          <div className={style["select-events"]}>
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
              {selectedCategory === "" && (
                <p className={style["select-category"]}>
                  Please select a category.
                </p>
              )}
            </div>
            <div>
              <button
                className={style["add"]}
                type="button"
                onClick={handleAddEvent}
              >
                Add
              </button>
            </div>
            {selectedCategory && (
              <button
                className={style["save"]}
                type="button"
                onClick={createEvent}
              >
                Save
              </button>
            )}
          </div>
          <div className={style["messages"]}>
            {relatedEvents.length === 2 ? (
              <p>You've reached maximum amount of events.</p>
            ) : relatedEvents.find((event) => event._id === eventToAdd._id) ? (
              <p>This event is already added.</p>
            ) : null}
          </div>
          <div className={style["container"]}>
            {relatedEvents.map((event, i) => {
              return (
                <div key={event._id} className={style["content"]}>
                  <img
                    className={style["related-event-image"]}
                    src={`http://localhost:10002/images/${event.image}`}
                  />
                  <div className={style["wrapper"]}>
                    <div>
                      <p className={style["related-event-name"]}>
                        {event.name}
                      </p>
                      <p className={style["related-event-date"]}>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className={style["related-event-location"]}>
                        {event.location}
                      </p>
                    </div>
                    <div>
                      <button
                        className={style["remove"]}
                        type="button"
                        onClick={() => handleRemoveEvent(i)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
