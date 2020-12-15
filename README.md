<div align="center">
  <h1>World Texting Foundation API</h1>
  <p>Handle acronyms requests with this simple REST API.</p>
</div>

## Production ready
### Docker compose
This REST API comes with an integrated ```docker-compose.yml``` file. To run production server just execute the following command:

```docker-compose up```

This will set up a network and attach a MongoDB image and the server API and it will run on port ```3000```.

### Production command
```npm start``` runs production command, which runs tests, cleans up code, and builds a ```dist-server``` directory to start the production server.

## Development
### Pre-requisites
  - MongoDB: to run in development mode, make sure you have MongoDB installed and running in your local machine on port ```27017```. You can change your MongoDB database url by setting up an environment variable ```MONGO_CONNECTION_URL``` with the following structure: ```MONGO_CONNECTION_URL=mongodb://localhost:27017```, in which you can change the port number if running Mongo on another port.
  - Node.js: v.12.13.1 and up
  - npm: v.6.13.6 and up

### Install dependencies
Run ```npm install``` to download and install dependencies.

### Run dev server
To run the development server, execute this command at your terminal: ```npm run watch:dev```.
This will run ```nodemon``` and will listen to changes in your code to auto-restart the development server.

## Initialize database
Independently if running via Docker or locally, you should first set up the database with the default collection ```acronyms```, which will include all base acronyms found at ```server/db/insertions/data.js```.

To do so, after the server is up and running, perform a ```POST``` request to ```http://localhost:3000/acronym/initialize-list```. This route will insert initial data into database.

## API endpoints
- ```GET /acronym?from=50&limit=10&search=:search```
  - returns a list of acronyms, paginated using query parameters
  - response headers indicate if there are more results via ```total-count``` and ```X-Total-Count``` headers
  - returns all acronyms that fuzzy match against `:search`
- ```GET /acronym/:acronym```
  - returns the acronym and definition matching `:acronym`
- ```GET /random/:count?```
  - returns `:count` random acronyms
  - the acronyms returned are not adjacent rows from the data
- ```POST /acronym```
  - receives an acronym and definition strings via body params ```acronym``` and ```definition```
  - adds the acronym definition to the db
- ```PUT /acronym/:acronym```
  - receives an acronym and definition strings via request param ```acronym``` and body param ```definition```
  - uses an authorization header to ensure acronyms are protected ```Authorization Bearer token```
  - updates the acronym definition to the db for `:acronym`
- ```DELETE /acronym/:acronym```
  - deletes `:acronym`
  - uses an authorization header to ensure acronyms are protected ```Authorization Bearer token```
- ```POST /acronym/initialize-list```
  - initializes database with base acronym data

## ES6 support
Supports ES6 code using Babel to transpile code.

## Project structure
Folder ```/server``` contains main server files.
Routes are located at ```/server/routes```, providers for routes are located at ```/server/providers``` and ```/server/db/providers``` for interacting with MongoDB database.

Test files are located inside the ```/tests``` folder at each route/provider directory (just some simple tests are included).

## MongoDB config
MongoDB client configuration and db/collection constants are located at ```/server/db```
