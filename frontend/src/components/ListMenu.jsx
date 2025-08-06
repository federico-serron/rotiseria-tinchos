import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../js/store/appContext';
import MenuModal from './MenuModal.jsx';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const ListMenu = () => {
  const { store, actions } = useContext(Context);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddClick = () => {
    setSelectedItem(null);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    actions.deleteMenuItem(selectedItem.id);
    setIsDeleteModalOpen(false);
  };

  const handleSuccess = () => {
    setSelectedItem(null);
    const modalEl = document.getElementById('addMenuItem');
    const modal = window.bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  };

  const handleSubmit = async (data) => {
    let resp = false;
    if (selectedItem) {
      resp = await actions.editMenuItem(selectedItem.id, data);
    } else {
      resp = await actions.addMenuItem(data);
    }

    if (!resp) {
      toast.error(store.error)
      return
    }
    toast.success(store.message)

    handleSuccess();
  }

  useEffect(() => {
    const fetchMenuItems = async () => {
      const resp = await actions.getMenuItems();
      if (!resp) {
        toast.error(store.error)
        return
      }

    }
    fetchMenuItems();
  }, []);

  return (
    <div className="table-responsive pt-2">
      <div className="pb-2">
        <button
          className="btn btn-success"
          onClick={handleAddClick}
          data-bs-toggle="modal"
          data-bs-target="#addMenuItem"
        >
          Nuevo +
        </button>
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
          {store.menu.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={item.path ? `${import.meta.env.VITE_BACKEND_URL}/${item.path}` : 'https://cdn.pixabay.com/photo/2014/12/21/23/36/burgers-575655_1280.png'}
                  className='rounded '
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
              <td className={item.is_available ? 'bold text-success' : 'text-danger'}>{item.is_available ? 'Sí' : 'No'}</td>
              <td>{item.category}</td>
              <td>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-link text-primary p-0 me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#addMenuItem"
                    onClick={() => handleEditClick(item)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-link text-danger p-0"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      <MenuModal
        id="addMenuItem"
        message={selectedItem ? 'Editar ítem del menú' : 'Crear nuevo ítem'}
        onSuccess={handleSuccess}
        initialData={selectedItem || {}}
        onConfirm={async (formData) => {
          const data = new FormData();
          data.append('name', formData.name);
          data.append('price', formData.price);
          data.append('description', formData.description);
          data.append('category_id', 1);
          if (formData.image) {
            data.append('image', formData.image);
          }
          handleSubmit(data)

        }}
        onCancel={() => setSelectedItem(null)}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsDeleteModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar este ítem?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListMenu;
