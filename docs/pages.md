# DBMeister Pages Documentation

---

## Landing

<blockquote>

The highest level page.tsx, located in '@/app'

Default page user will land on.

Contains info about the website, contains links to login and signup pages, the GitHub repo and these docs, as well as a guest diagram page.

</blockquote>

## Login

<blockquote>

Page that allows a user to log into the website. 

The user submits their username and password. If the information is correct, they are assigned a json web token which allows them to remain idle in the website for 1 hour before being sent back to the login page.

Displays an example Reactflow canvas to show the website's functionality on the left half of the screen.

</blockquote>

## Register

<blockquote>

Page that allows a user to register an account with the website.

The user submits their basic information in the registration form, including first and last names, username, password, and email. When registering, they will be sent an email to verify their account, after which they are logged in. 

A user's email undergoes thorough validation to ensure that it is a valid email. The email undergoes a regex formatting check, a domain check, and a final check using an outside API provided by MailboxValidator.

</blockquote>

## VerifyAccount

<blockquote>

This page is for a user to verify their account through their email.

After registering their account, a user is sent a verification email. After clicking the link, the user is brought to this page.

The page contains a button which will verify the user's account. Afterwards, the page can be closed and the user can log in.

</blockquote>

## Dashboard

<blockquote>

## Diagrams

<blockquote>

Page that shows a users personal diagrams, located in '@/app/dashboard/diagrams'

Server Side Rendered

Allows users to navigate to diagrams, edit diagram info, and delete diagrams.

Imports diagramCard.tsx and diagramDialog from '@/app/components/(dashDiagram)' to handle functionality.

Will, upon render, fetch /getDashDiagrams to get all of the current users diagrams.

</blockquote>

## Groups

<blockquote>

Part of the dashboard. A page that shows a users groups as well as incoming invites. Located in '@/app/dashboard/groups'

Allows user to navigate to groups, and accept or decline incoming invitations.

Will, upon render, fetch /getDashGroups to get all information concerning the users groups.

</blockquote>

## Groups/[id]

<blockquote>

A page that shows an invdividual group. Located in '@/app/dashboard/groups[id]'

Contains multiple tabs for users.

Non-admins will see a diagrams tab, an invite tab, and people tab. Admins will see these, and a management tab.

The diagrams tab will let users create and access diagrams shared among the group, the invite tab will allow users to invite others to the group, the people tab will allow users to see who is in the group and give admins the option to promote or kick people, and the management tab will allow admins to change group details, or to delete a group entirely.

</blockquote>

## ProjectEditor

<blockquote>

Page for editing projects. Includes a taskbar at the top, a Components Pane on the left, a Properties Pane on the right, and a ReactFlow canvas in the center of the page.

Users can add nodes to the canvas via the Components Pane. Pressing on a Component adds it to the center of the canvas. 
When clicking on a node, it is selected, and its properties are displayed in the Properties Pane. From here, users can edit the name, change the position and edit the data of the node.
In the Reactflow canvas, users can move nodes around, and connect nodes with lines, called edges. These show the relationship between two nodes.

</blockquote>