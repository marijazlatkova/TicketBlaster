import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import logo from "../logo+qr/logo.png";
import style from "./nav.module.css";

export const Nav = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { isLoggedIn, updateSearchQuery } = useContext(AuthContext);

  const handleSearchInputChange = (e) => {
    if (e.key === "Enter") {
      navigate("/events");
      updateSearchQuery(searchInput);
      setSearchInput("");
    }
  };

  return (
    <div className={style["nav"]}>
      <div className={style["left-section"]}>
        <Link to="/">
          <img src={logo} alt="logo" className={style["logo"]} />
        </Link>
        <ul>
          <li className={style["musical-concerts"]}>
            <Link to="/musical-concerts">Musical Concerts</Link>
          </li>
          <li className={style["stand-up-comedy"]}>
            <Link to="/stand-up-comedy">Stand-up Comedy</Link>
          </li>
        </ul>
      </div>
      <div className={style["right-section"]}>
        <div>
          <input
            type="search"
            name="keyword"
            placeholder="Search"
            className={style["search"]}
            onKeyDown={handleSearchInputChange}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <ul>
          {isLoggedIn ? (
            <div>
              <li>
                <Link to="/shopping-cart">
                  <i className="fa fa-shopping-cart"></i>
                </Link>
              </li>
            </div>
          ) : (
            <div className={style["login-create-account-wrapper"]}>
              <li className={style["login"]}>
                <Link to="/login">Log In</Link>
              </li>
              <li className={style["create-account"]}>
                <Link to="/create-account">Create Account</Link>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
