import Home from "./Pages/Home";
import About from "./Pages/About";
import TermsAndServices from "./Pages/TermsAndServices";
import CustomerService from "./Pages/CustomerService";
import Login from "./Pages/LogIn";
import Register from "./Pages/Register";
import Hotels from "./Pages/Hotels";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/support", element: <CustomerService /> },
  { path: "/terms", element: <TermsAndServices /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/hotels", element: <Hotels /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
