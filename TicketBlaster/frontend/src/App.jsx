import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/nav/Nav";

import { CreateAccount } from "./components/create-account/CreateAccount";
import { Login } from "./components/login/Login";
import { ForgotPassword } from "./components/forgot-password/ForgotPassword";

export const App = () => {
  return (
    <div id="app">
      <Nav />
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};
