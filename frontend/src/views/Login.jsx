
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Context } from '../js/store/appContext';
import { jwtDecode } from 'jwt-decode';

const Login = () => {


    const initialState = {
        email: '',
        password: ''
    };


    const validateEmail = (email) => {
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    };

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) newErrors.email = 'El email es obligatorio';
        else if (!validateEmail(form.email)) newErrors.email = 'Email inválido';
        if (!form.password.trim()) newErrors.password = 'La contraseña es obligatoria';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

            const resp = await actions.login(form.email, form.password)
            if (resp) {
                toast.success(store.message)
                // after login, force refresh current user so store and components (Navbar) update immediately
                const user = await actions.getCurrentUser(true);
                const role = user?.role || store.logged_user?.role;
                if (role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
            else {
                toast.error(store.error)
                return
            }
        }
    };

    useEffect(() => {
        // Only redirect if user info has been loaded and we actually have a logged user
        if (!store.user_loaded) return;

        const hasUser = store.logged_user && Object.keys(store.logged_user).length > 0;
        if (!hasUser) return; // not authenticated, don't redirect

        if (store.logged_user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    }, [store.user_loaded, store.logged_user, navigate]);

    return (
        <div className="d-flex justify-content-center py-4 align-items-center min-vh-100">
            <div className="card shadow p-4 w-100" style={{ maxWidth: 400 }}>
                <h2 className="mb-4 text-primary text-center">Iniciar sesión</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="login-email">Correo electrónico *</label>
                        <input id="login-email" type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={handleChange} autoComplete="email" />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="login-password">Contraseña *</label>
                        <div className="input-group">
                            <input id="login-password" type={showPassword ? "text" : "password"} name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={handleChange} autoComplete="current-password" />
                            <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}>
                                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                    <div className="text-center mt-3">
                        <span>¿No tenés cuenta? </span>
                        <Link to="/signup" className="btn btn-link p-0 align-baseline">Registrate</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;