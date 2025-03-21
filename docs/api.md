# DBMeister API Documentation

---

# /destroyDiagram

<blockquote>

Method(s): POST

Body: { id }

Returns: json object { response: string }
response = "Deletion Successful" if deleted
response = "Deletion Error" otherwise

</blockquote>

# /editDiagram

<blockquote>

Method(s): POST

Body: { id, name, description }
Will edit diagram of id to save new name and description

Returns: json object { response: string }
response = "Edit Successful" if edited
response = "Edit Error" otherwise

</blockquote>

# /login

<blockquote>

Method(s): POST

Body: { username, password }

Returns: json object {response: string, token: string}
response = "accepted" if login is successful
token will contain a JWT token if login is successful, otherwise, token will not be part of the json object

If a server error occurs, will return: json object {error: string}

</blockquote>

# /getDashDiagrams

<blockquote>

Method(s): POST

Body: { id }

Returns: json object {response: string, data: (json object)}
response = "Fetched Diagrams" if successfully fetched diagrams, data = all diagrams where the ownerId = id
response = "Failed to Fetch Diagrams" if fetch fails

</blockquote>

# /getDashGroups

<blockquote>

Method(s): POST

Body: { id }

Returns: json object {response: string, data: (json object)}
response = "Fetched Groups", data = all groups where id is a member
response = "Failed to Fetch Groups" if fetch fails

</blockquote>

# /makeDiagram

<blockquote>

Method(s): POST

Body: { ownerId, name, description }

Returns: json object { response: string }
response = "Creation Successful" if diagrams were inserted into the database
response = "Creation Error" otherwise

Will create entry in both diagrams and user_owns table with body parameters.

</blockquote>

# /makeGroup

<blockquote>

Method(s): POST

Body: { ownerId, name, description }

Returns: json object { response: string }
response = "Creation Successful" if the group was inserted into the database
response = "Creation Error" otherwise

Will create entry in both group and user_group table with body parameters.

</blockquote>

# /register

<blockquote>

Method(s): POST

Body: { firstName, lastName, username, password, email}

Returns: json object { response: string }
response = error response, if email validation fails
response = "Please provide a valid email address.", if email validation fails, but because the email does not exist
response = "There was an error sending your verification email.", if verification email does not send
response = "A verification email has been sent to the address you provided.", if verification email is sent
response = "An unexpected error has occurred. Please try again later.", if there is an unexpected error

Will register the user's information into database and send a verification email

</blockquote>

# /verifyAccount

<blockquote>

Method(s): POST

Body: { verificationToken }

Returns: json object { response: string }
response = "Email verified successfully!", if the verification is successful
response = "Invalid token.", if the token is not valid.
response = "An unexpected error has occurred. Please try again later.", if an unexpected error occurs

</blockquote>