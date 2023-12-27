import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/nav/Nav";
import { CreateAccount } from "./components/create-account/CreateAccount";
import { Login } from "./components/login/Login";
import { ForgotPassword } from "./components/forgot-password/ForgotPassword";
import { ResetPassword } from "./components/reset-password/ResetPassword";
import { MusicalConcerts } from "./components/musical-concerts/MusicalConcerts";

export const App = () => {
  return (
    <div id="app">
      <Nav />
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/musical-concerts" element={<MusicalConcerts />} />
      </Routes>
    </div>
  );
};
