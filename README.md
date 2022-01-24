# Memo

## Prérequis

Les outils suivants doivent être présents sur la machine :

- composer
- yarn
- symfony
- docker

Installation des dépendances :
```
composer install
yarn install
```

Pour démarer l'application :
```
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:13.2
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
yarn encore dev
symfony server:start
```

Pour compiler le Javascript et le CSS à la volé pendant le développement :
```
yarn encore dev --watch
```

## Les fichiers principaux

- assets/styles/app.scss
- assets/app.js
- src/Controller/DefaultController.php
- src/Entity/Score.php
- src/Repository/ScoreRepository.php
- templates/default/index.html.twig
- .env ( afin de modifier la configuration de la bdd)