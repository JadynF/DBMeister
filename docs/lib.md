# DBMeister /lib Methods Documentation

---

# authorization

<blockquote>

## Server-side-rendered

## authorization.authorization() : Promise<{ authorized: boolean, userData: unknown }>

<blockquote>

Description: Will get the clients 'token' cookie, and attempt to authorize it. 

Return: 

If no token exists, or if the token fails to authorize, the client will be redirected to /login, and { authorized: false, userData: null } will be returned

If the token is successfully authorized, userData will be extracted from the token, and { authorized: true, userData: userData }, with userData being a json object

</blockquote>

## authProjectEditor.authProject(userId : string, diagramId : string) : Promise<{ authorized: boolean }>

<blockquote>

Description: Will check if the user is authorized to see the current diagram.

Return:

If they are authorized, {authorized : true} will be returned.

If not, {authorized : false} will be returned, and they will be redirected to the dashboard.

</blockquote>

</blockquote>