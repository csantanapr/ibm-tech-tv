const IBMCOS = require('ibm-cos-sdk')
const bent = require('bent')

const CONFIG = {
  bucketName: process.env.CLOUD_OBJECT_STORAGE_BUCKETNAME,
  serviceCredential: {
    apikey: process.env.CLOUD_OBJECT_STORAGE_APIKEY,
    cos_hmac_keys: {
      access_key_id: process.env.CLOUD_OBJECT_STORAGE_HMAC_ACCESS_KEY_ID,
      secret_access_key: process.env.CLOUD_OBJECT_STORAGE_HMAC_SECRET_ACCESS_KEY
    },
    endpoints: process.env.CLOUD_OBJECT_STORAGE_ENDPOINTS
  }
}
const defaultEndpoint = process.env.CLOUD_OBJECT_STORAGE_DEFAULT_ENDPOINT || 's3.us.cloud-object-storage.appdomain.cloud'
const corsConfig = {
  CORSRules: [{
    AllowedHeaders: ['*'],
    AllowedMethods: ['PUT', 'GET'],
    AllowedOrigins: ['*']
  }]
}
const getS3Hmac = async (endpoint, serviceCredential) => {
  let s3Options

  if (serviceCredential.cos_hmac_keys && serviceCredential.cos_hmac_keys.access_key_id) {
    /*
          * Cloud Object Storage S3 can be access via two types of credentials. IAM/HMAC
          * An HMAC Credential is the equivalent of the AWS S3 credential type
          * The Access Key Id, Secret Access Key, and S3 Endpoint are needed to use HMAC.
          */
    s3Options = {
      accessKeyId: serviceCredential.cos_hmac_keys.access_key_id,
      secretAccessKey: serviceCredential.cos_hmac_keys.secret_access_key,
      region: 'ibm',
      endpoint: new IBMCOS.Endpoint(endpoint)
    }
  } else {
    throw new Error('HMAC credentials required to create S3 Client using HMAC')
  }
  return new IBMCOS.S3(s3Options)
}

/*
   * Cloud Object Storage is available in 3 resiliency across many Availability Zones across the world.
   * Each AZ will require a different endpoint to access the data in it.
   * The endpoints url provides a JSON consisting of all Endpoints for the user.
   */
const getEndpoints = async (endpointsUrl) => {
  const request = bent(endpointsUrl, 'GET', 'json')
  const response = await request()
  return response
}
/*
   * Once we have the available endpoints, we need to extract the endpoint we need to use.
   * This method uses the bucket's LocationConstraint to determine which endpoint to use.
   */
const findBucketEndpoint = (bucket, endpoints) => {
  const region = bucket.region || bucket.LocationConstraint.substring(0, bucket.LocationConstraint.lastIndexOf('-'))
  const serviceEndpoints = endpoints['service-endpoints']
  const regionUrls = serviceEndpoints['cross-region'][region] ||
                     serviceEndpoints.regional[region] ||
                     serviceEndpoints['single-site'][region]

  if (!regionUrls.public || Object.keys(regionUrls.public).length === 0) {
    return ''
  }
  return Object.values(regionUrls.public)[0]
}
/*
   * The listBucketsExtended S3 call will return a list of buckets along with the LocationConstraint.
   * This will help in identifing the endpoint that needs to be used for a given bucket.
   */
const listBuckets = async (s3, bucketName) => {
  const params = {
    Prefix: bucketName
  }
  const data = await s3.listBucketsExtended(params).promise()
  return data
}

const setupBucketCORS = async (s3, bucketName, corsConfig) => {
  const params = {
    Bucket: bucketName,
    CORSConfiguration: corsConfig
  }
  const data = await s3.putBucketCors(params).promise()
  return data
}

module.exports = async () => {
  try {
    /* Extract the serviceCredential and bucketName from the config.js file
       * The service credential can be created in the COS UI's Service Credential Pane
       */
    const { serviceCredential } = CONFIG
    const { bucketName } = CONFIG

    /* Create the S3 Client using the IBM-COS-SDK - https://www.npmjs.com/package/ibm-cos-sdk
       * We will use a default endpoint to initially find the bucket endpoint
       *
       * COS Operations can be done using an IAM APIKey or HMAC Credentials.
       * We will create the S3 client differently based on what we use.
       */
    const s3 = await getS3Hmac(defaultEndpoint, serviceCredential)

    /* Fetch the Extended bucket Info for the selected bucket.
       * This call will give us the bucket's Location
       */
    const data = await listBuckets(s3, bucketName)
    const bucket = data.Buckets[0]

    /* Fetch all the available endpoints in Cloud Object Storage
       * We need to find the correct endpoint to use based on our bucjket's location
       */
    const endpoints = await getEndpoints(serviceCredential.endpoints)

    /* Find the correct endpoint and set it to the S3 Client
       * We can skip these steps and directly assign the correct endpoint if we know it
       */
    s3.endpoint = findBucketEndpoint(bucket, endpoints)

    await setupBucketCORS(s3, bucketName, corsConfig)

    s3.bucketName = CONFIG.bucketName
    return s3
  } catch (err) {
    console.error('Found an error in S3 operations')
    console.error('statusCode: ', err.statusCode)
    console.error('message: ', err.message)
    console.error('stack: ', err.stack)
    process.exit(1)
  }
}
