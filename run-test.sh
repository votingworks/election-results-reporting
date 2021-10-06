#!/usr/bin/env bash
echo "Initializing Organization and Election Admin:"

poetry run python -m scripts.cleardb
ORG_ID=`poetry run python -m scripts.create-org "Test Organization"`
poetry run python -m scripts.create-admin $ORG_ID "election-admin@example.com"
