#! /usr/bin/env node

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config({ silent: true })

const app = require('./app')

const port = process.env.PORT || 3000


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    // API informations (required)
    title: 'Vision App', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Submit Picture to Classify', // Description (optional)
  }
};
// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./app.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

module.exports = server
