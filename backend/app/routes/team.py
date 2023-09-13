from flask import jsonify, request
from app import app, db
from app.models.authentication import User
from app.utils import superuser_jwt_required, user_jwt_required
from app.models.team import Team


# Add Team
# curl -X POST localhost:5000/api/v1/team -H 'Content-Type:application/json' --data '{"name": "test team"}'
@app.route("/api/v1/team", methods=["POST"])
def add_team():
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "Name is required"}), 400

    team = Team(name=data["name"])
    db.session.add(team)
    db.session.commit()
    return jsonify({"message": "Team added successfully", "team_id": team.id}), 201


# List All Teams
# curl -X GET localhost:5000/api/v1/team
@app.route("/api/v1/team", methods=["GET"])
def list_teams():
    teams = Team.query.filter_by(inactive=False).all()
    return jsonify([team.to_dict() for team in teams])


# Delete Team (Mark Inactive)
@app.route("/api/v1/team/<int:team_id>", methods=["DELETE"])
def delete_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404

    team.inactive = True
    db.session.commit()
    return jsonify({"message": "Team marked as inactive"}), 200


# Set User as Leader
@app.route("/api/v1/team/<int:team_id>/leader/<int:user_id>", methods=["PUT"])
def set_leader(team_id, user_id):
    team = Team.query.get(team_id)
    user = User.query.get(user_id)

    if not team:
        return jsonify({"error": "Team not found"}), 404
    if not user:
        return jsonify({"error": "User not found"}), 404

    team.leader = user
    db.session.commit()
    return jsonify({"message": "User set as leader"}), 200
