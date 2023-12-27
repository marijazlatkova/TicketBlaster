import { Link } from "react-router-dom";

import style from "./nav.module.css";

export const Nav = () => {
  return (
    <div id="nav">
      <ul>
        <li>
          <Link to="/musical-concerts">Musical Concerts</Link>
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
