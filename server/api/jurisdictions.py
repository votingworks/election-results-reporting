import enum
import uuid
import datetime
from flask import jsonify, request
from werkzeug.exceptions import BadRequest

from . import api
from ..models import *  # pylint: disable=wildcard-import
from ..database import db_session
from ..auth import restrict_access, UserType
from ..util.process_file import serialize_file, serialize_file_processing
from ..util.csv_parse import decode_csv_file


class JurisdictionStatus(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETE = "COMPLETE"


@api.route("/election/<election_id>/jurisdiction/file", methods=["GET"])
@restrict_access([UserType.AUDIT_ADMIN])
def get_jurisdictions_file(election: Election):
    return jsonify(
        file=serialize_file(election.jurisdictions_file),
        processing=serialize_file_processing(election.jurisdictions_file),
    )


JURISDICTION_NAME = "Jurisdiction"
ADMIN_EMAIL = "Admin Email"


@api.route("/election/<election_id>/jurisdiction/file", methods=["PUT"])
@restrict_access([UserType.AUDIT_ADMIN])
def update_jurisdictions_file(election: Election):
    if "jurisdictions" not in request.files:
        raise BadRequest("Missing required file parameter 'jurisdictions'")

    jurisdictions_file = request.files["jurisdictions"]
    election.jurisdictions_file = File(
        id=str(uuid.uuid4()),
        name=jurisdictions_file.filename,
        contents=decode_csv_file(jurisdictions_file),
        uploaded_at=datetime.datetime.now(timezone.utc),
    )

    db_session.commit()

    return jsonify(status="ok")