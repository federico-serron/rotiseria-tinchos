import React from "react";

const Hero = () => {
  return (
    <div className="hero_area">
      <div className="bg-box">
        <img src="/images/hero-bg.jpg" alt="" />
      </div>

      {/* Slider Section */}
      <section className="slider_section">
        <div id="customCarousel1" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {[1, 2, 3].map((slide, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <div className="container">
                  <div className="row">
                    <div className="col-md-7 col-lg-6">
                      <div className="detail-box">
                        <h1>Rotisería Tinchos</h1>
                        <p>
                          Comidas caseras, frescas y listas para llevar. Disfrutá nuestras pizzas, pastas, hamburguesas y mucho más, preparados con ingredientes de calidad y el sabor de siempre. ¡Sentite como en casa!
                        </p>
                        <div className="btn-box">
                          <a href="/" className="btn1">¡Hacé tu pedido!</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="container">
            <ol className="carousel-indicators">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  data-bs-target="#customCarousel1"
                  data-bs-slide-to={i}
                  className={i === 0 ? "active" : ""}
                ></li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
