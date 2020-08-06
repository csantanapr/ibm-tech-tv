# Demo-1

This is Demo-2 updated to run from Container

Build Container Image
```
docker build -t csantanapr/ibm-tech-tv .
```

Setup Visual Recognition Credentials
```
cp .env.example .env
```

Create and Run Container
```
docker run --rm -p 8080:8080 --env-file .env -e NODE_ENV=development csantanapr/ibm-tech-tv
```

Do local development including node debugger
```
docker run --rm \
-p 8080:8080 \
-p 9229:9229 \
--env-file .env \
-e NODE_ENV=development \
-v $PWD:/user-app \
csantanapr/ibm-tech-tv \
npm run debug
```

## Changes from 0-servers
- Add `.dockerignore`
- Add `Dockerfile`
- Add health probe
- Remove rate limiting
- Remove https redirect
- Add json logging with pino-http library
    - Remove custom error handling and console errors.
