import { useState, useEffect, createContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [userFullname, setUserFullname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userImage, setUserImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
    localStorage.setItem("searchQuery", query);
  };

  const updateUserImage = (newImage) => {
    setUserImage(newImage);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setUserId(decodedToken.id);

        const res = await fetch(
          `http://localhost:10005/api/v1/users/${decodedToken.id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        const user = data;

        setUserImage(user.image);
        setUserFullname(user.fullname);
        setUserEmail(user.email);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logIn = async () => {
    setIsLoggedIn(true);
    await fetchUserData();
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole("");
    setUserId("");
    setUserImage("");
    setUserFullname("");
    setUserEmail("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const contextValue = {
    isLoggedIn,
    userRole,
    userId,
    userImage,
    userFullname,
    userEmail,
    searchQuery,
    updateSearchQuery,
    updateUserImage,
    setIsLoggedIn,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
