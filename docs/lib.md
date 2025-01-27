# DBMeister /lib Methods Documentation

---

# authorization

<blockquote>

Server-side-rendered

authorization() : Promise<{ authorized: boolean, userData: unknown }>

<blockquote>

Description: Will get the clients 'token' cookie, and attempt to authorize it. 

Return: 

If no token exists, or if the token fails to authorize, the client will be redirected to /login, and { authorized: false, userData: null } will be returned

If the token is successfully authorized, userData will be extracted from the token, and { authorized: true, userData: userData }, with userData being a json object

</blockquote>

</blockquote>