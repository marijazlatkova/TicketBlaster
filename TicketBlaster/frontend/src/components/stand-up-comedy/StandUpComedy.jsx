import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "./stand-up-comedy.module.css";

export const StandUpComedy = () => {
  const [comedies, setComedies] = useState([]);
  const [displayComedies, setDisplayComedies] = useState(6);
  const maxWordsPerRow = 10;
  const maxRows = 2;

  const fetchStandUpComedies = async () => {
    try {
      const res = await fetch("http://localhost:10003/api/v1/events");
      if (!res.ok) {
        throw new Error(`An error has occurred: ${res.status}`);
      }
      const data = await res.json();
      setComedies(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStandUpComedies();
  }, []);

  const truncateEventDetails = (details) => {
    const words = details.split(" ");
    const truncatedWords = words.slice(0, maxWordsPerRow * maxRows);
    return (
      truncatedWords.join(" ") +
      (words.length > maxWordsPerRow * maxRows ? "..." : "")
    );
  };

  const loadMoreComedies = () => {
    setDisplayComedies((displayComedies) => displayComedies + 6);
  };

  return (
    <div className={style["stand-up-comedy"]}>
      <h2>Stand-up Comedy</h2>
      <div className={style["comedies"]}>
        {comedies
          .filter((comedy) => comedy.category === "Stand-up Comedy")
          .slice(0, displayComedies)
          .map((comedy) => (
            <div key={comedy._id} className={style["comedy"]}>
              <div>
                <img
                  src={`http://localhost:10002/images/${comedy.image}`}
                  alt={comedy.name}
                />
              </div>
              <div className={style["first-section"]}>
                <p className={style["comedy-name"]}>{comedy.name}</p>
                <p className={style["comedy-date"]}>
                  {new Date(comedy.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={style["comedy-details"]}>
                  {truncateEventDetails(comedy.eventDetails)}
                </p>
                <div className={style["second-section"]}>
                  <p className={style["comedy-location"]}>{comedy.location}</p>
                  <Link
                    className={style["get-tickets"]}
                    to={`/event/${comedy._id}`}
                  >
                    Get Tickets
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
      {comedies.length > displayComedies && (
        <Link
          className={style["load-more-comedies"]}
          onClick={loadMoreComedies}
        >
          Load More Stand-Up Comedy Shows
        </Link>
      )}
    </div>
  );
};
