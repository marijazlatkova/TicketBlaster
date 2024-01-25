import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "./stand-up-comedy.module.css";

export const StandUpComedy = () => {
  const [comedies, setComedies] = useState([]);
  const [displayComedies, setDisplayComedies] = useState(6);

  const getStandUpComedies = async () => {
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

  const loadMore = () => {
    setDisplayComedies((displayComedies) => displayComedies + 6);
  };

  useEffect(() => {
    getStandUpComedies();
  }, []);

  return (
    <div className={style["stand-up-comedy"]}>
      <h2>Stand-up Comedy</h2>
      <div className={style["comedies"]}>
        {comedies &&
          comedies
            .filter((comedy) => comedy.category === "Stand-up Comedy")
            .slice(0, displayComedies)
            .map((comedy, i) => (
              <div key={i} className={style["comedy"]}>
                <div>
                  <img
                    src={`http://localhost:10002/images/${comedy.image}`}
                    alt={comedy.name}
                  />
                </div>
                <div className={style["first-section"]}>
                  <p>{comedy.name}</p>
                  <p>
                    {new Date(comedy.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    {comedy.eventDetails.split(" ").slice(0, 22).join(" ")}
                    {comedy.eventDetails.split(" ").length > 22 && "..."}
                  </p>
                  <div className={style["second-section"]}>
                    <p>{comedy.location}</p>
                    <Link to={`/event/${comedy._id}`}>Get Tickets</Link>
                  </div>
                </div>
              </div>
            ))}
      </div>
      <Link onClick={loadMore}>Load More Stand-Up Comedy Shows</Link>
    </div>
  );
};
