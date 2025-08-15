import React, {useEffect, useContext} from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './views/Home';
import toast, { Toaster } from 'react-hot-toast';
import { Context } from "./js/store/appContext";
import injectContext from './js/store/appContext.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Booking from './components/home/Booking.jsx';
import Food from './components/home/Food.jsx';
import About from './components/home/About.jsx';
import Login from './views/Login.jsx';
import Signup from './views/Singup.jsx';
import Dashboard from './views/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './views/admin/AdminDashboard.jsx';
import NotFound from './views/NotFound.jsx';
import ListMenu from './components/ListMenu.jsx';
import ListUsers from './components/ListUsers.jsx';
import AdminCategories from './components/admin/AdminCategories.jsx';


const Layout = () => {
  const { actions } = useContext(Context);
  
  const basename = import.meta.env.VITE_BASENAME || "";

  useEffect(() => {
    const fetchCurrentUser = async ()=>{
      await actions.getCurrentUser();
    }
    fetchCurrentUser();
  }, []);
  
  return (
    <div>

      <BrowserRouter basename={basename}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Food />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Booking />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* User Panel */}
          <Route path='/dashboard' element={
            <ProtectedRoute requiredRole='user' >
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Admin Panel */}
          <Route path='/admin' element={
            <ProtectedRoute requiredRole='admin' >
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route path='menu' element={<ListMenu />} />
            <Route path='users' element={<ListUsers />} />
            <Route path='categorias' element={<AdminCategories />} />
          </Route>


          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster />
    </div>
  )
}

export default injectContext(Layout);