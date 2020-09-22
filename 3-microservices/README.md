# Demo to show Kubernetes Microservices

## Setup
- Download [skaffold](https://skaffold.dev/)
- Configure Docker Desktop
- Configure Kubernetes/OpenShift cluster CLI access

## Secrets
Create secret with Watson Visual Recognition credentials
```
WATSON_VISION_COMBINED_APIKEY=<COPY-YOUR-API-KEY-HERE>
WATSON_VISION_COMBINED_URL=https://api.us-south.visual-recognition.watson.cloud.ibm.com/instances/<INSTANCE ID>
```
```
kubectl create secret generic watson \
--from-literal=WATSON_VISION_COMBINED_APIKEY=$WATSON_VISION_COMBINED_APIKEY \
--from-literal=WATSON_VISION_COMBINED_URL=$WATSON_VISION_COMBINED_URL
```

Create secret with Cloud Object Storage s3 hmac credentials
```
CLOUD_OBJECT_STORAGE_BUCKETNAME=<ENTER-YOUR-BUCKET-NAME-HERE>
CLOUD_OBJECT_STORAGE_APIKEY=<COPY-YOUR-API-KEY-HERE>
CLOUD_OBJECT_STORAGE_HMAC_ACCESS_KEY_ID=<KEY>
CLOUD_OBJECT_STORAGE_HMAC_SECRET_ACCESS_KEY=<SECRET>
CLOUD_OBJECT_STORAGE_ENDPOINTS=https://control.cloud-object-storage.cloud.ibm.com/v2/endpoints
```

```
kubectl create secret generic cos \
--from-literal=CLOUD_OBJECT_STORAGE_BUCKETNAME=$CLOUD_OBJECT_STORAGE_BUCKETNAME \
--from-literal=CLOUD_OBJECT_STORAGE_APIKEY=$CLOUD_OBJECT_STORAGE_APIKEY \
--from-literal=CLOUD_OBJECT_STORAGE_HMAC_ACCESS_KEY_ID=$CLOUD_OBJECT_STORAGE_HMAC_ACCESS_KEY_ID \
--from-literal=CLOUD_OBJECT_STORAGE_HMAC_SECRET_ACCESS_KEY=$CLOUD_OBJECT_STORAGE_HMAC_SECRET_ACCESS_KEY \
--from-literal=CLOUD_OBJECT_STORAGE_ENDPOINTS=$CLOUD_OBJECT_STORAGE_ENDPOINTS
```

## Change directory
```
cd 4-observability/
```

## Run
```bash
skaffold dev
```

## Deploy
```bash
skaffold run
```
