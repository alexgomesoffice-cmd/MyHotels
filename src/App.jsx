import Home from './Pages/Home'
import About from './Pages/About'
import TermsAndServices from './Pages/TermsAndServices'
import CustomerService from './Pages/CustomerService'
import Login from './Pages/LogIn'
import Register from './Pages/Register'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom"


const App = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Home />
    },
    {
      path:"/about",
      element:<About />
    },
    {
      path:"/support",
      element:<CustomerService />
    },
    {
      path:"/terms",
      element:<TermsAndServices />
    },
    { 
      path: "/login",
      element: <Login /> 
    },
  { 
    path: "/register",
    element: <Register /> 
  },
  ])
  return (
  <div>
      <RouterProvider router={router} />
  </div>
    
  )
}

export default App


