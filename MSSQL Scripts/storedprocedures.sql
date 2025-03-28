
CREATE OR ALTER PROCEDURE [getPassHash]
(
    @Username varchar(50)
)
AS
BEGIN
    if @Username is null or @Username = ''
    BEGIN
        Print 'Username cannot be null or empty.';
        RETURN(1)
    END
    if not exists (SELECT * FROM [User] WHERE Username = @Username)
    BEGIN  
        PRINT 'ERROR: User does not exist.';
        RETURN(2)
    END

	SELECT password
	FROM PERSON
	WHERE username = @Username
    
    RETURN(0)
END

CREATE OR ALTER PROCEDURE [createUser](
	@Username varchar(50),
	@PasswordHash varchar(255)
)
AS
Begin
	if @Username is null or @Username = ''
	BEGIN
		Print 'Username cannot be null or empty.';
		RETURN (1)
	END
	if @PasswordHash is null or @PasswordHash = ''
	BEGIN
		Print 'PasswordHash cannot be null or empty.';
		RETURN (2)
	END
	if exists (SELECT * FROM [User] WHERE Username = @Username)
	BEGIN
        PRINT 'ERROR: Username already exists.';
	    RETURN(3)
	END

	INSERT INTO Person(username, password)
	VALUES (@Username, @PasswordHash)

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [getMessages](
	@chat_id int
)
AS
Begin
	if @chat_id is null
	BEGIN
		Print 'char_id cannot be null';
		RETURN (1)
	END

	SELECT msg.text, msg.time, p.username
    FROM Chat as ch join chatcontainsmessage as ccm on ch.id = ccm.chat_id
		join MESSAGE as msg on ccm.message_id = msg.id
		join usersentmessage as usm on usm.message_id = msg.id
		join PERSON as p on usm.user_username = p.username
    WHERE ch.id = @chat_id

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [getChats](
	@username VARCHAR(50)
)
AS
Begin
	if @username is null
	BEGIN
		Print 'username cannot be null';
		RETURN (1)
	END

	SELECT *
    FROM PERSON user_p join userpartofchat as user_upc on user_p.username = user_upc.user_username
		join CHAT as ch on user_upc.chat_id = ch.id
		join userpartofchat as other_upc on ch.id = other_upc.chat_id
		join PERSON as other_p on other_upc.user_username = other_p.username
    WHERE user_p.username = @username

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [getChatMembers](
	@chat_id VARCHAR(50)
)
AS
Begin
	if @chat_id is null
	BEGIN
		Print 'chat_id cannot be null';
		RETURN (1)
	END

	SELECT user_username
    FROM userpartofchat
    WHERE chat_id = @chat_id

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [createChatPost](
	@username varchar(50),
	@chat_id int,
	@text varchar(255)
)
AS
Begin
	if not exists (SELECT * FROM PERSON WHERE username = @username)
	BEGIN
        PRINT 'User with username does not exist.';
	    RETURN(1)
	END
	if not exists (SELECT * FROM CHAT WHERE id = @chat_id)
	BEGIN
        PRINT 'Chat with chat_id does not exist.';
	    RETURN(2)
	END
	if @text is null or @text = ''
	BEGIN
		Print 'text cannot be null or empty.';
		RETURN (3)
	END

	INSERT INTO MESSAGE(text, time)
	VALUES (@text, GETDATE())

	INSERT INTO chatcontainsmessage(message_id, chat_id)
	VALUES (@@IDENTITY, @chat_id)

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [createChat]()
AS
Begin

	INSERT INTO [CHAT] DEFAULT VALUES

	RETURN(@@IDENTITY)
End

CREATE OR ALTER PROCEDURE [addChatMember](
	@username varchar(50),
	@chat_id int
)
AS
Begin
	if not exists (SELECT * FROM PERSON WHERE username = @username)
	BEGIN
        PRINT 'User with username does not exist.';
	    RETURN(1)
	END
	if not exists (SELECT * FROM CHAT WHERE id = @chat_id)
	BEGIN
        PRINT 'Chat with chat_id does not exist.';
	    RETURN(2)
	END

	INSERT INTO userpartofchat(chat_id, user_username)
	VALUES (@chat_id, @username)

	RETURN(0)
End