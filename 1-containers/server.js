#! /usr/bin/env node

require('dotenv').config({ silent: true })

const app = require('./app')

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

module.exports = server
