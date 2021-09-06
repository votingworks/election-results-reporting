from urllib.parse import urljoin, urlencode
from flask import redirect, jsonify, request, session
from authlib.integrations.flask_client import OAuth, OAuthError

from . import auth
from ..models import *  # pylint: disable=wildcard-import
from .lib import (
    get_loggedin_user,
    set_loggedin_user,
    clear_loggedin_user,
    set_support_user,
    clear_support_user,
    get_support_user,
    UserType
)
from ..config import (
    SUPPORT_AUTH0_BASE_URL,
    SUPPORT_AUTH0_CLIENT_ID,
    SUPPORT_AUTH0_CLIENT_SECRET,
    SUPPORT_EMAIL_DOMAIN,
    ELECTIONADMIN_AUTH0_BASE_URL,
    ELECTIONADMIN_AUTH0_CLIENT_ID,
    ELECTIONADMIN_AUTH0_CLIENT_SECRET,
    JURISDICTIONADMIN_AUTH0_BASE_URL,
    JURISDICTIONADMIN_AUTH0_CLIENT_ID,
    JURISDICTIONADMIN_AUTH0_CLIENT_SECRET,
)

SUPPORT_OAUTH_CALLBACK_URL = "/auth/support/callback"
ELECTIONADMIN_OAUTH_CALLBACK_URL = "/auth/electionadmin/callback"
JURISDICTIONADMIN_OAUTH_CALLBACK_URL = "/auth/jurisdictionadmin/callback"

oauth = OAuth()

auth0_sa = oauth.register(
    "auth0_sa",
    client_id=SUPPORT_AUTH0_CLIENT_ID,
    client_secret=SUPPORT_AUTH0_CLIENT_SECRET,
    api_base_url=SUPPORT_AUTH0_BASE_URL,
    access_token_url=f"{SUPPORT_AUTH0_BASE_URL}/oauth/token",
    authorize_url=f"{SUPPORT_AUTH0_BASE_URL}/authorize",
    authorize_params={"max_age": "0"},
    client_kwargs={"scope": "openid profile email"},
)

auth0_ea = oauth.register(
    "auth0_ea",
    client_id=ELECTIONADMIN_AUTH0_CLIENT_ID,
    client_secret=ELECTIONADMIN_AUTH0_CLIENT_SECRET,
    api_base_url=ELECTIONADMIN_AUTH0_BASE_URL,
    access_token_url=f"{ELECTIONADMIN_AUTH0_BASE_URL}/oauth/token",
    authorize_url=f"{ELECTIONADMIN_AUTH0_BASE_URL}/authorize",
    authorize_params={"max_age": "0"},
    client_kwargs={"scope": "openid profile email"},
)

auth0_ja = oauth.register(
    "auth0_ja",
    client_id=JURISDICTIONADMIN_AUTH0_CLIENT_ID,
    client_secret=JURISDICTIONADMIN_AUTH0_CLIENT_SECRET,
    api_base_url=JURISDICTIONADMIN_AUTH0_BASE_URL,
    access_token_url=f"{JURISDICTIONADMIN_AUTH0_BASE_URL}/oauth/token",
    authorize_url=f"{JURISDICTIONADMIN_AUTH0_BASE_URL}/authorize",
    authorize_params={"max_age": "0"},
    client_kwargs={"scope": "openid profile email"},
)


def serialize_election(election):
    return {
        "id": election.id,
        "electionName": election.election_name,
        "electionDate": election.election_date,
        "pollsOpen": election.polls_open,
        "pollsClose": election.polls_close,
        "pollsTimezone": election.polls_timezone,
        "certificationDate": election.certification_date,
        "organizationId": election.organization_id
    }


@auth.route("/api/me")
def auth_me():
    user_type, user_key = get_loggedin_user(session)
    user = None
    if user_type in [UserType.ELECTION_ADMIN, UserType.JURISDICTION_ADMIN]:
        db_user = User.query.filter_by(email=user_key).first()
        if db_user:
            user = dict(
                type=user_type,
                email=db_user.email,
                organizations=[
                    {
                        "id": org.id,
                        "name": org.name,
                        "elections": [
                            serialize_election(election)
                            for election in org.elections
                            if election.deleted_at is None
                        ],
                    }
                    for org in db_user.organizations
                ],
                jurisdictions=[
                    {
                        "id": jurisdiction.id,
                        "name": jurisdiction.name,
                        "election": serialize_election(jurisdiction.election)
                    }
                    for jurisdiction in db_user.jurisdictions
                    if jurisdiction.election.deleted_at is None
                ],
            )
        else:
            clear_loggedin_user(session)

    support_user_email = get_support_user(session)
    return jsonify(
        user=user, supportUser=support_user_email and {"email": support_user_email}
    )


@auth.route("/auth/logout")
def logout():
    # Because we have max_age on the oauth requests, we don't need to log out
    # of Auth0.
    clear_loggedin_user(session)
    return redirect("/support" if get_support_user(session) else "/")


@auth.route("/auth/support/logout")
def support_logout():
    clear_support_user(session)
    clear_loggedin_user(session)
    return redirect("/")


@auth.route("/auth/support/start")
def support_login():
    redirect_uri = urljoin(request.host_url, SUPPORT_OAUTH_CALLBACK_URL)
    return auth0_sa.authorize_redirect(redirect_uri=redirect_uri)


@auth.route(SUPPORT_OAUTH_CALLBACK_URL)
def support_login_callback():
    auth0_sa.authorize_access_token()
    resp = auth0_sa.get("userinfo")
    userinfo = resp.json()

    # we rely on the auth0 auth here, but check against a single approved domain.
    if (
        userinfo
        and userinfo["email"]
        and userinfo["email"].split("@")[-1] == SUPPORT_EMAIL_DOMAIN
    ):
        set_support_user(session, userinfo["email"])
        return redirect("/support")
    else:
        return redirect("/")


@auth.route("/auth/electionadmin/start")
def electionadmin_login():
    redirect_uri = urljoin(request.host_url, ELECTIONADMIN_OAUTH_CALLBACK_URL)
    session["success_redirect_url"] = (
        request.args.get("redirectOnSucess")
        if request.args.get("redirectOnSucess")
        else "/"
    )
    return auth0_ea.authorize_redirect(redirect_uri=redirect_uri)


@auth.route(ELECTIONADMIN_OAUTH_CALLBACK_URL)
def electionadmin_login_callback():
    auth0_ea.authorize_access_token()
    resp = auth0_ea.get("userinfo")
    userinfo = resp.json()
    success_redirect = ""

    if userinfo and userinfo["email"]:
        user = User.query.filter_by(email=userinfo["email"]).first()
        if user and len(user.election_administrations) > 0:
            set_loggedin_user(session, UserType.ELECTION_ADMIN, userinfo["email"])
            success_redirect = session["success_redirect_url"]
            session.pop("success_redirect_url", None)
            return redirect(success_redirect)
    return jsonify(errors={ "message": "Oops, Invalid User!!" }), 400


@auth.route("/auth/jurisdictionadmin/start")
def jurisdictionadmin_login():
    redirect_uri = urljoin(request.host_url, JURISDICTIONADMIN_OAUTH_CALLBACK_URL)
    session["success_redirect_url"] = (
        request.args.get("redirectOnSucess")
        if request.args.get("redirectOnSucess")
        else "/"
    )
    return auth0_ja.authorize_redirect(redirect_uri=redirect_uri)


@auth.route(JURISDICTIONADMIN_OAUTH_CALLBACK_URL)
def jurisdictionadmin_login_callback():
    auth0_ja.authorize_access_token()
    resp = auth0_ja.get("userinfo")
    userinfo = resp.json()
    success_redirect = ""

    if userinfo and userinfo["email"]:
        user = User.query.filter_by(email=userinfo["email"]).first()
        if user and len(user.jurisdiction_administrations) > 0:
            set_loggedin_user(session, UserType.JURISDICTION_ADMIN, userinfo["email"])
            success_redirect = session["success_redirect_url"]
            session.pop("success_redirect_url", None)
            return redirect(success_redirect)
    return jsonify(errors={ "message": "Oops, Invalid User!!" }), 400


@auth.errorhandler(OAuthError)
def handle_oauth_error(error):
    # If Auth0 sends an error to one of the callbacks, we want to redirect the
    # user to the login screen and display the error.
    return redirect(
        "/?"
        + urlencode(
            {
                "error": "oauth",
                "message": f"Login error: {error.error} - {error.description}",
            }
        )
    )