# DBMeister Installation and Usage Documentation

# Installation

<blockquote>
1. Clone the GitHub repo located at https://github.com/JadynF/DBMeister
2. cd into the /dbmeister directory
3. With Node.js installed, run `npm i`
4. cd into the server directory
5. Run `npm i`
</blockquote>

# Usage

<blockquote>

## Running with React

<blockquote>

1. cd into /dbmeister directory
2. Run `npm run start`
3. The React development server will start
4. Access the website on your web browser at localhost:8000

</blockquote>

## Running Statically

<blockquote>

1. cd into the /server directory
2. Run `node server.js`
3. The server will host the static resources in the /server/build directory
4. Access the website on your web browser at localhost:8000

### Updating Static Files to Run Statically

<blockquote>

1. cd into the /dbmeister directory
2. Run `npm run build`, and wait for a new folder in the /dbmeister/build directory to appear
3. Take the new build files and copy into the /server directory
4. The static files are now ready to be hosted

</blockquote>

</blockquote>

</blockquote>