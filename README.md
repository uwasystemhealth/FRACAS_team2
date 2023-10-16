# FRACAS_team2 - Peter Tanner, Haoyuan Wang, Harsha Mane, Igor Pavkov, Insan Basrewan, Nicolas Baxter

## How To Deploy
`setup.sh` will get you fully running on a production machine. 
including background running, start on boot and self managing SSL certificates.

Deployment script have only been tested on Ubuntu. 
(Might not work on other platforms or require modification)

1. Log in or SSH into your Ubuntu machine
2. git clone this repository 
```bash
git clone https://github.com/uwasystemhealth/fracas_team2.git
```
3. cd into the fracas_team2 
```bash
cd fracas_team2
```
4. Give setup.sh permissions 
```bash
sudo chmod +x ./setup.sh
```
5. Run the script and follow any given instructions
```bash
sudo ./setup.sh
```
6. Go to your provided domain with admin@admin.com and the password you provided during setup

Alternatively, you may wish to run the application manually.

## How to Run Manually

Download a copy of the repository, onto your local machine.

### Flask (API):

You must have Python installed on your system.

1. 'cd' into 'backend' folder in this repository, in your local machine
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
export ADMIN_PASSWORD="Your-password-for-admin-access"
flask quickstart
```

5. Launch the backend

```bash
flask run --debug
```

### React

1. Install dependencies from `yarn.lock` lockfile.

```bash
yarn install
```

2. Start the frontend server.

```bash
yarn dev
```

3. Access via http://localhost:3000 with "admin@admin.com" and the password you created earlier

## Description

FRACAS for UWA Motorsport

The University of Western Australia Motorsport club (UWAM) is a student-led club that competes annually in the FSAE-Australasia student design competition. This competition involves designing, building and racing a formula-style racecar. UWAM is inefficient at transferring experience and technical knowledge from competent members such as current Team Leads to new members.

This project aims to build and test a Failure, Reporting, Analysis and Corrective Action System (FRACAS) for UWAM.

This system will serve as an element of a greater knowledge management and transfer system, allowing current and future members to see records of past failures and how they were dealt with. Our intention is that this knowledge capture system can improve UWAM's scheduling, budgeting, management, vehicle testing, and the focus of future design efforts.

A requirements documents has been developed as part of a BPhil 2nd year project. The clients are Erwin Bauernschmitt from UWAM and Prof Melinda Hodkiewicz
