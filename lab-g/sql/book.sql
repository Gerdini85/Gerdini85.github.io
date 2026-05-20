CREATE TABLE book
(
    id INTEGER NOT NULL
        CONSTRAINT book_pk PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    release_date TEXT
);