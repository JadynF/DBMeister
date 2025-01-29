# DBMeister Components Documentation

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

<blockquote>

</blockquote>