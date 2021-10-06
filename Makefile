## Dependency setup (Windows OS):
# download python-3.8.11 windows installer from https://github.com/adang1345/PythonWindows/tree/master/3.8.11
# https://github.com/adang1345/PythonWindows/raw/master/3.8.11/python-3.8.11-amd64.exe
# download nodejs from https://nodejs.org/dist/latest-v10.x/
# https://nodejs.org/dist/latest-v10.x/node-v10.24.1-x64.msi
# download PostgreSQL from https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
# https://www.enterprisedb.com/postgresql-tutorial-resources-training?cid=61

deps:
	sudo apt install python3.8 python3-pip nodejs libpython3.8-dev libpq-dev graphicsmagick
	python3.8 -m pip install poetry
	sudo npm install -g yarn
	sudo apt install postgresql

# this should only be used for development
initdevdb:
	sudo -u postgres psql -c "create user elrep superuser password 'elrep';"
	sudo -u postgres psql -c "create database elrep with owner elrep;"

install:
	poetry install --no-dev
	yarn install
	yarn --cwd client install
	yarn --cwd client build

install-development:
	poetry install
	yarn install
	yarn --cwd "client" install & yarn upgrade

resettestdb:
	FLASK_ENV=test make resetdb

resetdb:
	FLASK_ENV=$${FLASK_ENV:-development} poetry run python -m scripts.resetdb

dev-environment: deps initdevdb install-development resetdb

typecheck-server:
	poetry run mypy server scripts

format-server:
	poetry run black .

lint-server:
	poetry run pylint server scripts

test-client:
	yarn --cwd client lint
	yarn --cwd client test

test-server:
	poetry run pytest -n auto

test-server-coverage:
	poetry run pytest -n auto --cov=.

run-dev:
	./run-dev.sh

seed-testdb:
	./run-test.sh
