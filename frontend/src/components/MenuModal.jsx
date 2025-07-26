import React, { useState } from 'react';

const MenuModal = ({ onSave, initialData = {} }) => {

    const [formData, setFormData] = useState({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        image: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
        setErrors({ ...errors, [name]: '' }); // Clear error for the field
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
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

        onSave(formData);
    };

    return (
        <div className="modal fade" id="menuModal" tabIndex="-1" aria-labelledby="menuModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="menuModalLabel">
                            {initialData.id ? 'Editar Ítem' : 'Agregar Nuevo Ítem'}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
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
                                    required
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
                                    required
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
                                    required
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
                            <button type="submit" className="btn btn-primary">{initialData.id ? 'Guardar Cambios' : 'Guardar'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuModal;
