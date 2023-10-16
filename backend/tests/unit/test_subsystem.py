from flask_jwt_extended import create_access_token
from app.models.record import Subsystem

"""
GIVEN A client calls the subsystem API
WHEN The client provides no subsystem name
THEN The API returns a failure status code and reports that subsystem name is required
"""
def test_create_subsystem_no_name(client, user_data, record_data):
    
    email = "wolff@test.com"
    token = create_access_token(email)
    
    headers = {
        'Authorization': 'Bearer {}'.format(token)
    }

    subsystem_name = ""
    subsystem_teamid = 1
    payload = {"name": subsystem_name, "team_id": subsystem_teamid}

    response = client.post("/api/v1/subsystem",headers=headers,json=payload)

    assert(response.status_code == 400)
    assert(response.json.get('err') == 'no_name')
    assert(response.json.get('msg') == 'subsystem name is required and cannot be empty')

"""
GIVEN A client calls the subsystem API
WHEN The client provides no subsystem team id
THEN The API returns a failure status code and reports that subsystem must be associated with a team
"""
def test_create_subsystem_no_team(client, user_data, record_data):
    
    email = "wolff@test.com"
    token = create_access_token(email)
    
    headers = {
        'Authorization': 'Bearer {}'.format(token)
    }

    subsystem_name = "Test"
    subsystem_teamid = ""
    payload = {"name": subsystem_name, "team_id": subsystem_teamid}

    response = client.post("/api/v1/subsystem",headers=headers,json=payload)

    assert(response.status_code == 400)
    assert(response.json.get('err') == 'no_team')
    assert(response.json.get('msg') == 'subsystem requires a team to be associated with')

"""
GIVEN A client calls the subsystem API
WHEN The client provides a valid subsystem name and id
THEN The API returns a success status code and a new row is created in the subsystem table
"""
def test_create_subsystem_valid(client, user_data, record_data):
    
    email = "wolff@test.com"
    token = create_access_token(email)
    
    headers = {
        'Authorization': 'Bearer {}'.format(token)
    }

    subsystem_name = "Test"
    subsystem_teamid = 1
    payload = {"name": subsystem_name, "team_id": subsystem_teamid}

    response = client.post("/api/v1/subsystem",headers=headers,json=payload)

    assert(response.status_code == 201)
    assert(response.json.get('message') == 'Subsystem created successfully')

    subsystem_id = response.json.get('id')

    # Check that subsystem id is associates to the correct subsystem
    returned_subsystem = Subsystem.query.filter_by(id=subsystem_id).all()[0]
    assert(returned_subsystem.name == subsystem_name)

