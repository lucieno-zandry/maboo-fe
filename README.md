#Run the image in a container

```
docker run -d \
  -p 443:3000 \
  -e VITE_API_BASE_URL=http://102.16.254.6:8000 \
  --name maboo_fe \
  lucienozandry/maboo_fe:latest
```