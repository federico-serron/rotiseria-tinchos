import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv

# Instancias que se inicializan más adelante
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    load_dotenv()

    """
    We define static_folder because Flask is going to the serve the front end files since we are running everything from a single Dockerfile in production
    """
    app = Flask(__name__, static_folder="front/build", static_url_path="/")

    # Configuración básica
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")

    # Extensiones
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db, compare_type=True)

    # Crear carpeta de base de datos si no existe y si se esta usando sqLite
    db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'mydatabase.db')
    if not os.path.exists(os.path.dirname(db_path)):
        os.makedirs(os.path.dirname(db_path))

    # Registrar blueprints
    from app.routes.admin_bp import admin_bp
    from app.routes.user_bp import user_bp
    from app.routes.menu_bp import menu_bp
    from app.routes.category_bp import category_bp
    
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(menu_bp, url_prefix='/menu')
    app.register_blueprint(category_bp, url_prefix='/categories')
    

    return app
