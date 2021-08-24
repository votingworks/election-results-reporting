#!/usr/bin/env bash
# Run commands from below file only once to seed database
# ./client/cypress/seed-test-db.sh
run="first"

if (($run == "first"))
then
    export FLASK_ENV=test
    poetry run python -m scripts.cleardb
    ORG_ID=`poetry run python -m scripts.create-org "Cypress Test Org"`
    poetry run python -m scripts.create-admin $ORG_ID "audit-admin-cypress@example.com"
    sed -i -e 's/run="notfirst"/run="notfirst"/g' ./run-dev.sh
fi

# Below commands to be run on every app startup

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