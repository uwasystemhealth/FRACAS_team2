#  Better FRACAS
#  Copyright (C) 2023  Peter Tanner
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program.  If not, see <http://www.gnu.org/licenses/>.

from datetime import datetime
from typing import Dict, List, Union
from flask import jsonify, request, session
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import func
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
    # Deleted records are immutable
    if record.marked_for_deletion:
        return 0
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
    print('data:',data)
    identity = get_jwt_identity()
    try:
        update_record_kv(record, data)
        record.creator = User.query.filter_by(email=identity).first()
        # record.owner = record.creator
        team = Team.query.get(data['team_id'])
       
        leader_id = team.leader_id
        leader_obj = User.query.get(team.leader_id)
        record.owner = leader_obj
    except KeyError as e:
        return (
            jsonify({"err": "bad_key", "message": f"Key {str(e)} does not exist"}),
            400,
        )
    db.session.add(record)
    db.session.commit()
    app.logger.info(
        f"Created report {record.id=} {record.title=} {record.description=}"
    )
    return jsonify({"message": "Record created successfully", "id": record.id}), 201


@app.route("/api/v1/record/<int:record_id>", methods=["PATCH"])
@handle_exceptions
@user_jwt_required
def update_record(record_id):
    record = Record.query.get(record_id)
    updated = 0
    if not record or record.marked_for_deletion:
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
    app.logger.info(f"PATCH report {record.id=} {record.title=} {record.description=}")
    return jsonify({"message": "Record updated successfully", "updated": updated}), 200


# Delete a record (mark inactive)
@app.route("/api/v1/record/<int:record_id>", methods=["DELETE"])
@handle_exceptions
@user_jwt_required
def delete_record(record_id):
    record = Record.query.get(record_id)
    identity = get_jwt_identity()
    user: User = User.query.filter_by(email=identity).first()
    if not user.is_leading_team():
        return jsonify({"error": "Insufficient privileges"}), 403
    if not record or record.marked_for_deletion:
        return jsonify({"error": "Record not found"}), 404
    record.marked_for_deletion = True
    db.session.commit()
    return jsonify({"message": "Record marked as deleted"}), 200


# Serialize record
@app.route("/api/v1/record/<int:record_id>", methods=["GET"])
@handle_exceptions
@user_jwt_required
def serialize_record(record_id):
    record: Record = Record.query.get(record_id)
    if not record or record.marked_for_deletion:
        return jsonify({"error": "Record not found"}), 404
    return record.to_dict(), 200


# Serialize all record (Should use pagination but whatever)
@app.route("/api/v1/record", methods=["GET"])
@handle_exceptions
@user_jwt_required
def serialize_all_record():
    reports = []

    filter_owner = request.args.get("filter_owner", "") == "true"
    if filter_owner:
        identity = get_jwt_identity()
        user: User = User.query.filter_by(email=identity).first()
        reports: List[Record] = Record.query.filter_by(
            owner=user, marked_for_deletion=False
        )
    else:
        reports: List[Record] = Record.query.filter_by(marked_for_deletion=False)

    return jsonify([r.to_dict() for r in reports]), 200


# TODO: USE DATABASE INDICES INSTEAD OF A COUNT(*) GROUP BY TEAM_ID.
@app.route("/api/v1/record/stats", methods=["GET"])
@handle_exceptions
def record_statistics():
    count_query = (
        db.session.query(
            Record.team_id,
            Team.name.label("team_name"),
            func.count().label("record_count"),
        )
        .filter_by(marked_for_deletion=False)
        .join(
            Team, Record.team_id == Team.id, isouter=True
        )  # Join Record with Team using team_id
        .group_by(Record.team_id, Team.name)
        .all()
    )
    return (
        jsonify(
            [
                {
                    "team_id": cat[0],
                    "team_name": cat[1],
                    "open_reports": cat[2],
                }
                for cat in count_query
            ]
        ),
        200,
    )


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
