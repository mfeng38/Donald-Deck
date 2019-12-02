-- All SQL commands to create the tables for the Database will be documented here for future reference --
/* --------------------------------------------------------------------------------------------------- */

/* Create Users table */

CREATE TABLE users(
    username TEXT UNIQUE PRIMARY KEY,
    password TEXT,
    credits INTEGER,
    rebuys INTEGER DEFAULT 0
);

/* Create Rooms table (do in iteration 2/3)*/

/* Table for User cards while playing --> should we put credits here, or is it better to access two tables*/
-- CREATE TABLE games(
-- 	tablenum ???
-- 	username TEXT,
-- 	credits INTEGER, 
-- 	currhand TEXT
-- );

CREATE FUNCTION creditReset() RETURNS TRIGGER AS $$
BEGIN
    IF users.credits <= 0 THEN
        UPDATE users
        SET credits = 2000,
            rebuys = rebuys + 1
        WHERE credits <= 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creditResetTrigger
AFTER UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE creditReset();