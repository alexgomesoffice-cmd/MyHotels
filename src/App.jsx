import Home from './Pages/Home'
import About from './Pages/About'
import TermsAndServices from './Pages/TermsAndServices';
import CustomerService from './Pages/CustomerService'
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
    }
  ])
  return (
  <div>
      <RouterProvider router={router} />
  </div>
    
  )
}

export default App