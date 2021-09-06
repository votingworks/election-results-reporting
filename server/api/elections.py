
import uuid
import json
from datetime import datetime, timezone
from flask import jsonify, request
from werkzeug.exceptions import Conflict

from . import api
from .jurisdictions import process_jurisdictions_file
from ..models import *  # pylint: disable=wildcard-import
from ..database import db_session
from ..auth import check_access, UserType, restrict_access
from ..util.jsonschema import JSONDict, validate
from ..util.csv_parse import decode_csv_file
from ..util.json_parse import decode_json_file
from ..activity_log import (
    CreateElection,
    DeleteElection,
    UploadAndProcessFile,
    activity_base,
    record_activity,
)

ELECTION_SCHEMA = {
    "type": "object",
    "properties": {
        "electionName": {"type": "string"},
        "electionDate": {"type": "string"},

        "pollsOpen": {"type": "string"},
        "pollsClose": {"type": "string"},
        "pollsTimezone": {"type": "string"},

        "certificationDate": {"type": "string"},

        "organizationId": {"anyOf": [{"type": "string"}, {"type": "null"}]},
    },
    "required": ["organizationId", "electionName", "electionDate", "pollsOpen", "pollsClose", "pollsTimezone", "certificationDate"],
    "additionalProperties": False,
}


def validate_new_election(election: JSONDict):
    validate(election, ELECTION_SCHEMA)

    if Election.query.filter_by(
        election_name=election["electionName"], organization_id=election["organizationId"]
    ).first():
        raise Conflict(
            f"An election with name '{election['electionName']}' already exists within your organization"
        )


def serialize_election(election: Election) -> JSONDict:
    json_election: JSONDict = {
        "id": election.id,
        "election_name": election.election_name,
        "electionDate": election.election_date,
        "pollsOpen": election.polls_open,
        "pollsClose": election.polls_close,
        "pollsTimezone": election.polls_timezone,
        "certificationDate": election.certification_date,
        "organizationId": election.organization_id
    }

    return json_election


@api.route("/election", methods=["GET"])
@restrict_access([UserType.ELECTION_ADMIN])
def list_all_elections():
    elections = Election.query.order_by(Election.election_name).all()
    json_elections = [ serialize_election(election) for election in elections ]

    return jsonify({"elections": json_elections})


@api.route("/election", methods=["POST"])
@restrict_access([UserType.ELECTION_ADMIN])
def create_election():
    required_fields = ["organizationId", "electionName", "electionDate", "pollsOpen", "pollsClose", "pollsTimezone", "certificationDate"]
    election = {field : request.values[field] for field in request.values if field in required_fields}
    validate_new_election(election)
    if "jurisdictions" not in request.files:
        raise Conflict("Missing required file parameter 'jurisdictions'")

    election = Election(
        id=str(uuid.uuid4()),
        election_name=election["electionName"],
        election_date=election["electionDate"],
        polls_open=election["pollsOpen"],
        polls_close=election["pollsClose"],
        polls_timezone=election["pollsTimezone"],
        certification_date=election["certificationDate"],
        organization_id=election["organizationId"]
    )

    jurisdictions_file = request.files["jurisdictions"]
    election.jurisdictions_file = File(
        id=str(uuid.uuid4()),
        name=jurisdictions_file.filename,
        contents=decode_csv_file(jurisdictions_file)
    )

    definition_file = request.files["definition"]
    election.definition_file = File(
        id=str(uuid.uuid4()),
        name=definition_file.filename,
        contents=decode_json_file(definition_file)
    )

    check_access([UserType.ELECTION_ADMIN], election)

    db_session.add(election)
    db_session.flush()  # Ensure we can read election.organization in activity_base
    record_activity(
        CreateElection(timestamp=election.created_at, base=activity_base(election))
    )

    process_jurisdictions_file(db_session, election, election.jurisdictions_file)
    record_activity(
        UploadAndProcessFile(timestamp=election.jurisdictions_file.processing_started_at, base=activity_base(election), file_type="jurisdictions", error=election.jurisdictions_file.processing_error)
    )

    db_session.commit()
    return jsonify(status="ok", electionId=election.id)


@api.route("/election/<election_id>/definition/file", methods=["GET"])
@restrict_access([UserType.ELECTION_ADMIN, UserType.JURISDICTION_ADMIN])
def get_definition_file(election: Election):
    file_data = json.loads(election.definition_file.contents)
    return jsonify(contests=file_data['contests'], districts=file_data['districts'], precincts=file_data['precincts'])


@api.route("/election/<election_id>", methods=["DELETE"])
@restrict_access([UserType.ELECTION_ADMIN])
def delete_election(election: Election):
    election.deleted_at = datetime.now(timezone.utc)
    record_activity(
        DeleteElection(timestamp=election.deleted_at, base=activity_base(election))
    )
    db_session.commit()
    return jsonify(status="ok")