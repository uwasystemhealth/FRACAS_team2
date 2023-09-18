import os


user_input = input("Do you want to delete the database file app.db? (yes/no): ")

# Check if the user's input is affirmative
if user_input.lower() in ["yes", "y"]:
    try:
        # Attempt to remove the database file
        os.remove("app.db")
        print("The database file app.db has been deleted.")
    except OSError as e:
        print(f"Error: {e}")
    from app import db

    db.create_all()
else:
    print("Database file was not deleted.")
