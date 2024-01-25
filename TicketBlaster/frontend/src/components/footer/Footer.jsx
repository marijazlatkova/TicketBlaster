import { Link } from "react-router-dom";

import style from "./footer.module.css";

export const Footer = () => {
  return (
    <div className={style["footer"]}>
      <div>
        <div className={style["left-section-footer"]}>
          <Link to="/musical-concerts">Musical Concerts</Link>
          <Link to="/stand-up-comedy">Stand-up Comedy</Link>
        </div>
        <div className={style["right-section-footer"]}>
          <p>Copyright TicketBlaster 2024</p>
        </div>
      </div>
    </div>
  );
};
