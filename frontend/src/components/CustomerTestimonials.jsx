import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Moana Michell",
    subtitle: "magna aliqua",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    image: "/images/client1.jpg",
  },
  {
    name: "Mike Hamell",
    subtitle: "magna aliqua",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    image: "/images/client2.jpg",
  },
  // Si querés más testimonios, agregalos acá
];

const CustomerTestimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <section className="client_section layout_padding-bottom">
      <div className="container">
        <div className="heading_container heading_center psudo_white_primary mb_45">
          <h2>What Says Our Customers</h2>
        </div>

        <div className="carousel-wrap row">
          <Slider {...settings} className="client_owl-carousel">
            {testimonials.map((testimonial, index) => (
              <div className="item" key={index}>
                <div className="box">
                  <div className="detail-box">
                    <p>{testimonial.text}</p>
                    <h6>{testimonial.name}</h6>
                    <p>{testimonial.subtitle}</p>
                  </div>
                  <div className="img-box">
                    <img src={testimonial.image} alt={testimonial.name} className="box-img" />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
