from flask import jsonify
from app import app
from app.models.authentication import User
from app.utils import superuser_jwt_required, user_jwt_required


@app.route("/api/v1/user", methods=["GET"])
# @superuser_jwt_required
def list_users():
    users = User.query.filter_by(registered=True).all()
    return jsonify([user.to_dict() for user in users])


@app.route("/api/v1/user/<int:user_id>", methods=["GET"])
@superuser_jwt_required
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"err": "no_user", "msg": "User not found"}), 404
    return jsonify(user.to_dict())
