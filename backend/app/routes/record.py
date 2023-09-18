from datetime import datetime
from typing import Dict, Union
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from app import app, db
from app.models.record import Record, Subsystem
from app.utils import handle_exceptions
from app.models.authentication import User
from app.utils import user_jwt_required

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


def update_record_kv(record: Record, data: Dict[str, Union[str, int]]) -> None:
    # CHECK KEYS
    for key in data.keys():
        if not hasattr(record, key) or key in Record.PROTECTED_FIELDS:
            # DO NOT REVEAL PROTECTED FIELDS (USE SAME ERROR)
            raise KeyError(key)
    for key, value in data.items():
        # CHECK KEYS AGAIN FOR SAFETY
        if hasattr(record, key) and key not in Record.PROTECTED_FIELDS:
            if getattr(record, key) != value:
                if key in Record.TIME_FIELDS:
                    value = datetime.strptime(value, "%a, %d %b %Y %H:%M:%S %Z")
                setattr(record, key, value)
                record.modified_at = datetime.utcnow()
        else:
            # DO NOT REVEAL PROTECTED FIELDS (USE SAME ERROR)
            raise KeyError(key)


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
    return jsonify({"message": "Record created successfully", "id": record.id}), 201


@app.route("/api/v1/record/<int:record_id>", methods=["PATCH"])
def update_record(record_id):
    try:
        record = Record.query.get(record_id)
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
            update_record_kv(record, data)
        except KeyError:
            return jsonify({"err": "bad_key", "message": "Key does not exist"}), 400

        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
def serialize_all_record():
    return jsonify([r.to_dict() for r in Record.query.all()]), 200
