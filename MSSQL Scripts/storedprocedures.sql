CREATE OR ALTER PROCEDURE DeletePersonByUsername
    @Username VARCHAR(50)
AS
BEGIN
    DELETE FROM Person
    WHERE username = @Username;
    IF @@ROWCOUNT = 0
    BEGIN
        PRINT 'No row found with the specified username.';
    END
    ELSE
    BEGIN
        PRINT 'Row successfully deleted.';
    END
END;

CREATE OR ALTER PROCEDURE [getMessageMaker](
	@msg_id int
)
AS
Begin
	if @msg_id is null
	BEGIN
		Print 'msg_id cannot be null';
		RETURN (1)
	END
SELECT user_username FROM usersentmessage as usm where usm.message_id = @msg_id
RETURN(0)
END


CREATE PROCEDURE [addReport](
	@reporter_username VARCHAR(50),
	@msg_id int
)
AS
Begin
	if @reporter_username is null
	BEGIN
		Print 'reporter_username cannot be null';
		RETURN (1)
	END

	if @msg_id is null
	BEGIN
		Print 'msg_id cannot be null';
		RETURN (1)
	END

	if @msg_id is null
	BEGIN
		Print 'msg_id cannot be null';
		RETURN (1)
	END
INSERT into Report(id, time, message_id, reporter)
VALUES (@@IDENTITY, GETDATE(), @msg_id, @reporter_username)
RETURN(0)
END

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

	SELECT msg.id as [id], msg.text as [text], msg.time as [time], p.username as [user]
    FROM Chat as ch join chatcontainsmessage as ccm on ch.id = ccm.chat_id
		join [MESSAGE] as msg on ccm.message_id = msg.id
		join usersentmessage as usm on usm.message_id = msg.id
		join PERSON as p on usm.user_username = p.username
    WHERE ch.id = @chat_id
	ORDER BY [time] ASC

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

CREATE OR ALTER PROCEDURE [getBoardMessages](
	@messageboard_id int
)
AS
Begin

	SELECT msg.id as [id], msg.text as [text], msg.time as [time], p.username as [user]
    FROM messageboardhasmessage as mbm 
		join [MESSAGE] as msg on mbm.message_id = msg.id
		join usersentmessage as usm on usm.message_id = msg.id
		join PERSON as p on usm.user_username = p.username
   	WHERE mbm.messageboard_id = @messageboard_id
	ORDER BY [time] ASC

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [createPublicPost](
	@username varchar(50),
	@text varchar(255)
)
AS
Begin
	if not exists (SELECT * FROM PERSON WHERE username = @username)
	BEGIN
        PRINT 'User with username does not exist.';
	    RETURN(1)
	END
	if @text is null or @text = ''
	BEGIN
		Print 'text cannot be null or empty.';
		RETURN (3)
	END

	INSERT INTO MESSAGE(text, time)
	VALUES (@text, GETDATE())

	DECLARE @msg_id int = @@IDENTITY

	INSERT INTO messageboardhasmessage(message_id)
	VALUES (@msg_id)

	INSERT INTO usersentmessage(message_id, user_username)
	VALUES (@msg_id, @username)

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [createMessageBoard](
	@username varchar(50),
	@text varchar(255)
)
AS
Begin
	if not exists (SELECT * FROM PERSON WHERE username = @username)
	BEGIN
        PRINT 'User with username does not exist.';
	    RETURN(1)
	END
	if @text is null or @text = ''
	BEGIN
		Print 'text cannot be null or empty.';
		RETURN (3)
	END

	INSERT INTO MESSAGE(text, time)
	VALUES (@text, GETDATE())

	DECLARE @msg_id int = @@IDENTITY

	INSERT INTO [MESSAGEBOARD](header_message_id)
	VALUES (@msg_id)

	INSERT INTO usersentmessage(message_id, user_username)
	VALUES (@msg_id, @username)

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [getMessageBoards]
AS
Begin

	SELECT mb.id as [id], msg.text as [text], msg.time as [time], usm.user_username as [user]
    FROM [MESSAGEBOARD] as mb 
		join [MESSAGE] as msg on mb.header_message_id = msg.id
		join usersentmessage as usm on usm.message_id = msg.id
   
	ORDER BY [time] DESC

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [getBoardHeader](
	@messageboard_id int
)
AS
Begin

	SELECT msg.id as [id], msg.text as [text], msg.time as [time], usm.user_username as [user]
    FROM [MESSAGEBOARD] as mb
		join [MESSAGE] as msg on mb.header_message_id = msg.id
		join usersentmessage as usm on msg.id = usm.message_id
	WHERE mb.id = @messageboard_id

	RETURN(0)
End

ALTER PROCEDURE [dbo].[AddPersonToSubscription]
    @SubscriptionType INT,
    @Username VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (
        SELECT 1 FROM PERSON WHERE username = @Username
    )
    BEGIN
        PRINT('User does not exist in PERSON table.');
        RETURN (2);
    END

    DECLARE @NewRenewalDate DATETIME;

    IF @SubscriptionType = 2
        SET @NewRenewalDate = DATEADD(MONTH, 1, GETDATE());
    ELSE IF @SubscriptionType = 1
        SET @NewRenewalDate = DATEADD(WEEK, 1, GETDATE());
	ELSE IF @SubscriptionType = 0
	BEGIN
		-- Set existing subscription to be cancelled
		UPDATE Subscription
        SET subscription_type = @SubscriptionType
        WHERE user_username = @Username;

		RETURN (0)
	END
    ELSE
    BEGIN
        PRINT('Invalid subscription type.');
        RETURN (3);
    END

    IF EXISTS (
        SELECT 1 FROM Subscription WHERE user_username = @Username
    )
    BEGIN
        -- update subscription
        UPDATE Subscription
        SET subscription_type = @SubscriptionType,
            renewal_date = @NewRenewalDate
        WHERE user_username = @Username;
    END
    ELSE
    BEGIN
        -- new subscription
        INSERT INTO Subscription (subscription_type, renewal_date, user_username)
        VALUES (@SubscriptionType, @NewRenewalDate, @Username);
    END
END;

CREATE OR ALTER PROCEDURE DeleteSessionByUsername
    @Username VARCHAR(50)
AS
BEGIN
    DELETE FROM user_session WHERE username = @username
    IF @@ROWCOUNT = 0
    BEGIN
        PRINT 'No row found with the specified username.';
    END
    ELSE
    BEGIN
        PRINT 'Row successfully deleted.';
    END
END;

CREATE OR ALTER PROCEDURE GetSessionById
    @id VARCHAR(255)
AS
BEGIN
    SELECT user_session.id, user_session.username, user_session.expires_at, Person.username
	FROM user_session INNER JOIN Person ON Person.username = user_session.username WHERE id = @id
END;

CREATE OR ALTER PROCEDURE UpdateSessionById
    @id VARCHAR(255),
	@new_expires DATETIME
AS
BEGIN
    UPDATE user_session SET expires_at = @new_expires WHERE id = @id
END;

CREATE OR ALTER PROCEDURE CreateSession
    @id VARCHAR(255),
	@username VARCHAR(50),
	@expires DATETIME
AS
BEGIN
    INSERT INTO user_session (id, username, expires_at) VALUES (@id, @username, @expires)
END;

CREATE PROCEDURE deleteExpiredAccounts AS
BEGIN
	DECLARE @user VARCHAR(50)

	DECLARE curs CURSOR FORWARD_ONLY
	FOR SELECT user_username
		FROM Subscription
		WHERE subscription_type = 0 AND renewal_date < GETDATE()

	OPEN curs
	FETCH NEXT FROM curs INTO @user
	WHILE @@FETCH_STATUS = 0 BEGIN
		EXEC DeletePersonByUsername @Username = @user
		FETCH NEXT FROM curs INTO @user
	END

	CLOSE curs
	DEALLOCATE curs
END;