const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3')
const path = require('path')
const express = require('express')
const app = express()
const fs = require('fs')
const uuid = require('uuid')
const os = require('os')
const swaggerJSDoc = require('swagger-jsdoc');


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
  resource.data = Buffer.from(matches[2], 'base64')
  return resource
}

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
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

  /**
   * @swagger
   *
   * /api/classify:
   *   post:
   *     summary: Submit Image to Detect Objects
   *     operationId: classify
   *     parameters:
   *       - in: "body"
   *         name: "image_data"
   *         description: "Image to detect objects base64"
   *         required: true
   *     schema:
   *       type: string
   *     consumes:
   *       - "application/json"
   *     produces:
   *       - "application/json"
   *     responses:
   *       '200':
   *         description: Detect Objects in a submitted Image
   */
app.post('/api/classify', async (req, res, next) => {
  if (!req.body.image_data) {
    return next(new Error('image_data missing'))
  }

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
    const response = await watson.classify(classifyParams)
    res.json(response)
  } catch (err) {
    next(err)
  }
})

module.exports = app
