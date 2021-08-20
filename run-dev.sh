#!/usr/bin/env bash

export ERR_AUDITADMIN_AUTH0_BASE_URL="https://votingworks-noauth.herokuapp.com"
export ERR_JURISDICTIONADMIN_AUTH0_BASE_URL="https://votingworks-noauth.herokuapp.com"
export ERR_AUDITADMIN_AUTH0_CLIENT_ID="test"
export ERR_JURISDICTIONADMIN_AUTH0_CLIENT_ID="test"
export ERR_AUDITADMIN_AUTH0_CLIENT_SECRET="secret"
export ERR_JURISDICTIONADMIN_AUTH0_CLIENT_SECRET="secret"
export ERR_SESSION_SECRET="secret"
export ERR_HTTP_ORIGIN="http://localhost:3000"

export FLASK_ENV=${FLASK_ENV:-development}
trap 'kill 0' SIGINT SIGHUP
cd "$(dirname "${BASH_SOURCE[0]}")"

poetry run python -m server.main &
yarn --cwd client start