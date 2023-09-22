from datetime import datetime
from typing import Dict, Union
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from app import app, db
from app.models.record import Record, Subsystem
from app.utils import handle_exceptions
from app.models.authentication import User
from app.models.team import Team
from app.utils import user_jwt_required

"""
SUBSYSTEM
"""

def subystem_json(subsystems):
    subsystem_json = [
        {
            "id": subsystem.id,
            "name": subsystem.name,
        }
        for subsystem in subsystems
    ]
    return jsonify(subsystem_json)


@app.route("/api/v1/subsystem", methods=["POST"])
@handle_exceptions
@user_jwt_required
def create_subsystem():
    try:
        name = request.json.get("name", None)
        if name is None or name == "":
            return (
                jsonify(
                    {
                        "err": "no_name",
                        "msg": "subsystem name is required and cannot be empty",
                    }
                ),
                400,
            )
        team_id = request.json.get("team_id", None)
        team = Team.query.get(team_id)
        if team is None or team == "":
            return (
                jsonify(
                    {
                        "err": "no_team",
                        "msg": "subsystem requires a team to be associated with",
                    }
                ),
                400,
            )
        subsystem = Subsystem()
        subsystem.name = name
        subsystem.team = team
        db.session.add(subsystem)
        db.session.commit()
        return (
            jsonify({"message": "Subsystem created successfully", "id": subsystem.id}),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Serialize all subsystem (Should use pagination but whatever)
@app.route("/api/v1/subsystem/<int:team_id>", methods=["GET"])
@handle_exceptions
@user_jwt_required
def get_subsystem(team_id):
    team = Team.query.get(team_id)
    try:
        if team is not None:
            json_payload = subystem_json(Subsystem.get_by_team(team_id))
            return json_payload, 200
        else:
            return (
                jsonify(
                    {
                        "err": "no_team",
                        "msg": "subsystem requires a team to be associated with",
                    }
                ),
                400,
            )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


"""
RECORD
"""


def update_record_kv(record: Record, data: Dict[str, Union[str, int]]) -> int:
    # CHECK KEYS
    updated = 0
    for key in data.keys():
        if not hasattr(record, key) or key in Record.PROTECTED_FIELDS:
            # DO NOT REVEAL PROTECTED FIELDS (USE SAME ERROR)
            raise KeyError(key)
    for key, value in data.items():
        # CHECK KEYS AGAIN FOR SAFETY
        if hasattr(record, key) and key not in Record.PROTECTED_FIELDS:
            if key in Record.TIME_FIELDS:
                value = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
            if getattr(record, key) != value:
                updated += 1
                setattr(record, key, value)
                record.modified_at = datetime.utcnow()
        else:
            # DO NOT REVEAL PROTECTED FIELDS (USE SAME ERROR)
            raise KeyError(key)
    return updated


# Create new record
@app.route("/api/v1/record/", methods=["POST"])
@handle_exceptions
@user_jwt_required
def create_record():
    record = Record()
    data = request.json
    identity = get_jwt_identity()
    try:
        update_record_kv(record, data)
        record.creator = User.query.filter_by(email=identity).first()
        record.owner = record.creator
    except KeyError as e:
        return (
            jsonify({"err": "bad_key", "message": f"Key {str(e)} does not exist"}),
            400,
        )
    db.session.add(record)
    db.session.commit()
    return jsonify({"message": "Record created successfully", "id": record.id}), 201


@app.route("/api/v1/record/<int:record_id>", methods=["PATCH"])
@handle_exceptions
@user_jwt_required
def update_record(record_id):
    record = Record.query.get(record_id)
    updated = 0
    if not record:
        return jsonify({"error": "Record not found"}), 404
    # TODO: PUT CHECKS FOR PROTECTED FIELDS (DELETED, CREATED_AT, ETC.)
    data = request.json
    if len(data.keys()) == 0:
        return (
            jsonify({"err": "no_data", "message": "Provide some data to update"}),
            400,
        )
    try:
        updated = update_record_kv(record, data)
    except KeyError:
        return jsonify({"err": "bad_key", "message": "Key does not exist"}), 400

    db.session.commit()
    return jsonify({"message": "Record updated successfully", "updated": updated}), 200


# Delete a record (mark inactive)
@app.route("/api/v1/record/<int:record_id>", methods=["DELETE"])
@handle_exceptions
@user_jwt_required
def delete_record(record_id):
    try:
        record = Record.query.get(record_id)
        if not record:
            return jsonify({"error": "Record not found"}), 404
        record.marked_for_deletion = True
        db.session.commit()
        return jsonify({"message": "Record marked as deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Serialize record
@app.route("/api/v1/record/<int:record_id>", methods=["GET"])
@handle_exceptions
@user_jwt_required
def serialize_record(record_id):
    record = Record.query.get(record_id)
    if not record:
        return jsonify({"error": "Record not found"}), 404
    return record_json(record), 200


# Serialize all record (Should use pagination but whatever)
@app.route("/api/v1/record", methods=["GET"])
@handle_exceptions
@user_jwt_required
def serialize_all_record():
    records = Record.query.all()
    
    return record_list_json(records), 200

def record_json(record):
    # User JSON Schema
    record_json = [
        {
            "id": record.id,
            "title": record.title,
            "subsystem_name": record.subsystem_name,
            "car_year": record.car_year,
            "description" : record.description,
            "impact" : record.impact,
            "cause" : record.cause,
            "mechanism" : record.mechanism,
            "corrective_action_plan" : record.corrective_action_plan,
            "time_of_failure" : record.time_of_failure,
            #"time_resolved": record.time_resolved,
            "created_at" : record.created_at.strftime("%d/%m/%y %l:%M %p %Z"),
            "modified_at" : record.modified_at,
            "team_name": get_teamname(record.team_id),
            "team_lead": get_username(get_team_leader(record.team_id)),
            "team_lead_email": get_email(get_team_leader(record.team_id)),
            "creator_name": get_username(record.creator_id),
            "creator_email": get_email(record.creator_id),
            "owner_name": get_username(record.owner_id),
            "owner_email": get_email(record.owner_id),
            #"record_valid": record.record_valid,
            #"analysis_valid": record.analysis_valid,
            #"corrective_valid": record.corrective_valid,
            #"draft": record.draft,
        }
    ]
    return jsonify(record_json)

def record_list_json(records):
    # User JSON Schema
    record_json = [
        {
            "id": record.id,
            "title": record.title,
            "subsystem_name": record.subsystem_name,
            "car_year": record.car_year,
            "time_of_failure" : record.time_of_failure,
            "time_resolved": record.time_resolved,
            "created_at" : record.created_at,
            "modified_at" : record.modified_at,
            "team_name": get_teamname(record.team_id),
            "creator_name": get_username(record.creator_id),
            "owner_name": get_username(record.owner_id),
            "record_valid": record.record_valid,
            "analysis_valid": record.analysis_valid,
            "corrective_valid": record.corrective_valid,
            "draft": record.draft,
        } for record in records
    ]
    return jsonify(record_json)

def get_teamname(team_id):
    team = Team.query.get(team_id)
    if team is None:
        return "N/A"
    return team.name

def get_team_leader(team_id):
    team = Team.query.get(team_id)
    if team is None:
        return "N/A"
    return team.leader_id

def get_username(user_id):
    user = User.query.get(user_id)
    if user is None:
        return "N/A"
    return user.name

def get_email(user_id):
    user = User.query.get(user_id)
    if user is None:
        return "N/A"
    return user.email
