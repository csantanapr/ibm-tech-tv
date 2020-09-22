const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3')
const express = require('express')
const app = express()

require('./config/express')(app)

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
    const response = await watson.classify(classifyParams)
    res.json(response)
  } catch (err) {
    next(err)
  }
})

module.exports = app
