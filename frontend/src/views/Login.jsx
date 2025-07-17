
import React, { useState } from 'react';

const initialState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  address: ''
};

const validateEmail = (email) => {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
};

export default function Login() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(form.email)) newErrors.email = 'Email inválido';
    if (!form.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Aquí iría la lógica de envío al backend
      alert('Formulario válido!');
    }
  };

  return (
    <div className="d-flex justify-content-center py-4 align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{maxWidth: 400}}>
        <h2 className="mb-4 text-primary text-center">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre completo *</label>
            <input type="text" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={form.name} onChange={handleChange} autoComplete="name" />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico *</label>
            <input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={handleChange} autoComplete="email" />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña *</label>
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={handleChange} autoComplete="current-password" />
              <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={()=>setShowPassword(!showPassword)}>
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono *</label>
            <input type="text" name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={form.phone} onChange={handleChange} autoComplete="tel" />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} autoComplete="address" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
