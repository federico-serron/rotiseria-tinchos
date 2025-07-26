import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from app.config import DevelopmentConfig, TestingConfig, ProductionConfig

# Instancias que se inicializan más adelante
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    load_dotenv()
    
    enviroment = os.getenv("FLASK_ENV", "development")

    if enviroment == "production":
        config_class = ProductionConfig
    elif enviroment == "testing":
        config_class = TestingConfig
    else:
        config_class = DevelopmentConfig
        
    """
    We define static_folder because Flask is going to serve the front end files since we are running everything from a single Dockerfile in production
    """
    app = Flask(__name__, static_folder="front/build", static_url_path="/")
    
    # Configuración básica
    app.config.from_object(config_class)
    
    upload_folder_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'])
    if not os.path.exists(upload_folder_path):
        os.makedirs(upload_folder_path)
        
    app.config['UPLOAD_FOLDER'] = upload_folder_path

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
    from app.routes.invoice_bp import invoice_bp
    
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(menu_bp, url_prefix='/menu')
    app.register_blueprint(category_bp, url_prefix='/categories')
    app.register_blueprint(invoice_bp, url_prefix='/invoices')
    

    return app
