from ..models import *  # pylint: disable=wildcard-import


def serialize_members(audit_board):
    members = []

    for i in range(0, 2):
        name = getattr(audit_board, f"member_{i + 1}")
        affiliation = getattr(audit_board, f"member_{i + 1}_affiliation")

        if not name:
            break

        members.append({"name": name, "affiliation": affiliation})

    return members