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

4️⃣ **Créer un fichier `.env`** à partir du `.env.exemple` et le completer.
```env
FIREBASE_DATABASE_URL=
PORT=5000
OPENAI_API_KEY=
```

**Dans /src/mqtt/mqttClient.js à la ligne 5, adapter avec votre propre ip local sur laquelle tourne MQTT EXPLORER.**

### ▶️ **1.5. Démarrer l'API**
```sh
npm run dev
```
📌 **L'API tourne sur `http://localhost:5000`**

📌 **Le fichier `Hackathon.postman_collection.json` vous permettra de tester l'api sur postman**

---

## 📌 **2. Routes API**
### 📌 **1. Récupérer tous les appareils**
**GET** `/api/devices/`  
📥 **Exemple de réponse :**
```json
[
    {
        "id": "abc123",
        "room": "salon",
        "type": "lumiere",
        "name": "lampadaire",
        "status": "on"
    },
    {
        "id": "xyz456",
        "room": "chambre",
        "type": "chauffage",
        "name": "radiateur",
        "status": "off"
    }
]
```

---

### 📌 **2. Ajouter un appareil**
**POST** `/api/devices/`  
📥 **Données attendues :**
```json
{
    "room": "SALON",
    "type": "LUMIERE",
    "name": "LAMPADAIRE",
    "status": "ON"
}
```
📤 **Réponse :**
```json
{
    "id": "abc123",
    "room": "salon",
    "type": "lumiere",
    "name": "lampadaire",
    "status": "on"
}
```
🛠️ **Remarque :** L'API convertit tout en **minuscules** 🔤

---

### 📌 **3. Mettre à jour un appareil**
**PUT** `/api/devices/{id}`  
📥 **Données attendues :**
```json
{
    "room": "salon",
    "type": "lumiere",
    "name": "lampadaire",
    "status": "off"
}
```
📤 **Réponse :**
```json
{
    "id": "abc123",
    "room": "salon",
    "type": "lumiere",
    "name": "lampadaire",
    "status": "off",
    "message": "Mise à jour réussie !"
}
```

---

### 📌 **4. Supprimer un appareil**
**DELETE** `/api/devices/{id}`  
📤 **Réponse :**
```json
{
    "id": "abc123",
    "message": "Suppression réussie !"
}
```

---

## 🔥 **Envoyer une instruction via MQTT**
**S'assurer d'avoir fait les installations IOT pour cela (https://github.com/ynov-home/ynov-home-iot)**

**POST** `/api/devices/send-mqtt`  
📥 **Données attendues :**
```json
{
    "room": "SALON",
    "type": "LUMIERE",
    "name": "LAMPADAIRE",
    "instruction": "Allumer"
}
```
📤 **Réponse :**
```json
{
    "success": true,
    "message": "Instruction envoyée à lampadaire (salon - lumiere)"
}
```
✅ **L'API vérifie si l'appareil existe avant d'envoyer l'instruction !**

🛠️ **Sur MQTT (topic : `55Kh2gAE5xtKaG5Ph5d5/salon`)** :
```json
{
    "type": "lumiere",
    "name": "lampadaire",
    "instruction": "Allumer",
    "status": "on",
    "timestamp": "2025-03-17T12:00:00.000Z"
}
```

---

## 🛠️ **Test avec Postman**

### **1️⃣ Ajouter un appareil**
- **Méthode** : `POST`
- **URL** : `http://localhost:5000/api/devices/`
- **Body (JSON)** :
```json
{
    "room": "Cuisine",
    "type": "LUMIERE",
    "name": "Suspension",
    "status": "OFF"
}
```
✅ **Vérification** : Faire un `GET /api/devices/` pour voir l'appareil ajouté.

---

### **2️⃣ Envoyer une instruction**
- **Méthode** : `POST`
- **URL** : `http://localhost:5000/api/devices/send-mqtt`
- **Body (JSON)** :
```json
{
    "room": "cuisine",
    "type": "lumiere",
    "name": "suspension",
    "instruction": "Éteindre"
}
```
✅ **Vérification** : L'instruction apparaît dans **Mosquitto**.

---

### 📌 **5. Analyse de commande vocale avec IA**
**POST** `/api/devices/voice-command`  
📥 **Données attendues :**
```json
{
    "command": "Éteins la lumière du salon"
}
```
📤 **Réponse :**
```json
{
    "success": true,
    "command": {
        "room": "salon",
        "type": "lumiere",
        "name": "lampadaire",
        "instruction": "eteindre"
    }
}
```
🛠️ **Fonctionnement :**
1. L'API reçoit une **commande vocale** sous forme de texte.
2. L'IA (OpenAI GPT-4) analyse la phrase et en extrait les informations essentielles (`room`, `type`, `name`, `instruction`).
3. La commande est ensuite envoyée au **broker MQTT** pour exécution.

✅ **Exemple de test avec Postman** :
- **Méthode** : `POST`
- **URL** : `http://localhost:5000/api/devices/voice-command`
- **Body (JSON)** :
```json
{
    "command": "Ouvre la porte d'entrée"
}
```
✅ **Attendu sur MQTT (topic : `devices/porte`)** :
```json
{
    "room": "entrée",
    "type": "porte",
    "name": "porte principale",
    "instruction": "ouvrir"
}
```

---  

## 🔗 **Technos utilisées**
✅ **Node.js** (Express)  
✅ **Firebase Firestore**  
✅ **MQTT (Mosquitto)**  
✅ **Postman** (tests)

---