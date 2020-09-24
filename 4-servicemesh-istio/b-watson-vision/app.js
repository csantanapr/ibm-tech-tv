const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3')
const express = require('express')
const app = express()

require('./config/express')(app)

app.use(require('./config/tracing.js'))
const opentracing = require('opentracing')
const tracer = opentracing.globalTracer()

let watson
try {
  watson = new VisualRecognitionV3({
    // Remember to place the credentials in the .env file. Read the README.md file!
    version: '2019-03-27'
  })
} catch (err) {
  console.error('Error creating service client: ', err)
}

app.get('/', (req, res) => {
  res.send('watson visual recognition microservice,  -X POST /api/classify body={ url: https://example.com/image.jpg}')
})

app.post('/api/classify', async (req, res, next) => {
  if (!req.body.url) {
    return next(new Error('url missing'))
  }

  const model = req.body.model ? req.body.model : 'default'
  const classifyParams = {
    url: req.body.url,
    classifierIds: [model]
  }
  try {
    const span = tracer.startSpan('watson-call', { childOf: req.span })
    const response = await watson.classify(classifyParams)
    span.setTag('response', response)
    span.finish()
    processWatsonData(res, response, span)
  } catch (err) {
    next(err)
  }
})

function processWatsonData(res, response, parent){
  const span = tracer.startSpan('process-data', { childOf: parent })
  span.log({ event: 'process', message: 'simulate some process work with the data' })
  //FIXME: easter egg here
  setTimeout(function(){res.json(response); span.finish();},5000)
}

module.exports = app
