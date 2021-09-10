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
from ..util.process_file import process_file

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

def process_definitions_file(session, election: Election, file: File) -> None:
    def process():
        definition_json = json.loads(election.definition_file.contents)
        bulk_update_from_definitions(
            session,
            election,
            definition_json,
        )

    process_file(session, file, process)

def bulk_update_from_definitions(
    session, election: Election, definition_json
) -> None:
    """
    Updates the precincts, districts,  for an election all at once. Requires a SQLAlchemy session to use,
    and uses a nested transaction to ensure the changes made are atomic. Depending on your
    session configuration, you may need to explicitly call `commit()` on the session to flush
    changes to the database.
    """
    with session.begin_nested():
        # populate precinct table
        for itr_precinct in definition_json['precincts']:
            precinct = Precinct(
                id=str(uuid.uuid4()),
                name=itr_precinct['name'],
                definitions_file_id=itr_precinct['id'],
                election=election
            )
            session.add(precinct)
        # populate district table
        for itr_district in definition_json['districts']:
            district = District(
                id=str(uuid.uuid4()),
                name=itr_district['name'],
                definitions_file_id=itr_district['id'],
                election=election
            )
            session.add(district)
        # populate party table
        for itr_party in definition_json['parties']:
            party = Party(
                id=str(uuid.uuid4()),
                name=itr_party['fullName'],
                definitions_file_id=itr_party['id'],
                election=election
            )
            session.add(party)
        # populate contest table
        for itr_contest in definition_json['contests']:
            contest = Contest(
                id=str(uuid.uuid4()),
                name=itr_contest['title'],
                type=itr_contest['type'],
                seats=itr_contest['seats'],
                allow_write_ins=itr_contest['allowWriteIns'],
                definitions_file_id=itr_contest['id'],
                district=district,
                election=election
            )
            # if district exists, create contest with it
            district = session.query(District).filter_by(definitions_file_id=itr_contest['districtId']).one_or_none()
            if district:
                contest.district=district

            session.add(contest)
            # populate candidate table
            for itr_candidate in itr_contest['candidates']:
                candidate = Candidate(
                    id=str(uuid.uuid4()),
                    name=itr_candidate['name'],
                    definitions_file_id=itr_candidate['id'],
                    contest=contest
                )
                # if party exists, create candidate with it
                party = session.query(Party).filter_by(definitions_file_id=itr_candidate['partyId']).one_or_none()
                if party:
                    candidate.party=party
                session.add(candidate)


@api.route("/election", methods=["POST"])
@restrict_access([UserType.ELECTION_ADMIN])
def create_election():
    required_fields = ["organizationId", "electionName", "electionDate", "pollsOpen", "pollsClose", "pollsTimezone", "certificationDate"]
    election = {field : request.values[field] for field in request.values if field in required_fields}
    validate_new_election(election)
    if "jurisdictions" not in request.files:
        raise Conflict("Missing required file parameter 'participating jurisdictions'")
    if "definition" not in request.files:
        raise Conflict("Missing required file parameter 'election definition'")

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

    process_definitions_file(db_session, election, election.definition_file)
    record_activity(
        UploadAndProcessFile(timestamp=election.definition_file.processing_started_at, base=activity_base(election), file_type="election_definition", error=election.definition_file.processing_error)
    )

    db_session.commit()
    return jsonify(status="ok", electionId=election.id)

@api.route("/election/<election_id>", methods=["DELETE"])
@restrict_access([UserType.ELECTION_ADMIN])
def delete_election(election: Election):
    election.deleted_at = datetime.now(timezone.utc)
    record_activity(
        DeleteElection(timestamp=election.deleted_at, base=activity_base(election))
    )
    db_session.commit()
    return jsonify(status="ok")


@api.route("/election/<election_id>/definition/file", methods=["GET"])
@restrict_access([UserType.ELECTION_ADMIN, UserType.JURISDICTION_ADMIN])
def get_definition_file(election: Election):
    contests = []
    for itr_contest in election.contests:
        contest = { key: itr_contest.__dict__[key] for key in itr_contest.__dict__.keys() & {'id', 'name', 'allow_write_ins'} }
        contest['allowWriteIns'] = contest.pop('allow_write_ins')
        contest['candidates'] = [{key: itr_candidate.__dict__[key] for key in itr_candidate.__dict__.keys() & {'id', 'name'} } for itr_candidate in itr_contest.candidates]
        contests.append(contest)
    precincts = [{key:itr_precinct.__dict__[key] for key in itr_precinct.__dict__.keys() & {'id', 'name'} } for itr_precinct in election.precincts]
    districts = [{key:itr_district.__dict__[key] for key in itr_district.__dict__.keys() & {'id', 'name'} } for itr_district in election.districts]
    return jsonify(contests=contests, districts=districts, precincts=precincts)


@api.route("/election/<election_id>/data", methods=["GET"])
@restrict_access([UserType.ELECTION_ADMIN])
def get_election_data(election: Election):
    election_data = []
    election_results = ElectionResult.query.filter_by(election_id=election.id).all()
    if election_results:
        for itr_result in election_results:
            election_data_record = {key: itr_result.__dict__[key] for key in itr_result.__dict__.keys() & {'id', 'source', 'status'}}
            election_data_record['createdAt'] = itr_result.created_at
            election_data_record['totalBallotsCast'] = itr_result.total_ballots_cast
            election_data_record['jurisdictionName'] = itr_result.jurisdiction.name
            election_data_record['fileName'] = itr_result.precinct.name
            election_data_record['contests'] = []
            for itr_contest in itr_result.contests:
                contest = {key:itr_contest.__dict__[key] for key in itr_contest.__dict__.keys() & {'id', 'name', 'allow_write_ins'} }
                contest['allowWriteIns'] = contest.pop('allow_write_ins')
                contest['candidates'] = [{'id': itr_candidate.__dict__['id'], 'name': itr_candidate.__dict__['name'], 'numVotes': itr_candidate.__dict__['num_votes'] } for itr_candidate in itr_contest.candidates]
                contest['candidates'].append({'id': len(itr_contest.candidates), 'name': 'Write-in', 'numVotes': itr_contest.write_in_votes})
                election_data_record['contests'].append(contest)
            election_data.append(election_data_record)
        return jsonify(message="Entries Found", data=election_data)
    return jsonify(message="No entry found!")