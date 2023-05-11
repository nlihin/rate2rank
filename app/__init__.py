from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rank2rate.db'
app.config['SECRET_KEY'] = 'asdfla234509sdflsdf235'
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config['DEBUG'] = True

db = SQLAlchemy(app)
jwt = JWTManager(app)

from app.routes_auth import auth
from app.routes_group import group
from app.routes_rate import rate
from app.routes_rank import rank

app.register_blueprint(auth)
app.register_blueprint(group)
app.register_blueprint(rate)
app.register_blueprint(rank)
