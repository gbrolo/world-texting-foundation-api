<div align="center">
  <h1>World Texting Foundation API</h1>
  <p>Handle acronyms requests with this simple REST API.</p>
</div>

## ES6 support
Supports ES6 code.

## Project structure
Folder ```/server``` contains main server files.
Routes are located at ```/server/routes``` and providers for routes are located at ```/server/providers```.

Test files are located inside the ```/tests``` folder at each route/provider directory.

## Install
Run ```npm install``` to install dependencies.

## Development server
Run the development server with:

```
npm run watch:dev
```

This will initialize the ```watch:dev``` script and start a server at ```localhost:3000```.

## Production server
To run production, run:

```
npm start
```

This will run tests, build the server and serve contents built into ```dist-server```.