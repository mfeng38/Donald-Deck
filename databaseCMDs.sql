-- All SQL commands to create the tables for the Database will be documented here for future reference --
/* --------------------------------------------------------------------------------------------------- */

/* Create Users table */

CREATE TABLE users(
    username TEXT UNIQUE PRIMARY KEY,
    password TEXT,
    credits INTEGER,
    rebuys INTEGER DEFAULT 0, (check that with one on david's branch)
    roomID TEXT (made by: ALTER TABLE users ADD COLUMN roomID TEXT;)
);

/* Table for User cards while playing --> should we put credits here, or is it better to access two tables*/
CREATE TABLE games(
	tablenum ???
	username TEXT,
	credits INTEGER, 
	currhand TEXT
);