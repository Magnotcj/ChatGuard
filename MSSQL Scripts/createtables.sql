CREATE TABLE CHAT (
    id INT PRIMARY KEY IDENTITY(1,1)
);

CREATE TABLE MESSAGE (
    id INT PRIMARY KEY IDENTITY(1,1),
    text VARCHAR(255),
    time DATETIME
);

CREATE TABLE PERSON (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) -- Increased length for better security
);

CREATE TABLE MESSAGEBOARD (
    id INT PRIMARY KEY IDENTITY(1,1),
    header_message_id INT,
    FOREIGN KEY (header_message_id) REFERENCES MESSAGE(id)
);

CREATE TABLE userpartofchat (
    chat_id INT,
    user_username VARCHAR(50),
    PRIMARY KEY (chat_id, user_username),
    FOREIGN KEY (chat_id) REFERENCES CHAT(id),
    FOREIGN KEY (user_username) REFERENCES PERSON(username)
);

CREATE TABLE chatcontainsmessage (
    message_id INT,
    chat_id INT,
    PRIMARY KEY (message_id, chat_id),
    FOREIGN KEY (message_id) REFERENCES MESSAGE(id),
    FOREIGN KEY (chat_id) REFERENCES CHAT(id)
);

CREATE TABLE usersentmessage (
    message_id INT,
    user_username VARCHAR(50),
    PRIMARY KEY (message_id, user_username),
    FOREIGN KEY (message_id) REFERENCES MESSAGE(id),
    FOREIGN KEY (user_username) REFERENCES PERSON(username)
);

CREATE TABLE messageboardhasmessage (
    message_id INT,
    messageboard_id INT,
    PRIMARY KEY (message_id, messageboard_id), -- Fixed the incorrect column reference
    FOREIGN KEY (message_id) REFERENCES MESSAGE(id),
    FOREIGN KEY (messageboard_id) REFERENCES MESSAGEBOARD(id)
);

CREATE TABLE Report (
    id INT PRIMARY KEY IDENTITY(1,1),
    time datetime,
    message_id INT,
    reporter VARCHAR(50),
    report_text VARCHAR(255),
    FOREIGN KEY (reporter) REFERENCES PERSON(username) ON DELETE CASCADE
);


CREATE TABLE ReportResponse (
    id INT,
    report_id INT,
    text VARCHAR(255),
    time DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (report_id) REFERENCES Report(id) ON DELETE CASCADE
);

CREATE TABLE Subscription (
    subscription_type INT,
	renewal_date datetime,
    user_username VARCHAR(50),
    FOREIGN KEY (user_username) REFERENCES PERSON(username)
);

CREATE TABLE user_session (
    username VARCHAR(50) NOT NULL PRIMARY KEY REFERENCES Person(username),
    expires_at DATETIME NOT NULL
);