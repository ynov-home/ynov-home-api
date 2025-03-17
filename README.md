# 🚀 **Ynov Home API**

API permettant de gérer des **objets connectés** (IoT) via une application mobile/web. Cette API permet de **créer, lire, mettre à jour et supprimer** des objets connectés en utilisant **Node.js, Express.js et Firebase Firestore**.

---

## 📌 **1. Installation & Lancement**

### ⚡ **1.1. Prérequis**
- **Node.js** (`>= 16.x.x`)
- **Firebase Firestore**
- **Compte Firebase avec Service Account JSON**
- **Postman** (pour tester les routes API)

### 📥 **1.2. Cloner le projet**
```sh
git clone https://github.com/ton-utilisateur/ynov-home-api.git
cd ynov-home-api
```

### 📦 **1.3. Installer les dépendances**
```sh
npm install
```

### 🔑 **1.4. Configurer Firebase**
1️⃣ **Créer un projet Firebase** sur [Firebase Console](https://console.firebase.google.com/)  
2️⃣ **Activer Firestore Database**  
3️⃣ **Générer une clé privée** (`firebase-adminsdk.json`) :
- Aller dans **Paramètres du projet** → **Comptes de service**
- Cliquer sur **Générer une nouvelle clé privée**
- Placer le fichier **`firebase-adminsdk.json`** dans la racine du projet

4️⃣ **Créer un fichier `.env`** et ajouter :
```env
PORT=5000
FIREBASE_DATABASE_URL=https://ton-projet-firebase.firebaseio.com
```

### ▶️ **1.5. Démarrer l'API**
```sh
npm run dev
```
📌 **L'API tourne sur `http://localhost:5000`**

---

## 📌 **2. Routes API**

### 📍 **2.1. CRUD des objets connectés**

| Méthode  | Endpoint            | Description                            |
|----------|---------------------|----------------------------------------|
| **GET**  | `/api/devices`      | Récupérer la liste des objets connectés |
| **POST** | `/api/devices`      | Ajouter un nouvel objet connecté      |
| **PUT**  | `/api/devices/:id`  | Modifier un objet connecté            |
| **DELETE** | `/api/devices/:id` | Supprimer un objet connecté          |

---

## 📌 **3. Tests API avec Postman**

### 🔍 **3.1. Récupérer tous les objets**
1️⃣ Ouvrir **Postman**  
2️⃣ **Nouvelle requête**  
3️⃣ **Méthode** : `GET`  
4️⃣ **URL** : `http://localhost:5000/api/devices`  
5️⃣ **Cliquer sur "Send"**

✅ **Réponse attendue** :
```json
[
  {
    "id": "123abc",
    "name": "Lampe de salon",
    "status": "on",
    "type": "light",
    "location": "Salon"
  }
]
```

---

### ➕ **3.2. Ajouter un objet**
1️⃣ **Méthode** : `POST`  
2️⃣ **URL** : `http://localhost:5000/api/devices`  
3️⃣ **Headers** :
- `Content-Type`: `application/json`  
  4️⃣ **Body** → **Raw** (format JSON) :
```json
{
  "name": "Ventilateur",
  "status": "off",
  "type": "fan",
  "location": "Chambre"
}
```
5️⃣ **Cliquer sur "Send"**

✅ **Réponse attendue** :
```json
{
  "id": "AZERTY123456",
  "name": "Ventilateur",
  "status": "off",
  "type": "fan",
  "location": "Chambre"
}
```

---

### ✏️ **3.3. Modifier un objet (`PUT`)**
📌 **Remplacer `ID_DU_DEVICE` par un ID existant**

1️⃣ **Méthode** : `PUT`  
2️⃣ **URL** : `http://localhost:5000/api/devices/ID_DU_DEVICE`  
3️⃣ **Headers** :
- `Content-Type`: `application/json`  
  4️⃣ **Body** → **Raw** (format JSON) :
```json
{
  "status": "on"
}
```
5️⃣ **Cliquer sur "Send"**

✅ **Réponse attendue** :
```json
{
  "id": "ID_DU_DEVICE",
  "status": "on",
  "message": "Mise à jour réussie !"
}
```

---

### ❌ **3.4. Supprimer un objet (`DELETE`)**
📌 **Remplacer `ID_DU_DEVICE` par un ID existant**

1️⃣ **Méthode** : `DELETE`  
2️⃣ **URL** : `http://localhost:5000/api/devices/ID_DU_DEVICE`  
3️⃣ **Cliquer sur "Send"**

✅ **Réponse attendue** :
```json
{
  "id": "ID_DU_DEVICE",
  "message": "Suppression réussie !"
}
```

---

## 📌 **4. Structure du Projet**
```
ynov-home-api/
│── src/
│   ├── config/
│   │   ├── firebase.js       # Connexion à Firebase
│   ├── routes/
│   │   ├── devices.js        # Routes API
│   ├── controllers/
│   │   ├── devicesController.js # Logique des routes
│   ├── models/
│   │   ├── deviceModel.js    # Modèle Firestore
│   ├── mqtt/
│   │   ├── mqttClient.js     # Connexion MQTT (si utilisé)
│   ├── app.js                # Configuration Express
│── .env                      # Variables d'environnement
│── server.js                 # Point d'entrée du serveur
│── package.json
│── firebase-adminsdk.json     # 🔥 Clé Firebase (NE PAS PARTAGER)
│── README.md
```
