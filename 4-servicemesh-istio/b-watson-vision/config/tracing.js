const serviceName = process.env.SERVICE_NAME || 'watson-vision.tech-tv'
// Initialize the Tracer
const tracer = initTracer(serviceName)
const opentracing = require('opentracing')

// to work with istio we need to handle b3/zipkin header format
const ZipkinB3TextMapCodec = require('jaeger-client').ZipkinB3TextMapCodec
let codec = new ZipkinB3TextMapCodec({ urlEncoding: true });
tracer.registerInjector(opentracing.FORMAT_HTTP_HEADERS, codec);
tracer.registerExtractor(opentracing.FORMAT_HTTP_HEADERS, codec);

opentracing.initGlobalTracer(tracer)

function initTracer(myserviceName) {
    const initJaegerTracer = require('jaeger-client').initTracerFromEnv

    // Sampler set to const 1 to capture every request, do not do this for production
    const config = {
      serviceName: myserviceName
    }
    // Only for DEV the sampler will report every span
    config.sampler = { type: 'const', param: 1 }

    return initJaegerTracer(config)
  }

  function tracingMiddleWare(req, res, next) {
    const wireCtx = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers)
    // Creating our span with context from incoming request
    //const span = tracer.startSpan(req.path, { childOf: wireCtx })
    const span = wireCtx;
    // include trace ID in headers so that we can debug slow requests we see in
    // the browser by looking up the trace ID found in response headers
    const responseHeaders = {}
    tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, responseHeaders)
    res.set(responseHeaders)
    // add the span to the request object for any other handler to use the span
    Object.assign(req, { span })
    next()
  }

module.exports = tracingMiddleWare