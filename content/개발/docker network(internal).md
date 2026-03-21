---
title: "docker network(internal)"
date: 2024-10-19
tags: []
publish: false
---
internal : true를 안주면 
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name>
이렇게 명령해서 도커 외부에서 접속할 수 있는 ip를 알아낼 수 있는듯?