# DBMeister /lib Methods Documentation

---

# authGroup

<blockquote>

## Server-side-rendered

## authGroup(userId : string, groupId : string) : Promise<[{ authorized: boolean }, data: any]>

<blockquote>

Description: Will check whether the current user is authorized to view the group.

Return:

If the user is authorized: authorized: true
data will also include all group data for the authorized group in index 1, as well as all groups that are owned by the group in index 2

Otherwise, authorized: false and the user will be redirected to /dashboard

</blockquote>

</blockquote>

# authorization

<blockquote>

## Server-side-rendered

## authorization() : Promise<{ authorized: boolean, userData: unknown }>

<blockquote>

Description: Will get the clients 'token' cookie, and attempt to authorize it. 

Return: 

If no token exists, or if the token fails to authorize, the client will be redirected to /login, and { authorized: false, userData: null } will be returned

If the token is successfully authorized, userData will be extracted from the token, and { authorized: true, userData: userData }, with userData being a json object

</blockquote>

</blockquote>

# authProjectEditor

<blockquote>

## authProject(userId : string, diagramId : string) : Promise<{ authorized: boolean }>

<blockquote>

Description: Will check if the user is authorized to see the current diagram.

Return:

If they are authorized, {authorized : true} will be returned.

If not, {authorized : false} will be returned, and they will be redirected to the dashboard.

</blockquote>

</blockquote>

# stateManager

<blockquote>

## saveProject(state : any, id : any) : Promise<{ saved : boolean }>

<blockquote>

Description: Will save the state of the canvas this currently shown.

Return:

If the state was successfully saved, { saved: true }

Otherwise, { saved : false }

</blockquote>


## getProject(id : any) : Promise<any> 

<blockquote>

Description: Will fetch the state of the diagram with given id.

Return:

JSON object with the state string, contains information on nodes and edges

</blockquote>

</blockquote>

# handleInvite

<blockquote>

## acceptInvite(userId : string, groupId : string) : Promise<{ accepted: boolean }>

<blockquote>

Description: Will accept the invitation, and join the user to the group. The invitation will also be deleted.

Returns: 

accepted: true if the invitation was successfully accepted
accepted: false otherwise

</blockquote>

## declineInvite(userId : string, groupId : string) : Promise<{ accepted: boolean }>

<blockquote>

Description: Will decline the invitation, and delete the invitation.

Returns:

declined: true if the invitation was successfully declined
declined: false otherwise

</blockquote>

</blockquote>

# userInvite

<blockquote>

## userInvite(userId : string, invitedUser : string, groupId : string) : Promise<{ invited: boolean, res: string }>

<blockquote>

Description: Will send an invitation to the invitedUser for the group.

Returns: json object

invited: true if the invitation was successfully sent

invited: false otherwise

res: "no user" if the user doesn't exist
res: "in group" if the user is already in the group

</blockquote>

</blockquote>