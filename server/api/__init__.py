from flask import Blueprint

api = Blueprint("api", __name__)

# pylint: disable=wrong-import-position,cyclic-import

from . import audit_boards