import { createContext, useState, useEffect } from "react";
import * as jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [userDefaultImg, setUserDefaultImage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
    localStorage.setItem("searchQuery", query);
  };

  const updateDefaultImg = (newImage) => {
    setUserDefaultImage(newImage);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setUserId(decodedToken.id);

        const res = await fetch(`/api/v1/users/${decodedToken.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        const user = data.user;

        setUserDefaultImage(user.image);
        setUserName(user.name);
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
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setUserRole("");
    setUserId("");
    setUserDefaultImage("");
    setUserName("");
    setUserEmail("");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const contextValue = {
    isLoggedIn,
    userRole,
    userId,
    userDefaultImg,
    userName,
    userEmail,
    searchQuery,
    updateSearchQuery,
    updateDefaultImg,
    setIsLoggedIn,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  throw new Error("useAuth must be used within an AuthProvider");
};
