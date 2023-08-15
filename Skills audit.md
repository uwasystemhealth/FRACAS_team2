# Skills and resources Audit

## Purpose

This skills and resources audit is intended to ensure the team has the technical and interpersonal skills required to complete the FRACAS project, and to create a plan to address any skill deficiencies.

## Required skills for this project

The team is intending to develop a web application to meet the requirements. In particular, the following high-level skills are required to complete the project:

| Skill                                                            | Justification                                                                                                                                      | Identifier                |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Experience in designing responsive webpages (Mobile and desktop) | Must be accessible from mobile and desktop                                                                                                         | SR02                      |
| Database design                                                  | Users and failure reports are stored in database. Must be able to design a database so that it is efficiently queried, minimizing redundancy, etc. | FR03,FR04,FR06,FR10,FR11. |
| Hosting                                                          | System needs to be hosted for the client to test                                                                                                   |
| Experience with a backend framework                              | Required to provide the business logic, interfacing frontend with database. Must be able to handle many users concurrently.                        |
| Testing                                                          | Agile methodology is being used, acceptance tests should be turned into proper tests. Good practice either way.                                    |
| Teamwork and leadership                                          | Need to distribute and manage tasks efficiently to deliver project on time and without compromising scope or budget.                               |

## Self-identified skills

These are skills members identified about themselves at a meeting. The raw data is in the appendix.

### Backend skills

| Team member | Backend skills or [relevant experience]                    | Backend skills gap | Self rating [1,5] |
| ----------- | ---------------------------------------------------------- | ------------------ | ----------------- |
| Haoyuan     | Databases                                                  | Mongo DB           | 4                 |
| Igor        | Flask, backend page logic                                  | /                  | 4                 |
| Harsha      | Backend experience from Agile web                          | Mongo DB           | 4                 |
| Insan       | Flask, database logic, backend logic, hosting, email, VPS  | Mongo DB           | 4                 |
| Nicholas    | Frontend flask, data warehousing                           | /                  | 3                 |
| Peter       | Flask, Django, Google/OAuth2 authentication, SQLite, email | Mongo DB           | 5                 |

### Frontend skills

| Team member | Frontend skills or [relevant experience]                                      | Frontend skills gap               | Self rating [1,5] |
| ----------- | ----------------------------------------------------------------------------- | --------------------------------- | ----------------- |
| Haoyuan     | /                                                                             | /                                 | 2                 |
| Igor        | /                                                                             | /                                 | 3                 |
| Harsha      | HTML, Advanced CSS (Transitions/animations), Frontend logic, [Portfolio site] | React, UX design                  | 4                 |
| Insan       | HTML, CSS                                                                     | React, UX design                  | 3                 |
| Nicholas    | [Created a live dashboard]                                                    | React                             | 4                 |
| Peter       | React, TailwindCSS, MaterialUI, HTML, basic CSS                               | UX design, making stuff look good | 3                 |

### Teamwork skills

| Team member | Management experience                                                                   | Team member experience                                                       | Self rating [1,5] |
| ----------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------- |
| Haoyuan     | /                                                                                       | skiing competition planning program                                          | 4                 |
| Igor        | /                                                                                       | Uni group projects                                                           | 3                 |
| Harsha      | /                                                                                       | Volunteered at a charity food distribution NGO.                              | 3                 |
| Insan       | Team leader at a face-to-face marketing agency, organised a charity twitch stream event | /                                                                            | 3                 |
| Nicholas    | /                                                                                       | Worked in a team for tech startup                                            | 3                 |
| Peter       | Avionics (Electronic engineering) team lead at UWA Aerospace (1y)                       | Volunteered for CfC, member at UWA Aerospace, experience from being employed | 3                 |

### Testing and other theory

| Team member | Testing skills | Testing skills gap | Programming and theory         | Programming and theory gap |
| ----------- | -------------- | ------------------ | ------------------------------ | -------------------------- |
| Peter       | Selenium       | Writing good tests | Python, Javascript, Typescript | /                          |
| Haoyuan     | /              | /                  | Data structures and analysis   | Python                     |
| Igor        | /              | Testing            | Python, Agile web process      | /                          |
| Harsha      | /              | /                  | Python, Javascript             | /                          |
| Insan       | /              | /                  | Python                         | /                          |
| Nicholas    | /              | /                  | Python                         | /                          |

## Skills review

This team should be strong at backend work, particularly using the Flask backend framework, given most of the team have taken the agile web development unit. While some members have used other backend frameworks such as Django, the team is planning to use Flask to take advantage of these skills.

Most of the team have been exposed to relational databases, either through the agile web development or databases units, however experience in graph or document databases is lacking - these paradigms might be useful for the type of data being managed and analyzed. The team is planning to propose SQLite as the database to handle both the user authentication and the failure reports. However, it would be worthwhile to dedicate some resources to learning about other database systems such as MongoDB, which is a document database, or postgresql which has JSON as a first-class-citizen, since with the agile strategy the team must be flexible with the client. Haoyuan has already begun learning about MongoDB.

The team as a whole is less strong at frontend development in comparison to backend, as shown by the self-ratings. Many members have done some frontend development, but it is clear that there is a skills gap in developing responsive UIs and UX design principles/developing intuitive user interfaces. Harsha is the most knowledgeable in UX design principles in the team, as demonstrated on his personal site. Insan has expressed interest in using React as the frontend framework, as there are benefits such as having access to a large selection of pre-made components, which can reduce development time. However, most of the team is not well-versed in React and only Peter has had React experience in the past. The team has decided to take the risk of using React in the hopes it will save time later, however this is a large risk. Several members are addressing this skills gap by developing basic demos/apps.

Testing is a major skills gap in the team. Peter has used testing frameworks such as Selenium before, although for webscraping instead of testing. Igor has been tasked with making tests, although it is likely another team member will need to be assigned to this role. The team should dedicate some time to learn about Cypress studio or Selenium IDE to speed up creating frontend tests. Backend testing is another element, although some members have had experience with backend testing in Flask. This skill should be developed before ~Week 7, to account for delays.

Insan has had experience hosting web applications on his VPS, which will be valuable.

Finally, while all members have had experience in a team, few have had experiences as leaders. There isn't much way to develop leadership skills other than just doing it. While the lecture content may be useful for developing these skills, it would probably be simpler to put team members in the leadership position and having the members with leadership experience provide mentorship. This is a risk which needs to be managed, however since poor leadership will lead to delays.

## Required resources

Not many resources are required for this project, since we plan to use free and open source tools and frameworks to save on cost and to avoid licensing issues.

| Resource       | Justification                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Hosting or VPS | The application must be hosted for the clients to try out. Continued hosting will be required for UWAM to make use of the application. |
| Domain name    | Required to fulfil PR02 streamlined workflow, since memorizing an IP address adds friction to using the application.                   |
| Git server     | Required for development, used by auditors as evidence to check the team's culture.                                                    |

## Available resources

The clients have stated we have access to funds for hosting, and we potentially have access to the UWA Motorsport domain. However, the cost of this application should cost less than than existing FRACAS software over a 10 year period (SR01). Providers of FRACAS software such as Relyence do not publicly provide pricing, however a generous $20 per month budget should be adequate. As an aside, the cost savings of our FRACAS system should increase with the amount of users, since commercial options use per-seat licensing.

Insan has access to credits on his VPS which we can use to demonstrate the application through the development process. Towards the end of the project we expect to communicate with the UWAM webmaster to either set up hosting on site, which would reduce hosting costs, or set up a VPS. A basic VPS on DigitalOcean costs $6 USD per month and has 25 G of SSD space, 1 G of RAM and 1 virtual CPU core, which should be more than adequate for a small organization like UWAM.

During development we do not plan to use a domain name, but for production we will try to use the UWAM domain name, which should further save costs. Optionally, we can use a custom domain name. This will add about $1 to $2 per month in renewal fees for a reasonably priced domain.

We will use the GitHub service for a git server since it does not cost anything to use.

## Conclusion

The team believes they have the necessary technical resources available to complete the project. The team is strong in backend development, however it is worth learning about new databases in case the client wants more flexibility. The team is less strong in frontend development and UX design, and a large risk is being taken by choosing React framework, however this can pay off and save time. All members of the team have already had experiences on other teams, but not many have had leadership opportunities - mentoring can help reduce this skills gap.

## Appendix

### Raw skills data

| Team member | Skills                                                                                                                       | Skill gap                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Peter       | Flask, Jango, Javascript, python, react, tailwind, material UI, Auth2 authentication, backend (sqlite), flask testing, email | UX design, Mongo DB        |
| Haoyuan     | Database (, data structures, C language, algorithms, data analysis                                                           | Mongo DB                   |
| Igor        | Flask, python, agile web, backend page logic                                                                                 | Testing                    |
| Harsha      | Frontend, Agile web backend, portfolio, html/css and javascript. Frontend Logic.                                             | React, Mongo DB, UX design |
| Insan       | Flask, backend, database logic, backend logic, hosting, email. VPS.                                                          | React, Mongo DB, UX design |
| Nicholas    | Frontend flask, data warehousing                                                                                             | React                      |

### Statements:

Insan:

> Team leader at a face-to-face marketing agency
>
> Organised a charity twitch stream event
>
> 3 - frontend
>
> 4 - backend
>
> 3 - teamwork

Harsha:

> Volunteered at a charity food distribution NGO.
>
> 4 - frontend
>
> 4 - backend
>
> 3 - teamwork

Haoyuan:

> team member of skiing competition planning program
>
> 2 - frontend
>
> 4 - backend
>
> 4 - teamwork

Igor:

> No relevant experience (outside of uni group projects)
>
> 3 - frontend
>
> 4 - backend
>
> 3 - teamwork

Nicholas:

> Worked in a team to establish live dashboard for a tech start up
>
> 4 - frontend
>
> 3 - backend
>
> 3 - teamwork
