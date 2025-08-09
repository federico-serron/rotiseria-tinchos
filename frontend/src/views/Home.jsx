import React, { useContext, useEffect } from 'react'
import { Context } from '../js/store/appContext.jsx';
import Hero from '../components/home/Hero.jsx';
import Offers from '../components/home/Offers.jsx';
import Food from '../components/home/Food.jsx';
import About from '../components/home/About.jsx';
import Booking from '../components/home/Booking.jsx';

function Home() {
  const { store, actions } = useContext(Context);

  return (
    <div className="min-vh-100 d-flex flex-column">
      
      {/* Hero Section */}
      <Hero />

      {/* Offers Section */}
      <Offers />

      {/* Features Section */}
      <Food />

      {/* About Section */}
      <About />

      {/* Booking Section */}
      <Booking />

    </div>
  );
}

export default Home;