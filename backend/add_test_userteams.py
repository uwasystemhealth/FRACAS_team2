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
from app.models.authentication import User
from app.models.team import Team

password = "test"

def add_test_userteams():
    with app.app_context():
        # Superuser account
        admin = User(email="admin@test.com",name="Admin",superuser=True)
        admin.set_password_and_register(password)
        db.session.add(admin)
        db.session.commit()

        """
        userteam_populate = []
        Populates database with User & Teams

        FORMAT:
        [
        Team(name of team)
        User(this user will be assigned as team leader)

        User(regular members of team)
        (etc..)
        ],
        """
        userteam_populate = [

            [
                Team(name="Mercedes AMG"),
                User(email="wolff@test.com",name="Toto Wolff"),

                User(email="hamilton@test.com",name="Lewis Hamilton"),
                User(email="russell@test.com",name="George Russell"),
                User(email="schumacher@test.com",name="Mick Schumacher"),
            ],

            [
                Team(name="Red Bull racing"),
                User(email="horner@test.com",name="Christian Horner"),
                
                User(email="verstappen@test.com",name="Max Verstappen"),
                User(email="perez@test.com",name="Sergio Perez"),
                User(email="lawson@test.com",name="Liam Lawson"),
            ],
        ]


        for userteam in userteam_populate:
            team = userteam[0]
            leader = userteam[1]
            db.session.add(team)
            leader.set_password_and_register(password)
            db.session.add(leader)
            db.session.commit()

            db.session.refresh(team)
            db.session.refresh(leader)
            team.members.append(leader)
            db.session.commit()
            
            db.session.refresh(team)
            db.session.refresh(leader)
            team.leader = leader

            for i in range(2,len(userteam)):
                member = userteam[i]
                member.set_password_and_register(password)
                db.session.add(member)
                team.members.append(member)

            db.session.commit()










