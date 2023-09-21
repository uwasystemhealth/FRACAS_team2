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
from typing import Dict, Union
from flask import jsonify, request, session
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import func
from app import app, db
from app.models.record import Record, Subsystem
from app.utils import handle_exceptions
from app.models.authentication import User
from app.utils import user_jwt_required
from app.models.team import Team

"""
SUBSYSTEM
"""


@app.route("/api/v1/subsystem", methods=["POST"])
def create_subsystem():
    try:
        subsystem = Subsystem()
        name = request.json.get("subsystem", None)
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
        subsystem.subsystem = name
        db.session.add(subsystem)
        db.session.commit()
        return (
            jsonify({"message": "Subsystem created successfully", "id": subsystem.id}),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Serialize all subsystem (Should use pagination but whatever)
@app.route("/api/v1/subsystem", methods=["GET"])
def serialize_all_subsystem():
    try:
        return jsonify([s.to_dict() for s in Subsystem.query.all()]), 200
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
@app.route("/api/v1/record", methods=["POST"])
@handle_exceptions
@user_jwt_required
def create_record():
    record = Record()
    data = request.json
    identity = get_jwt_identity()
    try:
        update_record_kv(record, data)
        record.creator = User.query.filter_by(email=identity).first()
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
    app.logger.info(f"PATCH report {record.id=} {record.title=} {record.description=}")
    return jsonify({"message": "Record updated successfully", "updated": updated}), 200


# Delete a record (mark inactive)
@app.route("/api/v1/record/<int:record_id>", methods=["DELETE"])
def delete_record(record_id):
    try:
        record = Record.query.get(record_id)
        if not record:
            return jsonify({"error": "Record not found"}), 404

        record.deleted = True
        db.session.commit()
        return jsonify({"message": "Record marked as deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Serialize record
@app.route("/api/v1/record/<int:record_id>", methods=["GET"])
@handle_exceptions
def serialize_record(record_id):
    record = Record.query.get(record_id)
    if not record:
        return jsonify({"error": "Record not found"}), 404

    return jsonify(record.to_dict()), 200


# Serialize all record (Should use pagination but whatever)
@app.route("/api/v1/record", methods=["GET"])
@handle_exceptions
@user_jwt_required
def serialize_all_record():
    reports = []
    if request.args.get("user_only", "") == "true":
        identity = get_jwt_identity()
        user: User = User.query.filter_by(email=identity).first()
        reports = Record.query.filter_by(creator=user)
    else:
        reports = Record.query.all()

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
