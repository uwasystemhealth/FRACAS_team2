# Meeting Minutes 4 august 1:45

### Present: Insan, Peter, Nicholas, Haoyuan, Igor, Harsha

Meeting started 13:45\
Meeting ended 15:15

## 1 Admin Matters

Discuss team leader and admin duties

2nd teams chat created for client communications

Insan handling sprint 1 timesheet

Peter: Mostly Backend, slight react

Nicholas: Data warehousing, Frontend CSS Haoyuan: DataStructures, C, Web Design

Igor: Backend

Harsha: Frontend, Backend

Insan: Mostly Backend,

Web application agreed

Harsha:

Deciding Flask

## 2 Prototyping

Insan: Proposing flask backend + react frontend. Do we have enough skill to do this? Everyone who hasn't done react before and is assigned to frontend, try react over the weekend and come to a decision next week.

Harsha: Document database for only failure reports - advantage of being flexible to change, add new fields, etc. MongoDB. For MongoDB connect directly to flask application.\
Use RDBMS for user entries (sqlalchemy)

Insan: RDBMS with JSON for the failure reports to keep it unstructured. Would be easier.

Peter: Filtered search would have issues with this implementation.

Harsha: For retrieval of data, could do plaintext search for now.

Peter: Can't do parametric search with this.

Nicholas: Team dashboard - how to display stats

Insan: Can just present stats like time between failures. Tags.

Peter: Tags - goes through report text and puts it in hidden field to speed up indexing

Insan: Pick out keywords - for now ignore tags system. Sprint 3. For sprint 1: login system, page where user can write failure reports, and reports they have done. only can see their own failure reports or all failure reports (no search for now).

Harsha: sunk cost with react later in project type thing.

## 3 Sprint 1 goals

- Login
- 1. New data entry page
- 2. View all reports
- Database schema

## Action items

| Responsible                                   | Action                                                           | Due date    |
| --------------------------------------------- | ---------------------------------------------------------------- | ----------- |
| Haoyuan, Harsha, Nicholas, Igor in particular | Research react, make decision on whether to do react or html+css | Next monday |
| Nicholas                                      | Creating report page prototype                                   | Next friday |
| Igor                                          | Login backend and page **basic** HTML                            | Next friday |
| Insan                                         | Database schema (for prototype only), get a base                 | Next monday |
| Peter                                         | Email prototype, setup smtp                                      | Next monday |
| Insan                                         | Setup github projects                                            | Next friday |
