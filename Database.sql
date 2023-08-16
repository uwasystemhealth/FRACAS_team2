-- Users Table
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    is_admin INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Teams Table
CREATE TABLE teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- UserTeams Table
CREATE TABLE user_teams (
    user_id INTEGER,
    team_id INTEGER,
    is_leader INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

-- Failures Table
CREATE TABLE failures (
    failure_id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER,
    owner_id INTEGER,
    teamleader_id INTEGER,
    team_id INTEGER,
    failure_title TEXT,
    description TEXT,
    impact TEXT,
    cause TEXT,
    mechanism TEXT,
    corrective_action TEXT,
    subsystem TEXT,
    car_year INTEGER,
    due_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    failure_time DATETIME,
    time_resolved DATETIME,
    record_valid INTEGER,
    analysis_valid INTEGER,
    correction_valid INTEGER,
    is_reviewed INTEGER,
    FOREIGN KEY(creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(teamleader_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    failure_id INTEGER,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(failure_id) REFERENCES failures(failure_id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT NOT NULL,
    type TEXT,
    is_read INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bookmarks Table
CREATE TABLE bookmarks (
    user_id INTEGER,
    failure_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(failure_id) REFERENCES failures(failure_id) ON DELETE CASCADE
);

-- Learning Assignment Table
CREATE TABLE learning_assignment (
    user_id INTEGER,
    failure_id INTEGER,
    due_date DATE,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(failure_id) REFERENCES failures(failure_id) ON DELETE CASCADE
);
