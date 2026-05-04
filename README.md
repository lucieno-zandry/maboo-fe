#Run the image in a container

```
docker run -d \
  -p 3000:80 \
  -e API_URL=https://api.example.com \
  --name react-router-app \
  my-react-router-v7-image
```