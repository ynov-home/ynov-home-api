const { db } = require("../config/firebase");

const DEVICE_COLLECTION = "devices";

const getAllDevices = async () => {
    const snapshot = await db.collection("devices").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addDevice = async (device) => {
    const newDevice = {
        room: device.room.toLowerCase(),
        type: device.type.toLowerCase(),
        name: device.name.toLowerCase(),
        status: device.status ? device.status.toLowerCase() : "off"
    };

    const docRef = await db.collection("devices").add(newDevice);
    return { id: docRef.id, ...newDevice };
};

const findDevice = async (room, type, name) => {
    const snapshot = await db.collection("devices")
        .where("room", "==", room.toLowerCase())
        .where("type", "==", type.toLowerCase())
        .where("name", "==", name.toLowerCase())
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

const updateDeviceStatus = async (room, name, status) => {
    try {
        const devicesRef = db.collection("devices");
        const querySnapshot = await devicesRef
            .where("room", "==", room)
            .where("name", "==", name)
            .get();

        if (querySnapshot.empty) {
            console.error(`❌ Aucun appareil trouvé pour ${name} dans ${room}`);
            return;
        }

        querySnapshot.forEach(async (doc) => {
            await doc.ref.update({ status });
            console.log(`✅ Statut mis à jour pour ${name} (${room}) -> ${status}`);
        });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du statut dans Firestore", error);
    }
};

module.exports = { getAllDevices, addDevice, findDevice, updateDeviceStatus };
