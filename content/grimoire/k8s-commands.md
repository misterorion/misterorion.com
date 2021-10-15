---
title: "Handy Kubernetes Commands"
excerpt: "My list"
tags: ["Kubernetes","GCP","Cloud"]
---


### Set current cluster

```sh
gcloud container clusters get-credentials <CLUSTER>
```

### Run command on remote container

```sh
kubectl exec --stdin --tty <POD> -c <COMMAND>
```

### Get CPU, memory use of all containers

```sh
kubectl top pod --containers --use-protocol-buffers
```
### Get CPU, memory use of all nodes

```sh
kubectl top node --use-protocol-buffers
```
### Create secret

```sh
kubectl create secret generic <SECRET_NAME> --from-literal=<key>=<value>
```

### Copy files from local machine to pod

Useful when backing up or restoring persistent volume claims.

```yaml
# copier.yaml

apiVersion: v1
kind: Pod
metadata:
  name: copier
spec:
  containers:
    - name: caddy
      image: caddy:alpine
      volumeMounts:
        - name: persistent-storage
          mountPath: /var/lib/ghost/content
  volumes:
    - name: persistent-storage
      persistentVolumeClaim:
        claimName: pvc-rwo
```

```sh
kubectl apply -f ./copier.yaml
```


Copy from local to pod

```sh
kubectl cp ./backup/dir copier:/srv/www
```


Copy from pod to local

```sh
kubectl cp copier:/srv/www ./backup/dir 
```

### Perform rolling update of a service

```sh
kubectl rollout restart deployment <DEPLOYMENT_NAME>
```