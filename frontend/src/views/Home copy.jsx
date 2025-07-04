import React, { useContext, useEffect } from 'react'
import { Context } from '../js/store/appContext.jsx';

function Home() {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    const getMsgDemo = async () => {
      const msg = await actions.demoFunction();
      if (!msg) {
        store.demoMsg = "Error fetching message";
        return false;
      }
    };
    getMsgDemo();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">Flask + React Boilerplate</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#api">Rotiseria Tincho's</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow-1 d-flex align-items-center pt-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Welcome to Your Flask + React App</h1>
          <p className="lead mb-4">
            A modern, scalable full-stack application boilerplate
          </p>
          <div className="d-flex justify-content-center gap-3">
            <a href="#features" className="btn btn-primary btn-lg">Get Started</a>
            <a href="#api" className="btn btn-outline-secondary btn-lg">API Demo</a>
          </div>
        </div>
      </main>

      {/* API Demo Section */}
      <section id="api" className="pb-5">
        <div className="container text-center">
          <h2 className="mb-4">API Demo</h2>
          <p className="lead mb-4">Test the backend API connection:</p>
          <div className="alert alert-info w-75 mx-auto">
            <strong>API Response:</strong> {store.demoMsg || 'Click the button to test'}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => actions.demoFunction()}
          >
            Test API Connection
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Key Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-lightning-charge-fill h1 text-primary mb-3"></i>
                  <h5>Fast Development</h5>
                  <p className="text-muted">
                    Quick setup with modern development tools and hot-reloading
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-shield-lock-fill h1 text-success mb-3"></i>
                  <h5>Secure</h5>
                  <p className="text-muted">
                    Built-in authentication and security best practices
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-arrow-repeat h1 text-info mb-3"></i>
                  <h5>Scalable</h5>
                  <p className="text-muted">
                    Modular architecture ready for growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Made with ❤️ by Federico Serron. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;