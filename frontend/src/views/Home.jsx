import React, { useContext, useEffect } from 'react'
import { Context } from '../js/store/appContext.jsx';
import Hero from '../components/Hero.jsx';
import Offers from '../components/Offers.jsx';
import Food from '../components/Food.jsx';
import About from '../components/About.jsx';
import Booking from '../components/Booking.jsx';

function Home() {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    const getMsgDemo = async () => {
      const msg = await actions.demoFunction();
      if (!msg) {
        store.demoMsg = "Error fetching message";
        return false;
      }
    };
    getMsgDemo();
  }, []);

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