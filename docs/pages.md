# DBMeister Pages Documentation

---

## Landing

<blockquote>

The highest level page.tsx, located in '@/app'

Default page user will land on.

Contains info about the website, contains links to login and signup pages, the GitHub repo and these docs, as well as a guest diagram page.

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

</blockquote>