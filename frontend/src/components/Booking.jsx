import React, { useState } from "react";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    persons: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Data:", formData);
    // Acá podrías hacer un fetch/axios POST al backend
  };

  return (
    <section className="book_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Book A Table</h2>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form_container">
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <select
                    className="form-control"
                    name="persons"
                    value={formData.persons}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      How many persons?
                    </option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="btn_box">
                  <button type="submit" className="btn btn-primary">
                    Book Now
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <div className="map_container">
              <div id="googleMap" style={{ width: "100%", height: "100%" }}>
                {/* Aca podés meter un iframe de Google Maps directo */}
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123927827796!2d144.96305791550496!3d-37.81362797975162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f4f7ab%3A0x2b0f7aa85a388f6d!2sMelbourne%20CBD%2C%20Australia!5e0!3m2!1sen!2sau!4v1614691299244!5m2!1sen!2sau"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
