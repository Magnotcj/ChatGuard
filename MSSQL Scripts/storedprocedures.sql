CREATE OR ALTER PROCEDURE [getPassHash]
(
    @Username varchar(20)
)
AS
BEGIN
    if @Username is null or @Username = ''
    BEGIN
        Print 'Username cannot be null or empty.';
        RETURN(1)
    END
    if @PasswordHash is null or @PasswordHash = ''
    BEGIN
        Print 'PasswordHash cannot be null or empty.';
        RETURN(2)
    END
    if not exists (SELECT * FROM [User] WHERE Username = @Username)
    BEGIN  
        PRINT 'ERROR: User does not exist.';
        RETURN(3)
    END

	SELECT *
	FROM [User]
	WHERE Username = @Username
    
    RETURN(0)
END

CREATE OR ALTER PROCEDURE [createUser](
	@Username varchar(20),
	@PasswordHash varchar(20)
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

	INSERT INTO [User](Username, PasswordHash)
	VALUES (@Username, @PasswordHash)

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [getMessages](
	@chatId int
)
AS
Begin
	if @chatId is null
	BEGIN
		Print 'Username cannot be null';
		RETURN (1)
	END

	SELECT messages
    FROM Chat
    WHERE chatId = @chatId

	RETURN(0)
End

CREATE OR ALTER PROCEDURE [getChats](
	@userId int
)
AS
Begin
	if @userId is null
	BEGIN
		Print 'User ID cannot be null';
		RETURN (1)
	END

	SELECT chats
    FROM User
    WHERE userId = @userId

	RETURN(0)
End