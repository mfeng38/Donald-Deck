-- All SQL commands to create the tables for the Database will be documented here for future reference --
/* --------------------------------------------------------------------------------------------------- */

/* Create Users table */

CREATE TABLE Users(
    username TEXT UNIQUE PRIMARY KEY,
    password TEXT,
    credits INTEGER
);

/* Create Rooms table (do in iteration 2/3)*/