# FRACAS_team2 - Peter Tanner, Haoyuan Wang, Harsha Mane, Igor Pavkov, Insan Basrewan, Nicolas Baxter

## Docker instructions

1. Make sure your current working directory is the project root.
2. Run `docker-compose build` once after downloading the repository, or whenever you modify the `Dockerfile`s.
3. Run `docker-compose up` every time you want to start the frontend and backend in development mode.
4. Access the frontend at `localhost:3000` and backend at `localhost:5000`.
5. Frontend and backend should automatically reload whenever you make a change to the files locally, or inside the docker container.
6. `Ctrl+C` terminates the frontend and backend.

Alternatively, you may wish to run the application locally (without docker).

## How to Run locally

Download a copy of the repository, onto your local machine.

### Flask (API):

You must have Python installed on your system.

1. 'cd' into the api folder in this repository, in your local machine
2. Setup a Python virtual environment (venv)

```bash
python3 -m venv venv
# For Mac/Linux
source venv/bin/activate
# For Windows
.\venv\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. If app.db is not present, you'll have to initialise a database

```bash
flask db init
flask db migrate
flask db upgrade
```

5. Launch the api

```bash
flask run
```

6. Access via http://127.0.0.1:5000

### React

1. Install dependencies from `yarn.lock` lockfile.

```bash
yarn install --frozen-lockfile
```

2. Start the frontend server.

```bash
yarn start
```

3. Access via http://127.0.0.1:3000

## Description

FRACAS for UWA Motorsport

The University of Western Australia Motorsport club (UWAM) is a student-led club that competes annually in the FSAE-Australasia student design competition. This competition involves designing, building and racing a formula-style racecar. UWAM is inefficient at transferring experience and technical knowledge from competent members such as current Team Leads to new members.

This project aims to build and test a Failure, Reporting, Analysis and Corrective Action System (FRACAS) for UWAM.

This system will serve as an element of a greater knowledge management and transfer system, allowing current and future members to see records of past failures and how they were dealt with. Our intention is that this knowledge capture system can improve UWAM's scheduling, budgeting, management, vehicle testing, and the focus of future design efforts.

A requirements documents has been developed as part of a BPhil 2nd year project. The clients are Erwin Bauernschmitt from UWAM and Prof Melinda Hodkiewicz
