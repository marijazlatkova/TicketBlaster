import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/nav/Nav";
import { EventsHero } from "./components/events-hero/EventsHero";
import { Search } from "./components/search/Search";
import { CreateAccount } from "./components/create-account/CreateAccount";
import { Login } from "./components/login/Login";
import { ForgotPassword } from "./components/forgot-password/ForgotPassword";
import { ResetPassword } from "./components/reset-password/ResetPassword";
import { MusicalConcerts } from "./components/musical-concerts/MusicalConcerts";
import { StandUpComedy } from "./components/stand-up-comedy/StandUpComedy";
import { EventDetails } from "./components/event-details/EventDetails";
import { ShoppingCart } from "./components/shopping-cart/ShoppingCart";
import { Checkout } from "./components/checkout/Checkout";
import { Purchase } from "./components/purchase/Purchase";
import { Footer } from "./components/footer/Footer";

export const App = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<EventsHero />} />
        <Route path="/search-events" element={<Search />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/musical-concerts" element={<MusicalConcerts />} />
        <Route path="/stand-up-comedy" element={<StandUpComedy />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/purchase" element={<Purchase />} />
      </Routes>
      <Footer />
    </div>
  );
};
