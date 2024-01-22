import { Link } from "react-router-dom";
import logo from "../logo/logo.png";

import style from "./nav.module.css";

export const Nav = () => {
  return (
    <div className={style["nav"]}>
      <Link to="/">
        <img src={logo} alt="logo" className={style["logo"]} />
      </Link>
      <ul>
        <li>
          <Link to="/musical-concerts">Musical Concerts</Link>
        </li>
        <li>
          <Link to="/stand-up-comedy">Stand-up Comedy</Link>
        </li>
        <li>
          <Link to="/login">Log in</Link>
        </li>
        <li>
          <Link to="/create-account">Create Account</Link>
        </li>
      </ul>
    </div>
  );
};
