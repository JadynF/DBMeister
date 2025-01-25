# DBMeister API Documentation

---

# /login

<blockquote>

Method(s): POST

Body: { username: string, password: string}

Returns: json object {response: string, token: string}
response = "accepted" if login is successful
token will contain a JWT token if login is successful, otherwise, token will not be part of the json object

If a server error occurs, will return: json object {error: string}

</blockquote>