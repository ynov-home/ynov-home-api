var admin = require("firebase-admin");
const serviceAccount = require("../../firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ynov-home-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();

module.exports = { db };
