import React from "react";
import aboutImage from "/images/about-img.png"; // asegurate que la ruta funcione con tu sistema de bundling

const About = () => {
  return (
    <section className="about_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="img-box">
              <img src={aboutImage} alt="About Feane" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-box">
              <div className="heading_container">
                <h2>Sobre Nosotros</h2>
              </div>
              <p>
                Somos una rotisería familiar dedicada a ofrecerte los mejores platos caseros, elaborados con ingredientes frescos y mucho amor. Nuestro objetivo es que disfrutes de una comida rica, abundante y a buen precio, ya sea para llevar o para compartir en casa. ¡Gracias por elegirnos!
              </p>
              <a href="#" className="btn btn-primary mt-3">
                Ver más
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
