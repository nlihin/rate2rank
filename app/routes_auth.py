from flask import Blueprint, request, jsonify
from app.models import User
from app import db, jwt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user

auth = Blueprint('auth', __name__)


@auth.route('/register', methods=['POST'])
def register():
    new_user = User(username=request.json.get('username'),
                    name=request.json.get('name'),
                    email_address=request.json.get('email_address'),
                    password=request.json.get('password'))
    if new_user.validate_username() and new_user.validate_password():
        db.session.add(new_user)
        db.session.commit()
        return jsonify(status=200)

    return jsonify(status=400, msg='Please check that username == password ')


@auth.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    current_user = db.session.query(User).filter_by(username=username).one_or_none()

    if current_user and password == current_user.password:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token, status=200)

    return jsonify(msg="Bad username or password", status=400)


# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user


# change username to user id ????

# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(username=identity).one_or_none()
