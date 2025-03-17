const { db } = require("../config/firebase");

const DEVICE_COLLECTION = "devices";

const getAllDevices = async () => {
    const snapshot = await db.collection(DEVICE_COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addDevice = async (device) => {
    const docRef = await db.collection(DEVICE_COLLECTION).add(device);
    return { id: docRef.id, ...device };
};

module.exports = { getAllDevices, addDevice };
