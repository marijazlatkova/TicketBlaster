import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
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
import { UserAdmin } from "./components/user-admin/UserAdmin";
import { CreateEvent } from "./components/component-parts/create-event/CreateEvent";
import { Events } from "./components/component-parts/events/Events";
import { Users } from "./components/component-parts/users/Users";
import { TicketsHistory } from "./components/component-parts/tickets-history/TicketsHistory";
import { UserDetails } from "./components/component-parts/user-details/UserDetails";
import { Footer } from "./components/footer/Footer";

export const App = () => {
  const { isLoggedIn, userRole } = useContext(AuthContext);
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<EventsHero />} />
        <Route path="/search-events" element={<Search />} />
        {!isLoggedIn && (
          <>
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </>
        )}
        <Route path="/musical-concerts" element={<MusicalConcerts />} />
        <Route path="/stand-up-comedy" element={<StandUpComedy />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/user/" element={<UserAdmin />}>
          {isLoggedIn && userRole === "administrator" && (
            <>
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="events" element={<Events />} />
              <Route path="users" element={<Users />} />
            </>
          )}
          <Route path="tickets-history" element={<TicketsHistory />} />
          <Route path="user-details" element={<UserDetails />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};
