// Module dependencies
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const formatters = {
    level(label, number) {
        return { level: label }
    }
}

const pino = require('pino-http')({
    prettyPrint: isProduction ? false : true,
    level: isProduction ? 'error' : 'info',
    formatters: formatters,
    messageKey: 'message'
})

module.exports = function newsApp (app) {

  app.use(bodyParser.json({ limit: '10mb' }))

  app.use(express.static(path.join(__dirname, '..', 'build')))

  app.get('/health', (req, res) => {
    res.json({ status: 'UP' })
  })

  app.use(pino)
}
