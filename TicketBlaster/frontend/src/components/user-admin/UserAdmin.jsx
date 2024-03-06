import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

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
    navigate("/user/user-details");
  }, [userRole]);

  useEffect(() => {
    updatePageTitle();
  }, [location]);

  return (
    <div>
      <div>
        <h2>{pageTitle}</h2>
        {userRole === "administrator" &&
          !createEvent &&
          location.pathname.split("/")[2] === "events" && (
            <Link to="/user/create-event" onClick={toggleCreateEvent}>
              Create Event
            </Link>
          )}
      </div>
      <div>
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
      <Outlet />
    </div>
  );
};
