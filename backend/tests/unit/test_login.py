# User with no JWT token cannot access secure page - done

# Check login with user that doesn't exist - done

# Check login with wrong password -done

# Check login with correct password - JWT token and refresh token

# Test JWT token and refresh token can log into secure page

# Test JWT token expiry ?

def test_secure_no_auth_header(client,user_data):
    
    response = client.delete("/api/v1/authentication/logout")

    assert(response.status_code == 401)
    assert(response.json.get('msg') == 'Missing Authorization Header')


def test_secure_invalid_token(client,user_data):
    
    faketoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    headers = {
        'Authorization': 'Bearer {}'.format(faketoken)
    }

    response = client.delete("/api/v1/authentication/logout",headers=headers)

    assert(response.status_code == 422)
    assert(response.json.get('msg') == 'Signature verification failed')



def test_login_noemailorpassword(client,user_data):
    
    email = ""
    password = ""

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 401)
    assert(response.json.get('err') == 'invalid_credentials')
    assert(response.json.get('msg') == 'Bad email or password, or user does not exist')


def test_login_fake_email(client,user_data):
    
    email = "fakeuser"
    password = "test"

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 401)
    assert(response.json.get('err') == 'invalid_credentials')
    assert(response.json.get('msg') == 'Bad email or password, or user does not exist')


def test_login_wrong_password(client,user_data):
    
    email = "wolff@test.com"
    password = "wrongpassword"

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 401)
    assert(response.json.get('err') == 'invalid_credentials')
    assert(response.json.get('msg') == 'Bad email or password, or user does not exist')


def test_login_valid_credentials(client,user_data):

    email = "wolff@test.com"
    password = "test"

    payload = {'email':email, 'password':password}

    response = client.post("/api/v1/authentication/login", json=payload)

    assert(response.status_code == 200)

    # Check access token and refresh token exist
    # response.access_token


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