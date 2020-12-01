# Demo to show Kubernetes Microservices

## Setup
- Download [skaffold](https://skaffold.dev/)
- Configure Docker Desktop
- Configure Kubernetes/OpenShift cluster CLI access
- Install and Configure OpenShift ServiceMesh Operator
- Create a service instance for Cloud Objects Storage (free plan), bucket, and HMAC credentials
- Create a service instance for Watson Vision Recogntion (free plan), and credentials

## Secrets

### Cloud Obect Storage (cos) Secrets
Copy the env template
```
cp a-cloud-storage/.env.template a-cloud-storage/.env
```
Edit the file `a-cloud-storage/.env` with the credentials from the IBM Cloud CLI or UI Console

Create secret with Cloud Object Storage s3 hmac credentials
```
oc create secret generic cos --from-env-file=a-cloud-storage/.env
```

### Watson Vision Secrets
Copy the env template
```
cp b-watson-vision/.env.template b-watson-vision/.env
```
Edit the file `b-watson-vision/.env` with the credentials from the IBM Cloud CLI or UI Console

Create secret with Watson Visual Recognition credentials
```
oc create secret generic watson --from-env-file=b-watson-vision/.env
```

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
