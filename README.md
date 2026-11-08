# FrontBrew

## Présentation du projet

**FrontBrew** est une application web développée avec Vue.js 3, dont l'objectif est de découvrir et d'explorer des brasseries à travers le monde grâce à l'API publique Open Brewery DB.

Ce projet est réalisé en équipe et s'inscrit dans le cadre d'un travail de développement front-end. Il permet de mettre en pratique Vue.js, la gestion des dépendances, les requêtes HTTP et le travail collaboratif avec Git.

## Équipe

Projet réalisé par :

- Noor
- Julie
- Camille

## Technologies utilisées

### Environnement de développement

| Technologie | Version installée |
|---|---:|
| Node.js | 24.19.0 |
| npm | 12.2.0 |
| Vue.js | 3.5.44 |
| Vite | 8.3.5 |
| @vitejs/plugin-vue | 6.0.10 |
| Vue Router | 5.4.0 |
| Pinia | 4.1.0 |
| Axios | 1.21.0 |

### Rôle des principales dépendances

- **Vue.js 3** : création de l'interface utilisateur.
- **Vite** : serveur de développement et outil de compilation.
- **Vue Router** : gestion de la navigation entre les pages.
- **Pinia** : gestion de l'état global de l'application.
- **Axios** : réalisation des requêtes HTTP vers l'API.

## Prérequis

Pour installer et lancer le projet, les outils suivants sont nécessaires :

- [Node.js](https://nodejs.org/) (version 20.19+ ou 22.12+).
- npm, installé avec Node.js.
- [Git](https://git-scm.com/).
- Un éditeur de code, par exemple [Visual Studio Code](https://code.visualstudio.com/).

Pour vérifier les versions installées :

```bash
node -v
npm -v
```

## Installation du projet

### 1. Récupérer le dépôt Git

```bash
git clone https://github.com/nokam-bat/FrontBrew.git
```

### 2. Accéder au dossier du projet

```bash
cd FrontBrew
```

### 3. Installer les dépendances

```bash
npm install
```

Cette commande installe les dépendances déclarées dans les fichiers de configuration du projet.

## Lancer le projet

Pour démarrer le serveur de développement :

```bash
npm run dev
```

Vite indique ensuite dans le terminal l'adresse locale à ouvrir dans le navigateur.

Par défaut, il s'agit généralement de :

```text
http://localhost:5173/
```

## Commandes disponibles

| Commande | Utilisation |
|---|---|
| `npm install` | Installer les dépendances |
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Compiler le projet pour la production |
| `npm run preview` | Prévisualiser la version compilée |
| `npm list vue vite @vitejs/plugin-vue vue-router pinia axios` | Vérifier les versions des dépendances |

## API utilisée

Le projet s'appuie sur **Open Brewery DB**, une API publique qui fournit des informations sur des brasseries.

- Site officiel : https://www.openbrewerydb.org/
- Documentation : https://www.openbrewerydb.org/documentation

L'API pourra notamment être utilisée pour récupérer des informations telles que :

- Le nom de la brasserie.
- Son type.
- Son adresse.
- Sa ville et son pays.
- Ses coordonnées géographiques, lorsqu'elles sont disponibles.

## Structure du projet
L'organisation générale du projet repose sur la structure suivante:

à remplir au fur et à mesure

## Initialisation et configuration du projet

Cette section conserve une trace des étapes de création et de configuration de l'environnement de développement.

### 1. Création du projet avec Vite

Le projet a été initialisé avec la commande suivante :

```bash
npm create vite@latest FrontBrew -- --template vue
```

Cette commande permet de générer un projet Vue.js 3 avec Vite.

Une fois le projet créé, il faut accéder à son dossier :

```bash
cd FrontBrew
```

### 2. Installation des dépendances supplémentaires

Les bibliothèques nécessaires au projet ont été installées avec la commande :

```bash
npm install vue-router pinia axios
```

Elles permettent respectivement de gérer la navigation, l'état global de l'application et les requêtes HTTP.

### 3. Installation des dépendances du projet

La commande suivante permet d'installer les dépendances déclarées dans `package.json` :

```bash
npm install
```

Le fichier `package-lock.json` conserve les versions précises résolues lors de l'installation afin de faciliter la reproduction de l'environnement de développement.

### 4. Vérification des versions

Pour contrôler les versions installées :

```bash
npm list vue vite @vitejs/plugin-vue vue-router pinia axios
```

Les versions relevées dans l'environnement de développement sont indiquées dans le tableau de la section « Technologies utilisées ».

### 5. Configuration du fichier .gitignore

Le fichier `.gitignore` sert à indiquer à Git quels fichiers et dossiers ne doivent pas être suivis dans le dépôt.

Voici une configuration adaptée au projet :

```gitignore
# Logs et journaux d'erreurs générés par Node et les gestionnaires de paquets
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dépendances téléchargées (très lourd, à réinstaller via `npm install`)
node_modules/

# Dossiers générés par Vite lors de la compilation (à réinstaller via `npm run build`)
dist/
dist-ssr/

# Fichiers de configuration ou d'environnement locaux
*.local

# Variables d'environnement confidentielles (clés API, secrets)
.env
.env.*
!.env.example


# Configuration personnelle de l'éditeur VS Code (garde uniquement la liste des extensions recommandées)
.vscode/*
!.vscode/extensions.json

# Fichiers de configuration de l'IDE JetBrains (Rider, WebStorm) 
.idea

# Fichiers système invisibles (macOS / Windows)
.DS_Store
Thumbs.db


# Fichiers de projet Visual Studio et temporaires (Rider / Windows)
*.suo
*.ntvs*
*.njsproj
*.sln


# Fichiers de sauvegarde temporaires générés par les éditeurs de texte (Vim, etc.)
*.sw?

# Dossier de cache local de npm
.npm/

```

**Pourquoi ces exclusions ?**

- `node_modules/` : contient les dépendances installées localement. Ce dossier peut être recréé avec `npm install`.
- `dist/` et `dist-ssr/` : contiennent les fichiers générés lors de la compilation.
- `.env` et `.env.*` : peuvent contenir des variables sensibles ou propres à un environnement local.
- `.vscode/` et `.idea/` : peuvent contenir des préférences personnelles liées à l'éditeur.
- `.npm/` : contient des données de cache locales.

Les fichiers `package.json` et `package-lock.json` doivent en revanche être conservés dans Git. Ils permettent aux autres membres de l'équipe d'installer les mêmes dépendances.

À noter : le fichier `.gitignore` ne retire pas automatiquement du suivi Git les fichiers déjà versionnés. Il agit sur les fichiers qui ne sont pas encore suivis.

## Organisation du projet

L'organisation des dossiers et des fichiers sera définie progressivement au fur et à mesure du développement.

Cette section sera complétée lorsque la structure du projet aura été créée et validée par l'équipe.

## Travail collaboratif

Quelques bonnes pratiques à respecter pendant le développement :

- Récupérer les dernières modifications avec `git pull` avant de commencer à travailler.
- Effectuer des commits réguliers avec des messages explicites.
- Éviter de modifier simultanément les mêmes fichiers.
- Ne pas envoyer le dossier `node_modules/` sur GitHub.
- Conserver les fichiers `package.json` et `package-lock.json`.
- Vérifier que le projet fonctionne avant de pousser ses modifications.
- Prévenir l'équipe lorsqu'une dépendance est ajoutée ou modifiée.

## Licence

Projet réalisé dans un cadre pédagogique.
