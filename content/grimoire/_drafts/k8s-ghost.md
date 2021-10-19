---
title: "Ghost CMS on Google Cloud"
excerpt: "My list"
tags: ["Kubernetes","CGP"]
---

Test



```yaml
# deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: my-ghost-blog
  name: my-ghost-blog
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-ghost-blog
  template:
    metadata:
      labels:
        app: my-ghost-blog
    spec:
      serviceAccountName: my-ghost-blog
      containers:
        - name: ghost
          image: ghost:alpine
          imagePullPolicy: Always
          resources:
            requests:
              memory: 85Mi
          volumeMounts:
            - name: persistent-storage
              mountPath: /var/lib/ghost/content
          env:
            - name: url
              value: https://mysite.com
            - name: database__client
              value: mysql
            - name: database__connection__host
              value: 127.0.0.1
            - name: database__connection__user
              valueFrom:
                secretKeyRef:
                  name: myblog-secret
                  key: username
            - name: database__connection__password
              valueFrom:
                secretKeyRef:
                  name: myblog-secret
                  key: password
            - name: database__connection__database
              valueFrom:
                secretKeyRef:
                  name: myblog-secret
                  key: database
        - name: sql-proxy
          image: us.gcr.io/cloudsql-docker/gce-proxy:latest
          imagePullPolicy: Always
          resources:
            requests:
              memory: 5Mi
          command:
            - "/cloud_sql_proxy"
            - "-ip_address_types=private"
            - "-instances=<INSTANCE_CONNECTION_STRING>"
        - name: varnish
          image: varnish:alpine
          imagePullPolicy: Always
          resources:
            requests:
              memory: 12Mi
          volumeMounts:
            - mountPath: /var/lib/varnish:exec
              name: tmp
          env:
            - name: VARNISH_SIZE
              value: 128M
      volumes:
        - name: tmp
          emptyDir:
            medium: Memory
            sizeLimit: 64Mi
        - name: persistent-storage
          persistentVolumeClaim:
            claimName: blog-claim-rwo
```