import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../js/store/appContext';


const MenuModal = ({ id = 'editCategoryModal', message, onSuccess, onConfirm, initialData = {}, onCancel }) => {

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: '',
        image: null,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            name: initialData.name || '',
            price: initialData.price || '',
            description: initialData.description || '',
            category_id: initialData.category_id || '',
            image: null,
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const requiredFields = ['name', 'description', 'price', 'category_id'];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `El campo ${field} es obligatorio.`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onConfirm(formData);
        if (onSuccess) onSuccess();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            category_id: '',
            image: null,
        });
        setErrors({});
    };


    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id={`${id}Label`}>
                                {message}
                            </h5>
                            <button
                                onClick={() => {resetForm(); if (onCancel) onCancel();}}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/* Los campos del formulario */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Precio</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Descripción</label>
                                <textarea
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category_id" className="form-label">Categoría</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.category_id ? 'is-invalid' : ''}`}
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                />
                                {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Imagen</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    name="image"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">
                                {initialData.id ? 'Guardar Cambios' : 'Guardar'}
                            </button>
                            <button onClick={() => { resetForm(); if (onCancel) onCancel(); }} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MenuModal;
