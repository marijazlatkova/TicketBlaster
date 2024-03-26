import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import style from "./user-admin.module.css";

export const UserAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, logout } = useContext(AuthContext);
  const [createEvent, setCreateEvent] = useState(false);
  const [pageTitle, setPageTitle] = useState("");

  const updatePageTitle = () => {
    switch (location.pathname.split("/")[2]) {
      case "events":
      case "create-event":
        setPageTitle("Events");
        break;
      case "users":
        setPageTitle("Users");
        break;
      case "tickets-history":
        setPageTitle("Tickets History");
        break;
      case "user-details":
        setPageTitle("User Details");
        break;
      default:
        setPageTitle("");
        break;
    }
  };

  const toggleCreateEvent = () => {
    setCreateEvent(true);
  };

  const resetCreateEvent = () => {
    setCreateEvent(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userRole === "administrator") {
      navigate("/user/events");
    } else {
      navigate("/user/tickets-history");
    }
  }, [userRole]);

  useEffect(() => {
    updatePageTitle();
  }, [location]);

  return (
    <div className={style["user-admin"]}>
      <div className={style["container"]}>
        <div className={style["left-section"]}>
          <h2>{pageTitle}</h2>
          {userRole === "administrator" &&
            !createEvent &&
            location.pathname.split("/")[2] === "events" && (
              <button
                className={style["create-event"]}
                onClick={() => {
                  toggleCreateEvent();
                  navigate("/user/create-event");
                }}
              >
                Create Event
              </button>
            )}
        </div>
        <div className={style["right-section"]}>
          <ul>
            {userRole === "administrator" && (
              <li>
                <Link to="/user/events" onClick={resetCreateEvent}>
                  Events
                </Link>
              </li>
            )}
            {userRole === "administrator" && (
              <li>
                <Link to="/user/users" onClick={resetCreateEvent}>
                  Users
                </Link>
              </li>
            )}
            <li>
              <Link to="/user/tickets-history" onClick={resetCreateEvent}>
                Tickets History
              </Link>
            </li>
            <li>
              <Link to="/user/user-details" onClick={resetCreateEvent}>
                User Details
              </Link>
            </li>
            <li>
              <Link onClick={handleLogout}>Log Out</Link>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
