import Home from "./Pages/Home";
import About from "./Pages/About";
import TermsAndServices from "./Pages/TermsAndServices";
import CustomerService from "./Pages/CustomerService";
import Login from "./Pages/LogIn";
import Register from "./Pages/Register";
import Hotels from "./Pages/Hotels";
import HotelDescription from "./Pages/HotelDescription";
import Layout from "./Layout";
import SearchResults from "./Pages/SearchResults";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      { path: "hotels", element: <Hotels /> },
      { path: "hotels/:id", element: <HotelDescription /> },
      { path:"/search", element :<SearchResults /> }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
