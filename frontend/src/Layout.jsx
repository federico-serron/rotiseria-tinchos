import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './views/Home';
import injectContext from './js/store/appContext.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Booking from './components/Booking.jsx';
import Food from './components/Food.jsx';
import About from './components/About.jsx';
import Login from './views/Login.jsx';


const Layout = () => {
    const basename = import.meta.env.VITE_BASENAME || "";
  return (
    <div>

        <BrowserRouter>
        <Navbar />
            <Routes>
                <Route exact path='/' element={<Home/>} />
                <Route exact path='/menu' element={<Food/>} />
                <Route exact path='/about' element={<About/>} />
                <Route exact path='/contact' element={<Booking/>} />
                <Route exact path='/login' element={<Login/>} />
            </Routes>
        <Footer />
        </BrowserRouter>
    </div>
  )
}

export default injectContext(Layout);