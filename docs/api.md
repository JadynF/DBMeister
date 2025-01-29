# DBMeister API Documentation

---

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

# /makeDiagram

<blockquote>

Method(s): POST

Body: { ownerId, name, description }

Returns: json object { response: string }
respone = "Creation Successful" if diagrams were inserted into the database
response = "Creation Error" otherwise

Will create entry in both diagrams and user_owns table with body parameters.

</blockquote>