// security.js
const helmet = require('helmet')

module.exports = function secureApp (app) {
  app.use(helmet())
}
