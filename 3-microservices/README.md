# Demo to show Kubernetes Microservices

## Setup
- Download [skaffold](https://skaffold.dev/)
- Configure Docker Desktop
- Configure Kubernetes/OpenShift cluster CLI access

## Secrets
Create secret with Watson Visual Recognition and Cloud Object Storage s3 hmac credentials
```
cp k8s/secrets.yaml.template secrets.yaml
```
Edit and enter your credentials into `secrets.yaml`

## Change directory
```
cd 3-microservices/
```

## Run
```bash
skaffold dev
```

## Deploy
```bash
skaffold run
```
