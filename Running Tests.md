### Running Tests

Follow steps 1-3 from the Flask API running instructions to set up a Python virtual environment and install dependencies.


Test cases are run by executing 'pytest' in the terminal, and flags can be added to filter which test cases are run. A few examples are shown below:
```bash
# Run all test cases
pytest

# Only run test cases in the file selenium.py
pytest functional/test_selenium.py 

# Only run test cases in the file test_login.py that have 'secure' in their names
pytest unit/test_login.py -k "secure" 
```

Before running selenium tests, both the React frontend and Flask backend must be running. 
The frontend should be run according to the above instructions for React. 
The backend instructions should be followed for steps 1-4. After this, the following python file should be executed. This file sets the environment variable for flask to use the test database URL then executes 'flask run':
```bash
python flask_run_test.py
```



All test cases are performed on the database under backend/tests/test.db. This database is set up and torn down between each test to ensure that test cases are isolated and do not interfere with each other.