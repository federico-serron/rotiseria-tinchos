import React, { useState } from "react";

const menuItems = [
  {
    id: 1,
    category: "pizza",
    title: "Pizza Casera",
    description: "Nuestra pizza artesanal, con masa suave y salsa de tomate casera. ¡Ideal para compartir!",
    price: 20,
    img: "/images/f1.png",
  },
  {
    id: 2,
    category: "burger",
    title: "Hamburguesa Clásica",
    description: "Carne de primera, pan fresco y los mejores ingredientes. ¡Probá nuestra especialidad!",
    price: 15,
    img: "/images/f2.png",
  },
  {
    id: 3,
    category: "pizza",
    title: "Pizza Napolitana",
    description: "Con tomate, mozzarella, jamón y aceitunas. Un clásico de la rotisería.",
    price: 17,
    img: "/images/f3.png",
  },
  {
    id: 4,
    category: "pasta",
    title: "Pasta Casera",
    description: "Fideos frescos con salsa a elección: boloñesa, crema o mixta.",
    price: 18,
    img: "/images/f4.png",
  },
  {
    id: 5,
    category: "fries",
    title: "Papas Fritas",
    description: "Crocantes y doradas, perfectas para acompañar cualquier plato.",
    price: 10,
    img: "/images/f5.png",
  },
  {
    id: 6,
    category: "pizza",
    title: "Pizza Fugazzeta",
    description: "Rellena de queso y cebolla, una opción irresistible.",
    price: 15,
    img: "/images/f6.png",
  },
  {
    id: 7,
    category: "burger",
    title: "Hamburguesa Completa",
    description: "Con queso, jamón, huevo y todos los toppings. ¡Para los más hambrientos!",
    price: 12,
    img: "/images/f7.png",
  },
  {
    id: 8,
    category: "burger",
    title: "Hamburguesa Vegetariana",
    description: "Hecha con vegetales frescos y pan artesanal. Sabor y salud en cada bocado.",
    price: 14,
    img: "/images/f8.png",
  },
  {
    id: 9,
    category: "pasta",
    title: "Ravioles de Verdura",
    description: "Rellenos de espinaca y ricota, acompañados con salsa a elección.",
    price: 10,
    img: "/images/f9.png",
  },
];

const categories = [
  { key: "*", label: "Todo" },
  { key: "burger", label: "Hamburguesas" },
  { key: "pizza", label: "Pizzas" },
  { key: "pasta", label: "Pastas" },
  { key: "fries", label: "Papas Fritas" },
];

// SVG carrito para reutilizar
const CartIcon = () => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 456.029 456.029"
    style={{ width: "24px", height: "24px", fill: "#000" }}
  >
    <g>
      <g>
        <path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248
               c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z" />
      </g>
    </g>
    <g>
      <g>
        <path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48
               C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064
               c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4
               C457.728,97.71,450.56,86.958,439.296,84.91z" />
      </g>
    </g>
    <g>
      <g>
        <path d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296
               c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z" />
      </g>
    </g>
  </svg>
);

const MenuItem = ({ item }) => (
  <div className="col-sm-6 col-lg-4 all" data-category={item.category}>
    <div className="box">
      <div>
        <div className="img-box">
          <img src={item.img} alt={item.title} />
        </div>
        <div className="detail-box">
          <h5>{item.title}</h5>
          <p>{item.description}</p>
          <div className="options d-flex justify-content-between align-items-center">
            <h6>${item.price}</h6>
            <a href="#" aria-label={`Add ${item.title} to cart`}>
              <CartIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function FoodSection() {
  const [filter, setFilter] = useState("*");

  const filteredItems =
    filter === "*"
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  return (
    <section className="food_section layout_padding-bottom">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Nuestro Menú</h2>
        </div>

        <ul className="filters_menu d-flex justify-content-center mb-4">
          {categories.map(({ key, label }) => (
            <li
              key={key}
              className={filter === key ? "active" : ""}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                listStyle: "none",
                paddingBottom: "5px",
                borderBottom: filter === key ? "2px solid #000" : "none",
              }}
              onClick={() => setFilter(key)}
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="filters-content">
          <div className="row grid">
            {filteredItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="btn-box text-center mt-4">
          <a href="#" className="btn btn-outline-primary">
            Ver más opciones
          </a>
        </div>
      </div>
    </section>
  );
}
