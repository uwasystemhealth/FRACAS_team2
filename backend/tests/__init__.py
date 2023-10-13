import os, sqlite3

# Set default database to tests/test.db
basedir = os.path.abspath(os.path.dirname(__file__))
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(basedir, "test.db")


# Ensure the database is clear initially (teardown may not occur if program crashes)

db = sqlite3.connect("tests/test.db")

# Note: The table deletion order is important (token_blacklist, user_record, record, subsystem, team, user)
# Deleting in the wrong order violates foreign key constraints
db.execute("DELETE FROM token_blacklist")
db.execute("DELETE FROM user_record")
db.execute("DELETE FROM record")
db.execute("DELETE FROM subsystem")
db.execute("DELETE FROM team")
db.execute("DELETE FROM user")

db.commit()
db.close()