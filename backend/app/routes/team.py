from flask import jsonify, request
from app import app, db
from app.models.authentication import User
from app.utils import superuser_jwt_required, user_jwt_required
from app.models.team import Team
from app.models.authentication import User

def team_json(teams):
    team_json = [{
                    'id': team.id, 
                    'name': team.name, 
                    'leader_id': team.leader_id,
                    'leader_name': get_username(team.leader_id)
                } 
                for team in teams]
    return jsonify(team_json)
    

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
    return jsonify({"message": "Team added successfully", "team_id": team.id}), 200


# List All Teams
# curl -X GET localhost:5000/api/v1/team
@app.route("/api/v1/team", methods=["GET"])
def list_teams():
    teams = Team.query.filter_by(inactive=False).all()
    return team_json(teams)

# Updates team record (with json header referencing data type)
@app.route("/api/v1/team/<int:team_id>", methods=["PUT"])
def update_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404
    data = request.get_json()
    print(data)
    if 'name' in data:
        team.name = data['name']
    if 'leader' in data:
        user = User.query.get(data['leader'])
        team.leader = user

    db.session.commit()
    return jsonify({"message": "Team Records Updated"}), 200


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


def get_username(user_id):
    if user_id is None:
        return None
    user = User.query.get(user_id)
    return user.name