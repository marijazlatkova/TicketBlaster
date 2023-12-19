import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/nav/Nav";

import { CreateAccount } from "./components/create-account/CreateAccount";

export const App = () => {
  return (
    <div id="app">
      <Nav />
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </div>
  );
};
