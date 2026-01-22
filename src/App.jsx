import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// User Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import TermsAndServices from "./Pages/TermsAndServices";
import CustomerService from "./Pages/CustomerService";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Hotels from "./Pages/Hotels";
import HotelDescription from "./Pages/HotelDescription";
import SearchResults from "./Pages/SearchResults";
import Profile from "./Pages/Profile";
import BookingDetails from "./Pages/BookingDetails";
import HeroSearch from "./Pages/HeroSearch";
import BookingHistory from "./Pages/BookingHistory"; // ✅ ADDED

// Layout
import Layout from "./Layout";

// Admin Pages
import AdminLayout from "./admin/adminComponents/AdminLayout";
import Dashboard from "./admin/adminPages/Dashboard";
import Users from "./admin/adminPages/UserList";
import AdminHotels from "./admin/adminPages/HotelList";
import PendingHotels from "./admin/adminPages/PendingHotels";
import Security from "./admin/adminPages/Security";
import PendingRooms from "./admin/adminPages/PendingRooms";

// Manager Pages
import ManagerLayout from "./manager/managerComponents/ManagerLayout";
import ManagerDashboard from "./manager/managerPages/ManagerDashboard";
import ManagerHotels from "./manager/managerPages/ManagerHotels";
import ManagerRooms from "./manager/managerPages/ManagerRooms";
import ManagerBookings from "./manager/managerPages/ManagerBookings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "support", element: <CustomerService /> },
      { path: "terms", element: <TermsAndServices /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Hotels
      { path: "hotels", element: <Hotels /> },
      { path: "hotels/:id", element: <HotelDescription /> },

      // Searches
      { path: "search", element: <SearchResults /> },     // Navbar search
      { path: "hero-search", element: <HeroSearch /> },   // Hero search

      // User
      { path: "profile", element: <Profile /> },
      { path: "booking-details", element: <BookingDetails /> },
      { path: "booking-history", element: <BookingHistory /> }, // ✅ ADDED
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "hotels", element: <AdminHotels /> },
      { path: "pending-hotels", element: <PendingHotels /> },
      { path: "pending-rooms", element: <PendingRooms /> },
      { path: "security", element: <Security /> },
    ],
  },

  {
    path: "/manager",
    element: <ManagerLayout />,
    children: [
      { index: true, element: <ManagerDashboard /> },
      { path: "hotels", element: <ManagerHotels /> },
      { path: "rooms", element: <ManagerRooms /> },
      { path: "bookings", element: <ManagerBookings /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
