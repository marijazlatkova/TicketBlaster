import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "./musical-concerts.module.css";

export const MusicalConcerts = () => {
  const [concerts, setConcerts] = useState([]);
  const [displayConcerts, setDisplayConcerts] = useState(6);
  const maxWordsPerRow = 10;
  const maxRows = 2;

  const fetchMusicalConcerts = async () => {
    try {
      const res = await fetch("http://localhost:10003/api/v1/events");
      if (!res.ok) {
        throw new Error(`An error has occurred: ${res.status}`);
      }
      const data = await res.json();
      setConcerts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMusicalConcerts();
  }, []);

  const truncateEventDetails = (details) => {
    const words = details.split(" ");
    const truncatedWords = words.slice(0, maxWordsPerRow * maxRows);
    return (
      truncatedWords.join(" ") +
      (words.length > maxWordsPerRow * maxRows ? "..." : "")
    );
  };

  const loadMoreConcerts = () => {
    setDisplayConcerts((displayConcerts) => displayConcerts + 6);
  };

  return (
    <div className={style["musical-concerts"]}>
      <h2>Musical Concerts</h2>
      <div className={style["concerts"]}>
        {concerts &&
          concerts
            .filter((concert) => concert.category === "Musical Concert")
            .slice(0, displayConcerts)
            .map((concert, i) => (
              <div key={i} className={style["concert"]}>
                <div>
                  <img
                    src={`http://localhost:10002/images/${concert.image}`}
                    alt={concert.name}
                  />
                </div>
                <div className={style["first-section"]}>
                  <p className={style["concert-name"]}>{concert.name}</p>
                  <p className={style["concert-date"]}>
                    {new Date(concert.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className={style["concert-details"]}>
                    {truncateEventDetails(concert.eventDetails)}
                  </p>
                  <div className={style["second-section"]}>
                    <p className={style["concert-location"]}>
                      {concert.location}
                    </p>
                    <Link
                      className={style["get-tickets"]}
                      to={`/event/${concert._id}`}
                    >
                      Get Tickets
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {concerts.length > displayConcerts && (
        <Link
          className={style["load-more-concerts"]}
          onClick={loadMoreConcerts}
        >
          Load More Musical Concerts
        </Link>
      )}
    </div>
  );
};
