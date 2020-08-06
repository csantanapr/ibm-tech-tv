const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3')
const path = require('path')
const express = require('express')
const app = express()
const fs = require('fs')
const uuid = require('uuid')
const os = require('os')

require('./config/express')(app)

/**
 * Parse a base 64 image and return the extension and buffer
 * @param  {String} imageString The image data as base65 string
 * @return {Object}             { type: String, data: Buffer }
 */
const parseBase64Image = (imageString) => {
  const matches = imageString.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/)
  const resource = {}
  if (matches.length !== 3) {
    return null
  }
  resource.type = matches[1] === 'jpeg' ? 'jpg' : matches[1]
  resource.data = new Buffer(matches[2], 'base64')
  return resource
}

let client
try {
  client = new VisualRecognitionV3({
    // Remember to place the credentials in the .env file. Read the README.md file!
    version: '2018-03-19'
  })
} catch (err) {
  console.error('Error creating service client: ', err)
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.post('/api/classify', async (req, res, next) => {
  const resource = parseBase64Image(req.body.image_data)
  const temp = path.join(os.tmpdir(), `${uuid.v4()}.${resource.type}`)
  fs.writeFileSync(temp, resource.data)
  const imageFile = fs.createReadStream(temp)

  const model = req.body.model ? req.body.model : 'default'
  const classifyParams = {
    imagesFile: imageFile,
    classifierIds: [model]
  }
  try {
    const response = await client.classify(classifyParams)
    res.json(response)
  } catch (err) {
    console.error(err)
    if (!client) {
      const error = {
        title: 'Invalid credentials',
        description:
          'Could not find valid credentials for the Visual Recognition service.',
        statusCode: 401
      }
      next(error)
    }
    next(err)
  }
})

// error-handler settings for all other routes
require('./config/error-handler')(app)

module.exports = app
