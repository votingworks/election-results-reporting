# pylint: disable=invalid-name
import sys, uuid

from server.models import User, ElectionAdministration
from server.database import db_session

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python -m scripts.create-admin <org_id> <user_email>")
        sys.exit(1)

    org_id, email = sys.argv[1:]  # pylint: disable=unbalanced-tuple-unpacking
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(id=str(uuid.uuid4()), email=email, external_id=email)
        db_session.add(user)
    election_admin = ElectionAdministration(user_id=user.id, organization_id=org_id)
    db_session.add(election_admin)
    db_session.commit()

    print(user.id)
    print("Now add the user to auth0: https://manage.auth0.com/")
    print("For staging users, use the err-aa-staging tenant.")
    print("For prod users, use the err-aa tenant.")