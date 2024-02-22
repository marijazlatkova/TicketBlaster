import { jwtDecode } from "jwt-decode";
import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [userFullname, setUserFullname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userRole, setUserRole] = useState("");

  const getUserData = async () => {
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

        setUserFullname(user.fullname);
        setUserEmail(user.email);
        setUserImage(user.image);
        setUserRole(user.role);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      getUserData();
    }
  }, []);

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    localStorage.setItem("searchQuery", query);
  };

  const handleUserImage = (newImage) => {
    setUserImage(newImage);
  };

  const login = async () => {
    setIsLoggedIn(true);
    await getUserData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole("");
    setUserId("");
    setUserImage("");
    setUserFullname("");
    setUserEmail("");
  };

  const contextValue = {
    isLoggedIn,
    searchQuery,
    userId,
    userFullname,
    userEmail,
    userImage,
    userRole,
    setIsLoggedIn,
    handleSearchQuery,
    handleUserImage,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
