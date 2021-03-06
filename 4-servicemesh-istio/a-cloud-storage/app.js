const path = require('path')
const express = require('express')
const app = express()
const uuid = require('uuid')
const cos = require('./config/cloud-storage')
const classifyHost = process.env.CLASSIFY_DEFAULT_URL ? new URL(process.env.CLASSIFY_DEFAULT_URL).hostname : 'host.docker.internal'
const classifyDefaultPort = '8081'
const classifyPort = process.env.CLASSIFY_DEFAULT_URL ? new URL(process.env.CLASSIFY_DEFAULT_URL).port : classifyDefaultPort
const bent = require('bent')
const classify = bent(`http://${classifyHost}:${classifyPort}`, 'POST', 'json')
let s3

require('./config/express')(app)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/api/storage', async (req, res, next) => {
  try {
    const objectName = req.query.ext ? `${uuid.v4()}.${req.query.ext}` : uuid.v4()
    // FIXME: easter egg here
    //blockCpuFor(10000000)
    const putUrl = await getUrls('putObject', objectName)
    const getUrl = await getUrls('getObject', objectName)
    res.json({ putUrl: putUrl, getUrl: getUrl })
  } catch (err) {
    next(err)
  }
})

app.post('/api/classify', async (req, res, next) => {
  if (!req.body.url) {
    return next(new Error('url missing'))
  }
  const model = req.body.model || 'default'
  const classifyParams = {
    url: req.body.url,
    model: model
  }
  try {
    // FIXME: easter egg here
    const propaGate = true
    let response
    if (propaGate) {
      response = await classify('/api/classify', classifyParams, getTracingHeaders(req))
    } else {
      response = await classify('/api/classify', classifyParams)
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
})

function getTracingHeaders (req) {
  const contextHeaders = {}
  Object.keys(req.headers).forEach(function (key) {
    if (key.toLowerCase().startsWith('x-b3') ||
        key.toLowerCase() === 'x-request-id' ||
        key.toLowerCase() === 'b3' ||
        key.toLowerCase() === 'x-ot-span-context' ||
        key.toLowerCase() === 'user-agent') {
      contextHeaders[key] = req.headers[key]
    }
  })
  return contextHeaders
}

const getUrls = async (operation, fileName, expires) => {
  const expiresIn = expires || 60 * 15 // url expires in 15 mins if not specified.
  let response
  try {
    response = await s3.getSignedUrl(operation, {
      Bucket: s3.bucketName,
      Key: fileName,
      Expires: expiresIn
    })
  } catch (err) {
    console.error(err)
    throw err
  }
  return response
}

const main = async () => {
  s3 = await cos()
}
main()
module.exports = app
function blockCpuFor (count) {
  console.log('bussy work here :-)')
  let r
  while (count > 0) {
    r = Math.random() * Math.random()
    count--
  }
  console.log('done with bussy work', r)
}
