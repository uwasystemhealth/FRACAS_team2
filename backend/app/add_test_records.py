# Better FRACAS
# Copyright (C) 2023  Peter Tanner, Insan Basrewan
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from app import app, db
from app.models.record import Record, Subsystem

import datetime

def add_test_records(commit=True):
    with app.app_context():

        # List of subsystems
        subsystem_list = [
            Subsystem(name = "PDM"),
            Subsystem(name = "Battery Pack"),
            Subsystem(name = "Transmission"),
            Subsystem(name = "Front Wing"),
            Subsystem(name = "Rear Suspension")
        ]

        # List of test records
        record_list = [
            Record(
                subsystem_name="PDM", 
                title = "LV PDM buck converter failure",
                description = "The LV PDM buck converter on '22 (Flo) failed whist driving.",
                impact = "The pump for cooling the motor lost power, cannot test drive the car until fixed. Delaying vehicle testing and driver training. Lengthy troubleshooting/repair is diverting time from designing and manufacturing the 2023 car.",
                cause = "Overheating of the inductor due to high current",
                mechanism = "Dielectric breakdown",
                corrective_action_plan = "Replace broken inductor with a new lower-resistance inductor and validate reduced operating temperature with bench testing under expected load.",
                time_of_failure = datetime.datetime(2023,8,9,14,30,0),
                created_at = datetime.datetime(2023,8,9,21,31,0),
                modified_at = datetime.datetime(2023,8,9,21,31,0),
                car_year = 2022,
                creator_id = 2

            ),
        
            Record(
                subsystem_name="Battery Pack", 
                title = "HV battery pack voltage drop",
                description = "While conducting a high-speed test run, the HV battery pack voltage experienced a significant drop, triggering a power loss in '22 (Flo).",
                impact = "The sudden power loss resulted in a loss of vehicle control, leading to an off-track incident. Driver was unharmed but car sustained minor damage. This incident has interrupted our testing schedule and requires immediate attention.",
                cause = "Voltage sag caused by a faulty cell in the HV battery pack.",
                mechanism = "Cell degradation and internal resistance increase.",
                corrective_action_plan = "Perform thorough inspection of the HV battery pack to identify the faulty cell, replace the  cell and conduct extensive bench testing to ensure the stability of the battery pack under load.",
                time_of_failure = datetime.datetime(2023,8,9,16,45,0),
                created_at = datetime.datetime(2023,8,10,9,30,0),
                modified_at = datetime.datetime(2023,8,10,9,30,0),
                car_year = 2022,
                creator_id = 2
            ),
        
            Record(
                subsystem_name="Transmission",
                title = "Gearbox gear tooth fracture",
                description = "During a practice session for '22 (Flo), a gearbox gear tooth fractured while shifting gears under load.",
                impact = "The gearbox failure resulted in a loss of power transmission and forced the driver to retire from the session prematurely. This incident has raised concerns about the gearbox's reliability and performance.",
                cause = "Excessive stress on the gear teeth due to aggressive shifting and high torque loads.",
                mechanism = "Fatigue crack initiation and propagation.",
                corrective_action_plan = "Conduct a detailed analysis of the failed gear tooth and identify any potential design or manufacturing defects. Replace any damaged gearbox parts. Perform rigorous bench testing and simulation to validate the gearbox's improved reliability.",
                time_of_failure = datetime.datetime(2023,8,15,10,15,0),
                created_at = datetime.datetime(2023,8,15,13,45,0),
                modified_at = datetime.datetime(2023,8,15,13,45,0),
                car_year = 2022,
                creator_id = 6

            
            ),
        
            Record(
                subsystem_name="Front Wing",
                title = "Front wing delamination",
                description = "During a high-speed run, the front wing of '22 (Flo) experienced delamination, leading to a loss of aerodynamic performance.",
                impact = "The front wing delamination caused a significant reduction in downforce, affecting the car's stability and cornering capabilities. It also increased lap times during testing and impacted the team's performance.",
                cause = "Excessive aerodynamic loads and vibrations during high-speed testing.",
                mechanism = "Layers of the front wing separated due to stress and vibration.",
                corrective_action_plan = "Assess the damaged front wing, repair any salvageable sections, and replace the delaminated portions. Reinforce the front wing structure to withstand higher aerodynamic loads and conduct wind tunnel testing to validate its performance before the next race.",
                time_of_failure = datetime.datetime(2023,8,22,13,0,0),
                created_at = datetime.datetime(2023,8,22,16,0,0),
                modified_at = datetime.datetime(2023,8,22,16,0,0),
                car_year = 2022,
                creator_id = 7
            
            ),
        
            Record(
                subsystem_name="Rear Suspension",
                title = "Rear suspension bushing failure", 
                description = "While negotiating a tight corner during practice, '22 (Flo) experienced a rear suspension bushing failure.",
                impact = "The rear suspension failure compromised vehicle stability, making it challenging for the driver to control the car during cornering. This incident disrupted the testing schedule and raised concerns about the suspension system's durability.",
                cause = "Excessive lateral forces during cornering, leading to bushing fatigue.",
                mechanism = "Progressive deformation and eventual rupture of the suspension bushing.",
                corrective_action_plan = "Replace damaged bushings and inspect  suspension system for any signs of wear or fatigue. Enhance suspension geometry and implement a revised setup to improve handling and reduce stress on the bushings.",
                time_of_failure = datetime.datetime(2023,8,30,11,45,0),
                created_at = datetime.datetime(2023,8,30,13,30,0),
                modified_at = datetime.datetime(2023,8,30,13,30,0),
                car_year = 2022,
                creator_id = 8
            
            )
        ]

        # Add subsystems
        for subsystem in subsystem_list:
            db.session.add(subsystem)
        
        # Add failure records
        for record in record_list:
            db.session.add(record)


        db.session.commit()








