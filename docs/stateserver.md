# DBMeister State Server Documentation

---

## The socket server controls the sessions of users connected to a diagram.

---

# Endpoints

<blockquote>

## disconnect

Shares same logic as leave-room. Will handle a user leaving a room, clean up tracked states and users if needed.

No parameters needed.

</blockquote>

<blockquote>

## join-diagram

Allows a user to join the session for the specified diagram. Upon join, the server will emmit a receive-user-update to everyone in the session, and a receive-state-update to the joined user.

If no other user has joined the diagram, the state will be retrieved from the database and stored in the server's memory. The memory version will act as the live state for connected users. Will also store connected users in memory

Parameters:
diagramId: String ID of the diagram
userData: json object of the users information

</blockquote>

<blockquote>

## leave-room

Allows a user to leave the joined room. Will trigger a receive-user-update.

Parameters:
diagramId: String ID of the diagram

</blockquote>

<blockquote>

## send-saved-update

Allows a user to update the saved status of the diagram to true. Will trigger a receive-state-update.

Parameters: 
diagramId: String ID of the diagram

</blockquote>

<blockquote>

## send-node-update

Allows a user to update a single node in the managed state in the server. Will trigger a receive-state-update.

Parameters:
diagramId: String ID of the diagram
data: json object of the node change

</blockquote>

<blockquote>

## send-state-update

Allows a user to update the managed state in the server with an entire upload. Will trigger a receive-state-update.

Parameters:
diagramId: String ID of the diagram
data: json object of the diagram state

</blockquote>

# Broadcasts

<blockquote>

## receive-state-update

Will emit the state and saved status of the diagram to everyone connected to its room.

Returned:
recState: json object of the diagramState
saved: boolean indicating saved status

</blockquote>

<blockquote>

## receive-user-update

Will emit the users connected to the same room, to everyone in the room.

Returned: list of connected user json objects

</blockquote>

