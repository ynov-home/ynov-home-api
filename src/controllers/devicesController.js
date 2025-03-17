const { getAllDevices, addDevice } = require("../models/deviceModel");
const { db } = require("../config/firebase");

const getDevices = async (req, res) => {
    try {
        const devices = await getAllDevices();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createDevice = async (req, res) => {
    try {
        const newDevice = await addDevice(req.body);
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        await db.collection("devices").doc(id).update(updatedData);
        res.json({ id, ...updatedData, message: "Mise à jour réussie !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;

        await db.collection("devices").doc(id).delete();
        res.json({ id, message: "Suppression réussie !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDevices, createDevice, updateDevice, deleteDevice };
