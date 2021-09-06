import json
from werkzeug.exceptions import BadRequest
from werkzeug.datastructures import FileStorage


def decode_json_file(file: FileStorage) -> str:
    user_error = BadRequest("Please submit a valid JSON.")
    if file.mimetype not in ["application/json"]:
        raise user_error

    file_contents = json.load(file)
    # Instead of storing whole content for json, we can store comma separated keys with the help of below statement
    # print(', '.join(f'"{w}"' for w in file_contents.keys()))
    return json.dumps(file_contents)