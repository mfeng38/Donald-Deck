-- All SQL commands to create the tables for the Database will be documented here for future reference --
/* --------------------------------------------------------------------------------------------------- */

/* Create Users table */

CREATE TABLE users(
    username TEXT UNIQUE PRIMARY KEY,
    password TEXT,
    credits INTEGER,
    rebuys INTEGER
);

/* Create Rooms table (do in iteration 2/3)*/

/* Table for User cards while playing --> should we put credits here, or is it better to access two tables*/
CREATE TABLE games(
	tablenum ???
	username TEXT,
	credits INTEGER, 
	currhand TEXT
);