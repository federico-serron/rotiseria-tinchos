import React, { useState, useContext } from 'react';
import { Context } from '../js/store/appContext';
import MenuModal from './MenuModal.jsx';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ListMenu = () => {
  const { store, actions } = useContext(Context);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    actions.deleteMenuItem(selectedItem.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="table-responsive pt-2">
      <div className='pb-2'>
        <button className="btn btn-primary" onClick={handleAddClick}>➕</button>
      </div>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Descripción</th>
            <th scope="col">Disponible</th>
            <th scope="col">Categoría</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {store.menu.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
              <td>{item.available ? 'Sí' : 'No'}</td>
              <td>{item.category}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEditClick(item)}>
                  <FaEdit />
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteClick(item)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <MenuModal
          onSave={(formData) => {
            if (selectedItem) {
              actions.editMenuItem(selectedItem.id, formData.name, formData.price, formData.description, formData.category_id, formData.image);
            } else {
              actions.addMenuItem(formData.name, formData.price, formData.description, formData.category_id, formData.image);
            }
            setIsModalOpen(false);
          }}
          initialData={selectedItem || {}}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setIsDeleteModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este ítem?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListMenu;
