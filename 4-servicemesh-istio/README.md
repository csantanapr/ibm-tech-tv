# Demo to show Kubernetes Microservices

## Setup
- Download [skaffold](https://skaffold.dev/)
- Configure Docker Desktop
- Configure Kubernetes/OpenShift cluster CLI access
- Install and Configure OpenShift ServiceMesh Operator

## Secrets
Create secret with Watson Visual Recognition and Cloud Object Storage s3 hmac credentials
```
cp k8s/secrets.yaml.template secrets.yaml
```
Edit and enter your credentials into `secrets.yaml`


## Change directory
```
cd 4-servicemesh-istio/
```

## Checkout slow and not intrumented app
```
git checkout slow-app
skaffold dev
```

## Checkout the fixed fast app and instrumented
```
git checkout master
skaffold dev
```


## Run
```bash
skaffold dev
```

## Deploy
```bash
skaffold run
```
