import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "./musical-concerts.module.css";

export const MusicalConcerts = () => {
  const [concerts, setConcerts] = useState([]);
  const [displayConcerts, setDisplayConcerts] = useState(6);

  const getMusicalConcerts = async () => {
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

  const loadMore = () => {
    setDisplayConcerts((displayConcerts) => displayConcerts + 6);
  };

  useEffect(() => {
    getMusicalConcerts();
  }, []);

  return (
    <div className={style["musical-concerts"]}>
      <h1>Musical Concerts</h1>
      <div>
        <div className={style["concerts"]}>
          {concerts &&
            concerts
              .filter((concert) => concert.category === "Musical Concert")
              .slice(0, displayConcerts)
              .map((concert, i) => (
                <div key={i}>
                  <div>
                    <img
                      width="250px"
                      height="180px"
                      src={`http://localhost:10002/images/${concert.image}`}
                      alt={concert.name}
                    />
                  </div>
                  <div>
                    <p>{concert.name}</p>
                    <p>
                      {new Date(concert.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>{concert.eventDetails}</p>
                    <div>
                      <p>{concert.location}</p>
                      <Link to={`/event/${concert._id}`}>Get Tickets</Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <Link onClick={loadMore}>Load More Musical Concerts</Link>
      </div>
    </div>
  );
};
