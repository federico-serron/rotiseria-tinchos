import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../js/store/appContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Pagination } from '@mui/material';


const AdminCategories = () => {
    const { store, actions } = useContext(Context);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        note: ''
    });

    const handleChange = async (event, value) => {
        const resp = await actions.getCategoriesPaginated(value)
        if (!resp) {
            toast.error(store.error);
            return;
        }

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            note: ''
        });
    };

    const handleSuccess = () => {
        setSelectedCategory(null);
        resetFormData();
        const modalEl = document.getElementById('addCategoryModal');
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
    };

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedCategory(null);
        resetFormData();
    };

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            note: category.note
        });
    };

    const handleDeleteConfirm = async () => {

        const resp = await actions.deleteCategory(selectedCategory.id);
        if (!resp) {
            toast.error(store.error)
            return;
        }
        toast.success(store.message)
        setIsDeleteModalOpen(false);
        return
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jsonData = {
            name: formData.name,
            note: formData.note
        };

        if (selectedCategory) {
            const resp = await actions.editCategory(selectedCategory.id, jsonData);
            if (!resp) {
                toast.error(store.error)
                return
            } else {
                toast.success(store.message)
            }
        } else {
            const resp = await actions.addCategory(jsonData);
            if (!resp) {
                toast.error(store.error)
                return
            } else {
                toast.success(store.message)
            }
        }

        handleSuccess();
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const resp = await actions.getCategoriesPaginated();
            if (!resp) {
                toast.error(store.error);
                return;
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            setFormData({
                name: selectedCategory.name || '',
                note: selectedCategory.note || ''
            });
        } else {
            resetFormData();
        }
    }, [selectedCategory]);

    return (
        <div className="table-responsive pt-2">
            <div className="pb-2">
                <button
                    className="btn btn-success"
                    onClick={handleAddClick}
                    data-bs-toggle="modal"
                    data-bs-target="#addCategoryModal"
                >
                    Nuevo +
                </button>
            </div>
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {store.categories.map((category, index) => (
                        <tr key={category.id}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            <td>{category.note}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-link text-primary p-0 me-3"
                                        data-bs-toggle="modal"
                                        data-bs-target="#addCategoryModal"
                                        onClick={() => handleEditClick(category)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="btn btn-link text-danger p-0"
                                        onClick={() => handleDeleteClick(category)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <Pagination
                    count={store.catPagination.pages}
                    onChange={handleChange}
                    variant='outlined'
                    color="secondary"
                    sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                />
            </div>

            {/* Add/Edit Modal */}
            <div
                className="modal fade"
                id="addCategoryModal"
                tabIndex="-1"
                aria-labelledby="addCategoryModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                        >
                            <div className="modal-header">
                                <h5 className="modal-title" id="addCategoryModalLabel">
                                    {selectedCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="note" className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        id="note"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">
                                    {selectedCategory ? 'Guardar Cambios' : 'Guardar'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="modal-dialog">
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
                                ¿Estás seguro de que deseas eliminar esta categoría?
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteConfirm}
                                >
                                    Eliminar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
