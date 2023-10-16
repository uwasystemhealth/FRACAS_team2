# UWAM FRACAS Documentation

## Features and Page Functionality

### Sign Up Process

For users without a pre-existing account, admins of the domain will need to navigate to the admin interface to enter the new user's details, including email, which will automatically send the user an email containing a sign-up link. This link takes them to the "Sign In" page where the user needs to enter the email where they received the link and a password of their choosing. Once validation checks have been passed, a new user account is generated and given general member-level access.

### Log In Page

Visiting "www.example.com" will bring the user to the "Sign In" page. For pre-existing users, they will need to enter their respective email and password combination. Once credentials have been validated, access is granted to the FRACAS domain with levels of access associated with their account.

### Password Reset

The Password Reset feature enables users to regain access to their account in the case they have forgotten their password.

1. At the "Sign In" page, users can initiate the password reset process by clicking the "Forgot Password" option after inputting their account email.
2. To ensure the security of the process, users receive an email containing a unique verification link. This link is used to confirm their identity and proceed with resetting the password.
3. Users are directed to a secure form where they can enter a new password. Upon submitting, the form will be validated to check password strength requirements and confirm password fields.
4. After successful verification, the user's password is updated to the new one provided.

### Admin Functions

As an administrator of the system, you will have access to functions that allow you to manage users and teams efficiently. These functions are crucial for maintaining the functionality of the application.

#### Assigning Team Lead

The two roles available for assignment to members are "general" or "team leader." Each team requires at least one leader. Admins can easily assign or modify the roles of other users from the "Admin Dashboard" page. Each existing member in the system can be found here with a column "Is team leader?" next to their name. Admins can simply change this value to "yes" or "no" to enable or disable team leader permissions.

#### Managing UWAM Members

The member list is a comprehensive directory of all the users within the system, located within the "Admin Dashboard." An admin can view the member's name, email, and role. Admin users also have the ability to remove existing members through this table.

#### Managing Teams

The teams list is a table within the Admin Dashboard, keeping track of all the existing teams and their respective team leader. From here, admin users are able to allocate a UWAM member to a team or remove them if needed.

#### Delete Failure Report

Admin users have permissions that allow them to delete failure reports in the system. This action can be done in the "Record List" page by clicking the "delete" icon. The record will still be stored in the database for auditing purposes; however, it will be flagged as deleted and not visible from the frontend of the application.

### Team Lead Functions

As a Team Lead, you have distinct responsibilities aimed at overseeing the quality of failure reports and ensuring that they are properly assigned to the relevant member. Here are the key functions Team Leads perform:

#### Record Validation

Team Leads have the role of validating failure reports submitted by team members. This validation process helps ensure that each report is complete and adheres to UWAM's FRACAS specified guidelines and standards. It is a 3-step validation process, with each section of the failure report (report, analysis, corrective action plan) needing to be verified separately. A checkbox is available for selection in each section if the report meets said standards. Once all sections of the record have been validated by the team lead, it is flagged in the system for all members to see as "validated."

#### Assigning Record Owner

By default, the creator of the record will be assigned owner. However, team leaders have the ability to reassign a report to another member. This can be done after the fact of the report being created, or if it is the team leader themselves creating the report, there will be a drop-down visible which allows for report owner assignment.

## FRACAS Pages

### Dashboard

The dashboard is a personalized page that provides users with a quick, at-a-glance view of essential information. It serves as a hub to monitor and manage the failure reports in the system that are relevant to them, as well as give users insight into how UWAM is tracking with reports as a whole.

#### Report Overview

- **What elements are displayed:** Users can see a pie chart that provides a summarized view of the open reports in the system, broken down by the team they belong to. A table containing the failure reports the user has bookmarked is available, with important details of the respective report visible, such as title, creation date, and status. The "Your Reports" table consists of failure reports the current user has created.

#### Direct Access to Reports

Users can access reports directly from the Dashboard page. Upon selecting a report stored in either the "Bookmarked" or "Your Reports" table, the user will be navigated to a complete view of the respective report.

### Creating Report Page

The "Create Report" page is the central part of the FRACAS application where users can submit detailed information about a failure report. Creating a report can be navigated to from the sidebar, visible on every page, by selecting the pencil icon. The key functionalities and features of this page include:

1. Autofilled Fields:

To expedite the process of creating a new failure report, the fields of Creation Date (time when pressed submit), Team (member's assigned team by default), Car year (current year), Creator name & email (current logged-in user) are all automatically filled. These fields, however, can still be manually edited if the user wishes to make any changes.

2. Manually Filled Fields:

Not all information can be autofilled, as many details depend on the specific failure event. Users are required to provide manual input for these fields. Fields such as "Title," "Subsystem," and "Description" will need to be manually completed by the user, allowing for a more comprehensive breakdown of the failure. This also goes for the Analysis and Corrective Action Plan sections of the report, which will require the user to complete from scratch.

3. Save Incomplete Records:

Users can save incomplete records, allowing them to work on a report over multiple sessions or collaborate with other team members. If a user is unable to complete the record at once, they can use the submit button to save the incomplete report. This will store the report in the "Your Reports" table of their personal dashboard, as well as the "Report List" page. The report can then be reaccessed at a later date to fulfill the remaining fields.

### Editing a Record

**Process Overview**:

1. Select the Chosen Record: To initiate the editing process, users must first select the record they wish to modify. This can be done through the "Record List" or "Dashboard."
2. Once a record is selected, users are directed to the "Create Report" page, with the existing record's fields pre-filled, where they can make changes to the report's details.
3. After making the necessary edits, users can save their modifications. Upon clicking submit, the edits are saved immediately, and the results will be reflected for all users in the system.

### Record View

The Record View has the central purpose of viewing and interacting with a submitted failure report. This page is reached by selecting to view a report either on the "Record List" page or the Dashboard.

#### Key Features

- **Adding Comments:**

Users can submit comments to a report, discussing observations, recommendations, or any relevant additional information they wish to add. A bar is present at the bottom of the page where a user can type their message and send, storing the time-stamped dialogue for other users to see.

- **Bookmark Functionality:**

Users can bookmark the specific report if they view it as important or noteworthy to create an easy way to access the respective report in the future. Clicking the bookmark icon in the top right-hand side of the page will send that report directly to the Bookmarked Reports table in the user's Dashboard. If the report has previously been bookmarked and the user wishes to remove it, they can do so simply by clicking the bookmark icon again.

- **Print Reports:**

When viewing a report, using the command "ctrl + p" will generate a print-friendly version of the report, without compromising any of the information detailed in the report.

### Record List

The "Record List" page is a comprehensive repository of all failure reports within the system. It acts as a central hub for accessing, organizing, and managing these reports effectively. Users can efficiently search, filter, and sort the records to find the information they need. From here, users can select an individual report to view or edit using the icon buttons found at the end of the table in the report's corresponding row. The records table dynamically updates, providing users with the latest and most up-to-date failure report information.

