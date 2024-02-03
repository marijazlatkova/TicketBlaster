import { createContext, useState, useEffect } from "react";
import * as jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userRole: "",
    userId: "",
    userImage: "",
    userName: "",
    userEmail: "",
    searchQuery: "",
  });

  const updateSearchQuery = (query) => {
    setAuthState({ ...authState, searchQuery: query });
    localStorage.setItem("searchQuery", query);
  };

  const updateUserImage = (newImage) => {
    setAuthState({ ...authState, userImage: newImage });
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        const decodedToken = jwtDecode(token);
        const res = await fetch(
          `http://localhost:10005/api/v1/users/${decodedToken.id}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        const user = data.user;

        setAuthState({
          ...authState,
          userRole: decodedToken.role,
          userId: decodedToken.id,
          userImage: user.image,
          userName: user.name,
          userEmail: user.email,
        });
      }
    } catch (err) {
      console.log("Error fetching user data:", err);
    }
  };

  const logIn = async () => {
    setAuthState({ ...authState, isLoggedIn: true });
    await fetchUserData();
  };

  const logOut = () => {
    localStorage.removeItem("jwt");
    setAuthState({
      isLoggedIn: false,
      userRole: "",
      userId: "",
      userImage: "",
      userName: "",
      userEmail: "",
      searchQuery: "",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setAuthState({ ...authState, isLoggedIn: true });
      fetchUserData();
    }
  }, []);

  const contextValue = {
    ...authState,
    updateSearchQuery,
    updateUserImage,
    setIsLoggedIn: (value) => setAuthState({ ...authState, isLoggedIn: value }),
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
