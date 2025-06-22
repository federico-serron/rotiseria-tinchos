import os # para saber la ruta absoluta de la db si no la encontramos
from flask_bcrypt import Bcrypt  # para encriptar y comparar
from flask import Flask, request, jsonify # Para endpoints
from flask_sqlalchemy import SQLAlchemy  # Para rutas
from flask_jwt_extended import  JWTManager, create_access_token, jwt_required, get_jwt_identity
from routes.admin_bp import admin_bp                       # Acá importamos rutas admin
from routes.public_bp import public_bp                     # Acá importamos rutas public
from database import db                             # Acá importamos la base de datos inicializada
from flask_cors import CORS
from dotenv import load_dotenv
from flask import send_from_directory
from flask_migrate import Migrate

load_dotenv()

app = Flask(__name__, static_folder="front/build", static_url_path="/")

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
# ENCRIPTACION JWT y BCRYPT-------

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # clave secreta para firmar los tokens.( y a futuro va en un archivo .env)
jwt = JWTManager(app)  # isntanciamos jwt de JWTManager utilizando app para tener las herramientas de encriptacion.
bcrypt = Bcrypt(app)   # para encriptar password


# REGISTRAR BLUEPRINTS ( POSIBILIDAD DE UTILIZAR EL ENTORNO DE LA app EN OTROS ARCHIVOS Y GENERAR RUTAS EN LOS MISMOS )


app.register_blueprint(admin_bp, url_prefix='/admin')  # poder registrarlo como un blueprint ( parte del app )
                                                       # y si queremos podemos darle toda un path base como en el ejemplo '/admin'

app.register_blueprint(public_bp, url_prefix='/public')  # blueprint public_bp



# DATABASE---------------
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")

db.init_app(app)

# Inicializar Flask-Migrate
migrate = Migrate(app, db, compare_type=True)

# with app.app_context():
#     db.init_app(app)
#     db.create_all() # Nos aseguramos que este corriendo en el contexto del proyecto.

db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'mydatabase.db')
print(f"Ruta de la base de datos: {db_path}")
if not os.path.exists(os.path.dirname(db_path)): # Nos aseguramos que se cree carpeta instance automatico para poder tener mydatabase.db dentro.
    os.makedirs(os.path.dirname(db_path))
# -----------------------

# Ruta para servir el index.html del frontend
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")

# Ruta para servir todos los archivos estáticos del frontend
@app.route('/<path:path>')
def serve_static_files(path):
    # Intentamos servir cualquier archivo estático del frontend (js, css, imágenes)
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Si no existe archivo estático, devolvemos index.html para que React maneje rutas SPA
        return send_from_directory(app.static_folder, "index.html")


# AL FINAL ( detecta que encendimos el servidor desde terminal y nos da detalles de los errores )
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5100)