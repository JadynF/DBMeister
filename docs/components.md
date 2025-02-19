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

Props: { createNode }

createNode: parent function to create a node in the canvas. Can be used to create any type of node (basic, icon, sqlTable, excelTable).

This component is to handle the creation of nodes in the Reactflow canvas. Clicking on an element in the pane will create a node in the canvas at the center of the screen.

The pane contains three tabs: Tables, Icons, and Shapes. The tables tab contains every different type of table structure, with relevant fields, such as a SQL table with the field name, type, key type, uniqueness, etc. The Icons tab contains icons of outside applications, such as ETL and Visualization applications. The shapes field will contain several shapes which can be customized by the user, to represent anything not already available in the components pane.

</blockquote>

## nodePropertiesPane

<blockquote>

CSR Component

Props: { selectedNode, selectedStatus, setSelectedNodePosition, setSelectedNodeData, deleteSelectedNode }: {Node, function(Position), function(nodeData: NodeTypes), function(selectedNodeID)}

selectedNode: the node last clicked by the user. The Properties Pane displays its data and allows its manipulation
selectedStatus: boolean on whether a node is currently selected
setSelectedNodePosition: parent function. Takes the edited position data and changes it in both this component and the Reactflow canvas.
setSelectedNodeData: parent function. Takes the selectedNode's data and allows manipulation, both in this component and the canvas.
deleteSelectedNode: parent function. Takes the selectedNode's id and deletes it from the canvas

This component displays all aspects of the selectedNode, which is the last node clicked by the user. It also allows the manipulation of the node, including its name, data, and styling. The selectedNode can also be delete from this component.

The styling of this component is an Accordion selection menu for easy readability.

</blockquote>

## edgePropertiesPane

<blockquote>

CSR Component

Props: { selectedEdge, selectedStatus, deleteSelectedEdge, animateEdge }

selectedEdge: the edge last clicked by the user. This pane displays the settings of the edge and allows manipulation
selectedStatus: determines if an edge is currently selected or not
deleteSelectedEdge: parent function that deletes the selected edge
animateEdge: parent function which switches whether an edge is solid or a dashed line

This component is similar in the purpose of the nodePropertiesPane, but handles edges.

</blockquote>

# (xyflow)

Contains all custom node types for the Reactflow (xyflow) canvas.

## iconNode

<blockquote>

Custom Reactflow node which represents a particular outside application which can access data.

Includes a logo for each application and a label. The label can be edited in the nodePropertiesPane. This allows visibility on how outside applications can access data from databases or files.

Includes one source and one target handle.

</blockquote>

## sqlTable

<blockquote>

Custom Reactflow node type that represents a SQL Table.

Allows the user to name the table, and add or delete as many fields as they like. Each field contains options to edit the field name, type, if it can be null, uniqueness of entries, if it is a key and what type, checks, indexing, and any comments.

Each field then has two connection, a target and source, on either side of the field. These are used to show relationships with other tables or outside applications by row, for greater visibility of how the data connects across streams.

</blockquote>

## excelTable

<blockquote>

Custom Reactflow node type that represents an Excel Table.

Allows the user to name, position, and manipulate the data of the node in any way they wish. The node is green for better recognition as an Excel table.

The structure of the table are as follows:
Table: The entirety of an Excel file.
Sheet: A single Excel sheet. A table can have any number of sheets.
Field: A single Excel field (or column). A sheet can have any number of fields within it. Each field has a name, format, validation, sort-order, and comments associated with it.

A target handle is attached to each sheet, as the most modular a program can write to excel is a sheet. However, a source handle is attached to each individual field for greater dataflow visibility.

</blockquote>