# supprime le conteneur s'il existe déjà
docker rm -f prid2122-g03
# crée l'image en utilisant le fichier Dockerfile
docker build . -t prid2122-g03
# crée un conteneur du même nom en démarrant l'image prid2122-tuto et rend le port 80 du conteneur accessible 
docker run -d --name prid2122-g03 -p 80:80 prid2122-g03
