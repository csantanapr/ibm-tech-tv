# Demo to show Kubernetes

## Setup
- Download [skaffold](https://skaffold.dev/)
- Configure Docker Desktop
- Configure Kubernetes/OpenShift cluster CLI access

## Secrets
Create secret with Watson Visual Recognition credentials
```
WATSON_VISION_COMBINED_APIKEY=<COPY-YOUR-API-KEY-HERE>
WATSON_VISION_COMBINED_URL=https://us-south.visual-recognition.watson.cloud.ibm.com
```
```
kubectl create secret generic watson --from-literal=WATSON_VISION_COMBINED_APIKEY=$WATSON_VISION_COMBINED_APIKEY --from-literal=WATSON_VISION_COMBINED_URL=$WATSON_VISION_COMBINED_URL
```

## Change directory
```
cd 2-kubernetes/
```

## Run
```bash
skaffold dev
```

## Debug
```
skaffold debug --port-forward
```
Then you can attach Node debugger like Chrome or VSCode on localhost:9229
