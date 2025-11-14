# 🎮 GameVault API

API Back-end complète pour plateforme de distribution de jeux vidéo (style Steam/Epic Games) développée avec Node.js, Express, PostgreSQL et MongoDB.

## 📋 Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Endpoints API](#endpoints-api)
- [Tests](#tests)
- [Sécurité](#sécurité)
- [Documentation](#documentation)
- [Auteurs](#auteurs)

---

## 🎯 Présentation

GameVault API est une solution back-end complète permettant de gérer une plateforme de distribution de jeux vidéo. Le projet implémente un système d'authentification JWT, une gestion complète des jeux, des avis utilisateurs, des achats et des listes de souhaits.

**Contexte :** Projet réalisé dans le cadre du TP Développement Back-End - EFREI Bachelor DEV3 - Novembre 2024

---

## ✨ Fonctionnalités

### Authentification & Autorisation

- ✅ Inscription et connexion sécurisées
- ✅ Système JWT avec access token (15min) et refresh token (7j)
- ✅ Gestion des rôles : USER / ADMIN
- ✅ Middleware de vérification des permissions

### Gestion des jeux

- ✅ CRUD complet (Créer, Lire, Modifier, Supprimer)
- ✅ Pagination et filtres de recherche
- ✅ Réservé aux administrateurs pour création/modification

### Système d'avis

- ✅ Notes et commentaires sur les jeux (1-5 étoiles)
- ✅ Calcul de la moyenne des notes
- ✅ Un avis par utilisateur par jeu
- ✅ Modification et suppression de ses propres avis

### Achats et commandes

- ✅ Système d'achat de jeux
- ✅ Historique des commandes
- ✅ Vérification anti-doublon (impossible d'acheter 2 fois le même jeu)
- ✅ Logs des achats dans MongoDB

### Wishlist

- ✅ Liste de souhaits personnalisée
- ✅ Ajout/retrait de jeux favoris
- ✅ Consultation rapide des jeux souhaités

### Sécurité & Performance

- ✅ Rate limiting (100 req/15min global, 5 req/15min sur auth)
- ✅ CORS configuré avec whitelist
- ✅ Hashage des mots de passe avec Bcrypt (10 salt rounds)
- ✅ Validation stricte des données avec Joi
- ✅ Gestion centralisée des erreurs

### Logs & Statistiques

- ✅ Tracking des activités utilisateurs (MongoDB)
- ✅ Statistiques des jeux (vues, achats)
- ✅ Historique complet des actions

---

## 🛠️ Technologies

### Back-end

- **Node.js** (v18+) - Runtime JavaScript
- **Express.js** (v4.18) - Framework web
- **TypeScript** - Non (JavaScript ES6+)

### Bases de données

- **PostgreSQL** (v14+) - Base relationnelle principale
  - Users, Games, Orders, Reviews, Wishlists
  - Contraintes d'intégrité référentielle
  - Transactions ACID
- **MongoDB** (v6+) - Base NoSQL complémentaire
  - Activity Logs
  - Game Statistics
  - Données non structurées

### Sécurité & Validation

- **jsonwebtoken** (v9.0) - Authentification JWT
- **bcryptjs** (v2.4) - Hashage des mots de passe
- **joi** (v17.11) - Validation de données
- **express-rate-limit** (v7.1) - Rate limiting
- **cors** (v2.8) - Cross-Origin Resource Sharing

### Documentation & Tests

- **swagger-jsdoc** (v6.2) - Génération docs Swagger
- **swagger-ui-express** (v5.0) - Interface Swagger
- **jest** (v29.7) - Framework de tests
- **supertest** (v6.3) - Tests HTTP

### Outils de développement

- **nodemon** (v3.0) - Auto-redémarrage serveur
- **morgan** (v1.10) - Logger HTTP
- **dotenv** (v16.3) - Gestion variables d'environnement

---

## 🏗️ Architecture

### Pattern MVC (Model-View-Controller)

```
┌─────────────┐
│   Client    │
│ (Postman/   │
│  Frontend)  │
└──────┬──────┘
       │ HTTP REST
       ▼
┌──────────────────────────────────┐
│        Express.js API            │
│  ┌────────────────────────────┐  │
│  │    Middlewares             │  │
│  │  - CORS                    │  │
│  │  - Rate Limiter            │  │
│  │  - JWT Auth                │  │
│  │  - Validator (Joi)         │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │    Routes                  │  │
│  │  /api/auth                 │  │
│  │  /api/games                │  │
│  │  /api/reviews              │  │
│  │  /api/orders               │  │
│  │  /api/wishlist             │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │    Controllers             │  │
│  │  - Gestion requêtes HTTP   │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │    Services                │  │
│  │  - Business Logic          │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │    Models                  │  │
│  │  - Accès données           │  │
│  └────────────────────────────┘  │
└────┬─────────────────────┬───────┘
     │                     │
     ▼                     ▼
┌──────────┐        ┌──────────┐
│PostgreSQL│        │ MongoDB  │
│          │        │          │
│ - users  │        │ - logs   │
│ - games  │        │ - stats  │
│ - orders │        └──────────┘
│ - reviews│
│ - wishlists│
└──────────┘
```

### Structure du projet

```
gamevault-api/
├── src/
│   ├── config/
│   │   ├── database.js          # Connexions PostgreSQL + MongoDB
│   │   ├── swagger.js            # Configuration Swagger
│   │   └── constants.js          # Constantes (rôles, codes HTTP)
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js    # Vérification JWT + rôles
│   │   ├── validator.middleware.js # Validation Joi
│   │   ├── rateLimiter.middleware.js # Rate limiting
│   │   └── errorHandler.middleware.js # Gestion erreurs
│   │
│   ├── models/
│   │   ├── postgres/
│   │   │   ├── User.js           # Model utilisateurs (bcrypt)
│   │   │   ├── Game.js           # Model jeux
│   │   │   ├── Order.js          # Model commandes + Wishlist
│   │   │   └── Review.js         # Model avis
│   │   └── mongo/
│   │       └── ActivityLog.js    # Logs activités (Mongoose)
│   │
│   ├── services/
│   │   ├── auth.service.js       # Logique auth (JWT, hash)
│   │   └── game.service.js       # Logique games (CRUD)
│   │
│   ├── controllers/
│   │   ├── auth.controller.js    # Controller auth
│   │   ├── game.controller.js    # Controller games
│   │   ├── review.controller.js  # Controller avis
│   │   ├── order.controller.js   # Controller commandes
│   │   └── wishlist.controller.js # Controller wishlist
│   │
│   ├── routes/
│   │   ├── index.js              # Regroupement routes
│   │   ├── auth.routes.js
│   │   ├── game.routes.js
│   │   ├── review.routes.js
│   │   ├── order.routes.js
│   │   ├── wishlist.routes.js
│   │   └── user.routes.js
│   │
│   ├── tests/
│   │   ├── setup.js              # Configuration tests
│   │   ├── auth.test.js          # Tests auth
│   │   └── game.test.js          # Tests games
│   │
│   ├── app.js                    # Configuration Express
│   └── server.js                 # Démarrage serveur
│
├── .env                          # Variables d'environnement (non versionné)
├── .env.example                  # Template variables
├── .gitignore                    # Fichiers ignorés Git
├── jest.config.js                # Configuration Jest
├── package.json                  # Dépendances npm
└── README.md                     # Documentation (ce fichier)
```

---

## 🚀 Installation

### Prérequis

- **Node.js** v18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL** v14+ ([Télécharger](https://www.postgresql.org/download/))
- **MongoDB** v6+ ([Télécharger](https://www.mongodb.com/try/download/community))
- **Git** ([Télécharger](https://git-scm.com/downloads))

### Étapes d'installation

#### 1. Cloner le repository

```bash
git clone https://github.com/perviin/tp-game-api.git
cd tp-game-api
```

#### 2. Installer les dépendances

```bash
npm install
```

#### 3. Configurer PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE gamevault;

# Quitter
\q
```

Les tables seront créées automatiquement au premier démarrage grâce à `initPostgresTables()`.

#### 4. Vérifier que MongoDB tourne

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows : MongoDB tourne automatiquement après installation
```

#### 5. Configurer les variables d'environnement

```bash
# Copier le template
cp .env.example .env

# Éditer .env avec vos credentials
nano .env  # ou code .env
```

Exemple de `.env` :

```bash
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamevault
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

MONGO_URI=mongodb://localhost:27017/gamevault

JWT_SECRET=votre_secret_jwt_ultra_securise
JWT_REFRESH_SECRET=votre_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 6. Démarrer le serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Si tout est correct, vous devriez voir :

```
✅ PostgreSQL connected
✅ MongoDB connected
✅ PostgreSQL tables initialized

╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎮 GameVault API is running                        ║
║                                                       ║
║   📍 Server:  http://localhost:3000                  ║
║   📚 Docs:    http://localhost:3000/api-docs         ║
║   🌍 Env:     development                            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## ⚙️ Configuration

### Variables d'environnement

| Variable                  | Description              | Valeur par défaut                     |
| ------------------------- | ------------------------ | ------------------------------------- |
| `PORT`                    | Port du serveur          | `3000`                                |
| `NODE_ENV`                | Environnement            | `development`                         |
| `DB_HOST`                 | Hôte PostgreSQL          | `localhost`                           |
| `DB_PORT`                 | Port PostgreSQL          | `5432`                                |
| `DB_NAME`                 | Nom base PostgreSQL      | `gamevault`                           |
| `DB_USER`                 | User PostgreSQL          | `postgres`                            |
| `DB_PASSWORD`             | Password PostgreSQL      | -                                     |
| `MONGO_URI`               | URI MongoDB              | `mongodb://localhost:27017/gamevault` |
| `JWT_SECRET`              | Secret access token      | - (obligatoire)                       |
| `JWT_REFRESH_SECRET`      | Secret refresh token     | - (obligatoire)                       |
| `JWT_EXPIRES_IN`          | Durée access token       | `15m`                                 |
| `JWT_REFRESH_EXPIRES_IN`  | Durée refresh token      | `7d`                                  |
| `ALLOWED_ORIGINS`         | Origines CORS autorisées | `http://localhost:3000`               |
| `RATE_LIMIT_WINDOW_MS`    | Fenêtre rate limit       | `900000` (15min)                      |
| `RATE_LIMIT_MAX_REQUESTS` | Max requêtes             | `100`                                 |

---

## 📖 Utilisation

### Tester avec cURL

#### 1. Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

**Réponse :**

```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "testuser",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Sauvegarder le `accessToken` pour les prochaines requêtes !**

#### 2. Lister les jeux (public)

```bash
curl http://localhost:3000/api/games
```

#### 3. Créer un jeu (admin seulement)

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \
  -d '{
    "title": "The Witcher 3",
    "description": "RPG en monde ouvert",
    "price": 39.99,
    "publisher": "CD Projekt Red",
    "releaseDate": "2015-05-19"
  }'
```

#### 4. Acheter un jeu

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \
  -d '{"gameId": 1}'
```

#### 5. Créer un avis

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \
  -d '{
    "gameId": 1,
    "rating": 5,
    "comment": "Excellent jeu !"
  }'
```

---

## 🔌 Endpoints API

### 🔐 Authentification

| Méthode | Endpoint             | Description      | Auth | Rôle |
| ------- | -------------------- | ---------------- | ---- | ---- |
| `POST`  | `/api/auth/register` | Inscription      | ❌   | -    |
| `POST`  | `/api/auth/login`    | Connexion        | ❌   | -    |
| `POST`  | `/api/auth/refresh`  | Rafraîchir token | ❌   | -    |
| `POST`  | `/api/auth/logout`   | Déconnexion      | ❌   | -    |

### 🎮 Jeux

| Méthode  | Endpoint         | Description      | Auth | Rôle  |
| -------- | ---------------- | ---------------- | ---- | ----- |
| `GET`    | `/api/games`     | Liste des jeux   | ❌   | -     |
| `GET`    | `/api/games/:id` | Détails d'un jeu | ❌   | -     |
| `POST`   | `/api/games`     | Créer un jeu     | ✅   | ADMIN |
| `PUT`    | `/api/games/:id` | Modifier un jeu  | ✅   | ADMIN |
| `DELETE` | `/api/games/:id` | Supprimer un jeu | ✅   | ADMIN |

### ⭐ Avis

| Méthode  | Endpoint                    | Description        | Auth | Rôle       |
| -------- | --------------------------- | ------------------ | ---- | ---------- |
| `GET`    | `/api/reviews/game/:gameId` | Avis d'un jeu      | ❌   | -          |
| `POST`   | `/api/reviews`              | Créer un avis      | ✅   | USER       |
| `DELETE` | `/api/reviews/:id`          | Supprimer son avis | ✅   | USER/ADMIN |

### 🛒 Commandes

| Méthode | Endpoint      | Description    | Auth | Rôle |
| ------- | ------------- | -------------- | ---- | ---- |
| `GET`   | `/api/orders` | Ses commandes  | ✅   | USER |
| `POST`  | `/api/orders` | Acheter un jeu | ✅   | USER |

### 💝 Wishlist

| Méthode  | Endpoint                | Description            | Auth | Rôle |
| -------- | ----------------------- | ---------------------- | ---- | ---- |
| `GET`    | `/api/wishlist`         | Sa wishlist            | ✅   | USER |
| `POST`   | `/api/wishlist/:gameId` | Ajouter à la wishlist  | ✅   | USER |
| `DELETE` | `/api/wishlist/:gameId` | Retirer de la wishlist | ✅   | USER |

### 👤 Utilisateurs

| Méthode | Endpoint             | Description      | Auth | Rôle  |
| ------- | -------------------- | ---------------- | ---- | ----- |
| `GET`   | `/api/users/profile` | Son profil       | ✅   | USER  |
| `GET`   | `/api/users/:id`     | Profil d'un user | ✅   | ADMIN |

---

## 🧪 Tests

### Lancer les tests

```bash
# Tous les tests
npm test

# Tests avec coverage
npm test -- --coverage

# Mode watch (relance auto)
npm test -- --watch
```

### Coverage des tests

Les tests couvrent :

- ✅ Authentification (register, login, refresh)
- ✅ CRUD jeux
- ✅ Routes publiques vs protégées
- ✅ Validation des données
- ✅ Gestion des erreurs

Exemple de résultat :

```
PASS  src/tests/auth.test.js
  Auth Endpoints
    POST /api/auth/register
      ✓ devrait créer un nouvel utilisateur (250ms)
      ✓ ne devrait pas créer un user avec email existant (50ms)
    POST /api/auth/login
      ✓ devrait connecter un utilisateur valide (120ms)
      ✓ devrait rejeter des identifiants invalides (30ms)

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
```

---

## 🔒 Sécurité

### Mesures de sécurité implémentées

#### 1. Authentification JWT

- **Access Token** : Courte durée (15 minutes)
- **Refresh Token** : Longue durée (7 jours), stocké en base
- Signature cryptographique avec secret
- Vérification à chaque requête protégée

#### 2. Hashage des mots de passe

- Algorithme **Bcrypt** avec 10 salt rounds
- Jamais de stockage en clair
- Résistant aux attaques rainbow tables

#### 3. Rate Limiting

- **Global** : 100 requêtes / 15 minutes par IP
- **Auth** : 5 tentatives / 15 minutes (protection brute-force)
- Headers `RateLimit-*` dans les réponses

#### 4. CORS

- Whitelist des origines autorisées
- Configuration credentials: true
- Protection contre les requêtes cross-origin malveillantes

#### 5. Validation des données

- Validation avec **Joi** sur toutes les entrées
- Protection contre injections SQL (requêtes paramétrées)
- Vérification des types et formats

#### 6. Gestion des rôles

- Middleware `requireAdmin` pour routes sensibles
- Vérification du rôle dans le token JWT
- Séparation USER / ADMIN

#### 7. Gestion des erreurs

- Pas de leak d'informations sensibles
- Messages génériques en production
- Logs détaillés en développement

#### 8. Contraintes base de données

- Contraintes UNIQUE (email, user+game pour reviews)
- Foreign Keys avec ON DELETE CASCADE
- Checks (rating entre 1 et 5)

---

## 📚 Documentation

### Swagger / OpenAPI

Documentation interactive disponible sur :

**🔗 http://localhost:3000/api-docs**

Interface Swagger UI permettant de :

- 📖 Consulter tous les endpoints
- 🧪 Tester les routes directement
- 📝 Voir les schémas de données
- 🔐 S'authentifier avec JWT

Pour utiliser les routes protégées dans Swagger :

1. Obtenir un `accessToken` via `/api/auth/login`
2. Cliquer sur **"Authorize"** en haut de la page
3. Entrer : `Bearer VOTRE_TOKEN`
4. Cliquer sur **"Authorize"**
5. Toutes les requêtes incluront maintenant le token

### JSON Swagger brut

**🔗 http://localhost:3000/api-docs.json**

---

## 👥 Auteurs

**Projet réalisé par :**

- **Pervin Eren** - Développeur Back-End

  - 🔗 [GitHub](https://github.com/perviin)

**Encadrant :** Milo ROCHER
**Formation :** Bachelor DEV3 DEV1 - EFREI  
**Date :** 14/11/2025

---

## License

Ce projet est sous licence **MIT**.

---

## Remerciements

- EFREI Paris pour le support pédagogique
- La communauté Node.js et Express.js
- Les mainteneurs des librairies open-source utilisées

---

## Support

Pour toute question ou problème :

1. Consulter la [documentation Swagger](http://localhost:3000/api-docs)
2. Ouvrir une [issue GitHub](https://github.com/perviin/tp-game-api/issues)
3. Contacter les auteurs (moi)
