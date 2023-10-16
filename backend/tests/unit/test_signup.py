from flask_jwt_extended import create_access_token

"""
GIVEN A client calls the signup API
WHEN No email is provided
THEN The API returns an error status code and reports that an email is required
"""
def test_no_email(client, user_data):
    

    admin_email = "admin@test.com"

    token = create_access_token(admin_email)

    headers = {
        'Authorization': 'Bearer {}'.format(token)
    }

    signup_email = None
    signup_name = "Test Name"

    signup_payload = {'email':signup_email, 'name': signup_name}

    response = client.post("/api/v1/authentication/signup_request",headers=headers, json=signup_payload)

    assert(response.status_code == 400)
    assert(response.json.get('err') == "bad_request")
    assert(response.json.get('msg') == "email is required")


"""
GIVEN A client calls the signup API
WHEN An email exceeding the maximum email length is provided
THEN The API returns an error status code and reports that the provided email is too long
"""
def test_long_email(client, user_data):

    admin_email = "admin@test.com"

    token = create_access_token(admin_email)

    headers = {
        'Authorization': 'Bearer {}'.format(token)
    }

    signup_email = "thequickbrownfoxjumpsoverthelazydog@abcdefghijklmnopqrstuvwxyz.com"

    payload = {'email':signup_email}

    response = client.post("/api/v1/authentication/signup_request",headers=headers, json=payload)

    assert(response.status_code == 400)
    assert(response.json.get('err') == "long_email")
    assert(response.json.get('msg') == "email is too long")

# Test doesn't function properly
# """
# GIVEN A client calls the signup API
# WHEN A suitable email is provided
# THEN The API returns a success status code and
# """
# def test_suitable_email(client, user_data):

#     admin_email = "admin@test.com"

#     token = create_access_token(admin_email)

#     headers = {
#         'Authorization': 'Bearer {}'.format(token)
#     }

#     signup_email = "newuser@test.com"
#     signup_name = "Test User"
#     signup_team = ""

#     payload = {'email':signup_email, 'name':signup_name, 'team': signup_team}

#     response = client.post("/api/v1/authentication/signup_request",headers=headers, json=payload)

#     assert(response.status_code == 200)
#     assert(response.json.get('msg') == "signup email sent")


