# Demo-1

This is Demo-2 updated to run from Container

Build Container Image
```
docker build -t csantanapr/ibm-tech-tv-storage .
```

Setup Cloud Object Storage Credentials
```
cp .env.example .env
```

Create and Run Container
```
docker run --rm -p 8080:8080 --env-file .env -e NODE_ENV=development csantanapr/ibm-tech-tv-storage
```

Do local development including node debugger
```
docker run --rm \
-p 8080:8080 \
-p 9229:9229 \
--env-file .env \
-e NODE_ENV=development \
-v $PWD:/user-app \
csantanapr/ibm-tech-tv-storage \
npm run debug
```

## Changes from 1-containers
- Remove API `/api/classify`
- Add API `/api/storage`
- Update frontend html to use `/api/storage`

