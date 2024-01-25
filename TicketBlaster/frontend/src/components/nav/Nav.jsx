import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import logo from "../logo/logo.png";
import style from "./nav.module.css";

export const Nav = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { updateSearchQuery } = useContext(AuthContext);

  const handleSearchInputChange = (e) => {
    if (e.key === "Enter") {
      navigate("/events");
      updateSearchQuery(searchInput);
      setSearchInput("");
    }
  };

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
        <div>
          <input
            type="search"
            name="keyword"
            id="keyword"
            placeholder="Search..."
            className={style["search"]}
            onKeyDown={handleSearchInputChange}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
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
