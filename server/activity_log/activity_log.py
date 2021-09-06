# pylint: disable=no-member
import uuid
from typing import Optional
from datetime import datetime
from dataclasses import dataclass
from flask import session

from ..models import ActivityLogRecord, Election
from ..database import db_session
from ..auth.lib import get_loggedin_user, get_support_user


@dataclass
class ActivityBase:
    organization_id: str
    organization_name: str
    election_id: str
    election_name: str
    user_type: Optional[str] = None
    user_key: Optional[str] = None
    support_user_email: Optional[str] = None


@dataclass
class Activity:
    timestamp: datetime
    base: ActivityBase


@dataclass
class DeleteElection(Activity):
    pass


@dataclass
class CreateElection(Activity):
    pass


@dataclass
class JurisdictionActivity(Activity):
    jurisdiction_id: str
    jurisdiction_name: str


@dataclass
class UploadAndProcessFile(Activity):
    file_type: str
    error: Optional[str]


@dataclass
class RecordResults(JurisdictionActivity):
    pass


def activity_base(election: Election) -> ActivityBase:
    user_type, user_key = get_loggedin_user(session) if session else (None, None)
    support_user_email = get_support_user(session) if session else None

    return ActivityBase(
        organization_id=election.organization.id,
        organization_name=election.organization.name,
        election_id=election.id,
        election_name=election.election_name,
        user_type=user_type,
        user_key=user_key,
        support_user_email=support_user_email,
    )


def record_activity(activity: Activity):
    info = dict(activity.__dict__, base=activity.base.__dict__)
    del info["timestamp"]  # Remove timestamp since we store it in a column

    db_session.add(
        ActivityLogRecord(
            id=str(uuid.uuid4()),
            timestamp=activity.timestamp,
            organization_id=activity.base.organization_id,
            activity_name=activity.__class__.__name__,
            info=info,
        )
    )