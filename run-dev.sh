#!/usr/bin/env bash
read -p "Is this your first run?: (y/n) " input

# Run commands from below file only once to seed database
if [[ $(tr '[:upper:]' '[:lower:]' <<< "$input") == "y" || $(tr '[:upper:]' '[:lower:]' <<< "$input") == "yes" ]]
then
    echo "Initializing Organization and Election Admin:"
    export FLASK_ENV=test
    poetry run python -m scripts.cleardb
    ORG_ID=`poetry run python -m scripts.create-org "Cypress Test Org"`
    poetry run python -m scripts.create-admin $ORG_ID "election-admin-cypress@example.com"
fi

# Below commands to be run on every app startup
export ELREP_ELECTIONADMIN_AUTH0_BASE_URL="https://votingworks-noauth.herokuapp.com"
export ELREP_JURISDICTIONADMIN_AUTH0_BASE_URL="https://votingworks-noauth.herokuapp.com"
export ELREP_ELECTIONADMIN_AUTH0_CLIENT_ID="test"
export ELREP_JURISDICTIONADMIN_AUTH0_CLIENT_ID="test"
export ELREP_ELECTIONADMIN_AUTH0_CLIENT_SECRET="secret"
export ELREP_JURISDICTIONADMIN_AUTH0_CLIENT_SECRET="secret"
export ELREP_SESSION_SECRET="secret"
export ELREP_HTTP_ORIGIN="http://localhost:3000"

export FLASK_ENV=${FLASK_ENV:-development}
trap 'kill 0' SIGINT SIGHUP
cd "$(dirname "${BASH_SOURCE[0]}")"

poetry run python -m server.main &
yarn --cwd "client" start