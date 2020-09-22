// Module dependencies
const bodyParser = require('body-parser')
const isProduction = process.env.NODE_ENV === 'production'
const formatters = {
  level (label, number) {
    return { level: label }
  }
}
const pino = require('pino-http')({
  prettyPrint: !isProduction,
  level: isProduction ? 'error' : 'info',
  formatters: formatters,
  messageKey: 'message'
})

module.exports = function newsApp (app) {
  app.use(bodyParser.json({ limit: '10mb' }))

  app.get('/health', (req, res) => {
    res.json({ status: 'UP' })
  })

  app.use(pino)
}
