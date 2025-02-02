# DBMeister Components Documentation

# (authComponents)

All components for the user's account registration and login.

## loginCanvas

<blockquote>

A small Reactflow canvas to showcase the functionality of the website. Contains three nodes, saying "Welcome To DBMeister!"

</blockquote>

## loginForm

<blockquote>

This form allows the user to log into the website.

It asks for the user's username and password. If the user is registered and their account verified, they will be redirected to the dashboard.

The form also contains a link to the account registration page if they do not have an account.

</blockquote>

## registerForm

<blockquote>

This form allows the user to register an account with the website.

The user is asked for their first name, last name, username, password, and email. They then press the "Register Account" button to submit their registration within the database. A verification email is then sent to the email the user provided.

There exist checks to make sure the user has a successful registration:
1. The user is asked to confirm their password by typing it twice to mitigate forgetfulness and mistypes.
2. The user's email goes through a regex format confirmation and an email validation check using an outside API to validate that the email is real and in use.

</blockquote>

# (dashDiagram)

All components for the dashboard/diagram page.

<blockquote>

## diagramCard

<blockquote>

SSR Component

Props: { diagramData } : any, diagramData is a json object with all of a single diagrams details

Will create a card that shows an overview of the diagram, also contains buttons to go to the diagram, edit the details of the diagram, and destroy the diagram.

</blockquote>

## diagramDialog

<blockquote>

CSR Component

Props: { ownerId } : string, ownerId is the id of the person opening the dialog component

This component appears as a button that says "Create Diagram". Once clicked, a window will open prompting the user to create a diagram with the name and description. Once submitted, fetch requests are made to /makeDiagram to create the diagram, and the page is refreshed.

</blockquote>

# (projectEditor)

All components for the projectEditor page

## componentsPane

<blockquote>

SSR Component

Props: { createNode, createSQLTableNode } : functions, these functions handle the creation of different Node Types

This component is to handle the creation of nodes in the Reactflow canvas. Clicking on an element in the pane will create a node in the canvas at the center of the screen.

The pane contains three tabs: Tables, Icons, and Shapes. The tables tab will contain every different type of table structure, with relevant fields, such as a SQL table with the field name, type, key type, uniqueness, etc. The Icons tab will contain icons of outside applications, to represent them within data flows. The shapes field will contain several shapes which can be customized by the user, to represent anything not already available in the components pane.

</blockquote>

## propertiesPane

<blockquote>

CSR Component

Props: { selectedNode, setSelectedNodePosition, setSelectedNodeData, deleteSelectedNode }: {Node, function(Position), function(nodeData: NodeTypes), function(selectedNodeID)}

selectedNode: the node last clicked by the user. The Properties Pane displays its data and allows its manipulation
setSelectedNodePosition: parent function. Takes the edited position data and changes it in both this component and the Reactflow canvas.
setSelectedNodeData: parent function. Takes the selectedNode's data and allows manipulation, both in this component and the canvas.
deleteSelectedNode: parent function. Takes the selectedNode's id and deletes it from the canvas

This component displays all aspects of the selectedNode, which is the last node clicked by the user. It also allows the manipulation of the node, including its name, data, and styling. The selectedNode can also be delete from this component.

The styling of this component is an Accordion selection menu for easy readability.

</blockquote>

# (xyflow)

Contains all custom node types for the Reactflow (xyflow) canvas.

## sqlTable

<blockquote>

Custom Reactflow node type that represents a SQL Table.

Allows the user to name the table, and add or delete as many fields as they like. Each field contains options to edit the field name, type, if it can be null, uniqueness of entries, if it is a key and what type, checks, indexing, and any comments.

Each field then has two connection, a target and source, on either side of the field. These are used to show relationships with other tables or outside applications by row, for greater visibility of how the data connects across streams.

</blockquote>