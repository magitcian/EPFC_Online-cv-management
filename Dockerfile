# On part d'une image de base qui contient le SDK de dotnet et qui constitue le premier 'stage' pour construire notre image.
# On donne le nom de 'build' à cet étage pour pouvoir le référence plus tard.
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
# Dans l'image, on se place dans un (nouveau) dossier src
WORKDIR /src
# On copie tout le contenu du dossier courant (la racine du projet) dans le dossier courant de l'image (/src)
COPY . .
# On se place dans le sous-dossier 'backend' de l'image
WORKDIR /src/backend
# On y compile le projet en version release et on publie les exécutables dans un dossier /app/publish de l'image
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# On crée maintenant un autre étage dans la construction de notre image et on l'appelle 'final'.
# Au final, c'est ce qu'on aura fait dans cet étage qui sera stocké dans l'image et les étages précédents 
# seront oubliés. Grâce à cela, on n'aura dans l'étage final que les fichiers compilés finaux et pas les fichiers
# intermédiaires comme le code source.
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS final
# On se place dans un (nouveau) dossier app de l'image
WORKDIR /app
# On copie dans le dossier courant de l'image le contenu du dossier /app/publish crée dans l'étage build
COPY --from=build /app/publish .
# On définit la commande qui doit être exécutée au démarrage du conteneur : dotnet prid-tuto.dll
# La variable d'environnement ASPNETCORE_URLS permet d'indiquer au backend quel est le port interne qui lui est
# fourni par Heroku (via la variable d'environnement PORT) et sur lequel il doit tourner.
CMD ASPNETCORE_URLS=http://*:$PORT dotnet backend.dll
