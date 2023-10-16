"""
GIVEN The client calls an API requiring an access token
WHEN No header is provided
THEN the API returns a failure status code and reports that the authorization header is missing 
"""
def test_secure_no_auth_header(client,user_data):
    
    response = client.delete("/api/v1/authentication/logout")

    assert(response.status_code == 401)
    assert(response.json.get('msg') == 'Missing Authorization Header')


"""
GIVEN The client calls an API requiring an access token
WHEN A header is provided with a fake access token
THEN the API returns a failure status code and reports that signature verification failed 
"""
def test_secure_invalid_token(client,user_data):
    
    faketoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    headers = {
        'Authorization': 'Bearer {}'.format(faketoken)
    }

    response = client.delete("/api/v1/authentication/logout",headers=headers)

    assert(response.status_code == 422)
    assert(response.json.get('msg') == 'Signature verification failed')


"""
GIVEN The client calls the login API
WHEN The payload contains empty strings for email and password
THEN the API returns a failure status code and reports invalid credentials
"""
def test_login_noemailorpassword(client,user_data):
    
    email = ""
    password = ""

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 401)
    assert(response.json.get('err') == 'invalid_credentials')
    assert(response.json.get('msg') == 'Bad email or password, or user does not exist')

"""
GIVEN The client calls the login API
WHEN The payload contains an email of a user that doesn't exist
THEN the API returns a failure status code and reports invalid credentials
"""
def test_login_fake_email(client,user_data):
    
    email = "fakeuser@test.com"
    password = "test"

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 401)
    assert(response.json.get('err') == 'invalid_credentials')
    assert(response.json.get('msg') == 'Bad email or password, or user does not exist')

"""
GIVEN The client calls the login API
WHEN The payload contains the email of an existing user with the incorrect password
THEN the API returns a failure status code and reports invalid credentials
"""
def test_login_wrong_password(client,user_data):
    
    email = "wolff@test.com"
    password = "wrongpassword"

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 401)
    assert(response.json.get('err') == 'invalid_credentials')
    assert(response.json.get('msg') == 'Bad email or password, or user does not exist')

"""
GIVEN The client calls the login API
WHEN The payload contains the email of an existing user with the correct password
THEN the API returns a success status code and returns valid access and refresh tokens
"""
def test_login_valid_credentials(client,user_data):

    email = "wolff@test.com"
    password = "test"

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 200)

    # Check access token and refresh token exist
    # response.access_token

"""
GIVEN A client logged in as a user
WHEN The logout API is called 
THEN The API returns a success status code and the user's access token is added to the blacklist
"""
def test_logout(client,user_data):

    email = "wolff@test.com"
    password = "test"

    payload = {'email':email, 'password':password}

    tokens = client.post("/api/v1/authentication/login", json=payload)

    headers = {
        'Authorization': 'Bearer {}'.format(tokens.json.get('access_token'))
    }

    response = client.delete("/api/v1/authentication/logout",headers=headers)

    assert(response.status_code == 200)

    # Check the token is in blacklist


"""
GIVEN A client logged in as a user
WHEN The a user-restricted API is called
THEN The API returns a success status code
"""
def test_secure_credentials(client,user_data):
    
    email = "wolff@test.com"
    password = "test"

    payload = {'email':email, 'password':password}

    tokens = client.post("/api/v1/authentication/login", json=payload)

    headers = {
        'Authorization': 'Bearer {}'.format(tokens.json.get('access_token'))
    }

    response = client.delete("/api/v1/authentication/logout",headers=headers)
    
    assert(response.status_code == 200)


"""
GIVEN A client logged in as a non-superuser
WHEN The a superuser-restricted API is called
THEN The API returns a failure status code and reports invalid permissions
"""
def test_secure_no_superuser(client,user_data):
    
    email = "wolff@test.com"
    password = "test"

    payload = {'email':email, 'password':password}

    tokens = client.post("/api/v1/authentication/login", json=payload)

    headers = {
        'Authorization': 'Bearer {}'.format(tokens.json.get('access_token'))
    }

    response = client.get("/api/v1/user",headers=headers)

    assert(response.status_code == 401)
    assert(response.json.get('err') == 'invalid_permissions')
    assert(response.json.get('msg') == 'endpoint requires superuser status')


"""
GIVEN A client logged in as a superuser
WHEN The a superuser-restricted API is called
THEN The API returns a success status code and the API functionality is performed
"""
def test_superuser_credentials(client,user_data):
    
    email = "admin@test.com"
    password = "test"

    payload = {'email':email, 'password':password}

    tokens = client.post("/api/v1/authentication/login", json=payload)

    headers = {
        'Authorization': 'Bearer {}'.format(tokens.json.get('access_token'))
    }

    response = client.get("/api/v1/user",headers=headers)

    assert(response.status_code == 200)

    # Check users were gotten