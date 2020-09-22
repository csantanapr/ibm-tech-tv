# Demo-1

This is Demo-2 updated to run from Container

Build Container Image
```
docker build -t csantanapr/ibm-tech-tv-vision .
```

Setup Visual Recognition Credentials
```
cp .env.example .env
```

Create and Run Container
```
docker run --rm -p 8081:8081 --env-file .env -e NODE_ENV=development csantanapr/ibm-tech-tv-vision
```

Do local development including node debugger
```
docker run --rm \
-p 8081:8081 \
-p 9229:9229 \
--env-file .env \
-e NODE_ENV=development \
-v $PWD:/user-app \
csantanapr/ibm-tech-tv-vision \
npm run debug
```

Test like this
```
curl -s -H "Content-Type: application/json" \
-d '{"url":"https://live.staticflickr.com/2316/2119982696_af6dbe1990_b.jpg", "model":"food"}' \
localhost:8080/api/classify \
 | jq '.result.images[0].classifiers[0].classes'
```

## Changes from 1-containers
- Change API instead of taking image as data take it as url
- Remove frontend html app, now this container only handles REST API

