# Better FRACAS
# Copyright (C) 2023  Peter Tanner
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

MESSAGES = {
    "REGISTRATION_MAIL": {
        "SUBJECT": "Welcome to Better FRACAS!",
        "BODY": """An administrator has invited you to Better FRACAS.
To sign up, click the following link or paste it in your browser:
{}

This registration was requested from the IP address {}""",
    },
    "RECOVERY_MAIL": {
        "SUBJECT": "Better FRACAS password reset request",
        "BODY": """Someone has requested a reset of your Better FRACAS password.
If you did not request this reset, do not do anything.
Do not share the link with anyone else.
To set a new password, click the following link or paste it in your browser:
{}

This reset was requested from the IP address {}""",
    },
}
