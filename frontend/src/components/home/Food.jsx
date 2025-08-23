import React, { useState, useEffect, useContext } from "react";
import { Context } from '../../js/store/appContext';
import toast, { Toaster } from 'react-hot-toast';
import { MenuItem } from "../items/MenuItem.jsx";

const categories = [
  { key: "*", label: "Todo" },
  { key: "burger", label: "Hamburguesas" },
  { key: "pizza", label: "Pizzas" },
  { key: "pasta", label: "Pastas" },
  { key: "fries", label: "Papas Fritas" },
];


export default function FoodSection() {

  const { store, actions } = useContext(Context);
  const [filter, setFilter] = useState("*");

  const filteredItems =
    filter === "*"
      ? store.menu
      : store.menu.filter((item) => item.category_id === filter);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const resp = await actions.getMenuItems();
      if (!resp) {
        toast.error(store.error)
        return;
      }

    }
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const resp = await actions.getCategories()
      return
    }

    fetchCategories();
  }, []);

  return (
    <section className="food_section layout_padding-bottom">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Nuestro Menú</h2>
        </div>

        <ul className="filters_menu d-flex justify-content-center mb-4">
          <li className={filter === "*" ? 'active' : 'none'}
          onClick={() => setFilter("*")}>Todo</li>

          {store.categories.map(({ id, name }) => (
            <li
              key={id}
              className={filter === id ? "active" : ""}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                listStyle: "none",
                paddingBottom: "5px",
                borderBottom: filter === id ? "2px solid #000" : "none",
              }}
              onClick={() => { setFilter(id) }}
            >
              {name}
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
