const { getAllDevices, addDevice, findDevice } = require("../models/deviceModel");
const { sendInstruction } = require("../mqtt/mqttClient");
const { db } = require("../config/firebase");

const getDevices = async (req, res) => {
    try {
        const devices = await getAllDevices();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDeviceById = async (req, res) => {
    try {
        const { id } = req.params;
        const device = await db.collection("devices").doc(id).get();
        if (!device.exists) {
            return res.status(404).json({ error: "L'appareil n'existe pas." });
        }

        res.json({ id: device.id, ...device.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createDevice = async (req, res) => {
    try {
        let { room, type, name, status } = req.body;
        if (!room || !type || !name) {
            return res.status(400).json({ error: "room, type et name sont requis." });
        }

        room = room.toLowerCase();
        type = type.toLowerCase();
        name = name.toLowerCase();
        status = status ? status.toLowerCase() : "off";

        const newDevice = await addDevice({ room, type, name, status });
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendDeviceInstruction = async (req, res) => {
    try {
        let { room, type, name, instruction } = req.body;

        if (!room || !type || !name || !instruction) {
            return res.status(400).json({ error: "room, type, name et instruction sont requis." });
        }

        room = room.toLowerCase();
        type = type.toLowerCase();
        name = name.toLowerCase();

        const device = await findDevice(room, type, name);
        if (!device) {
            return res.status(404).json({ error: "L'appareil n'existe pas." });
        }

        sendInstruction({ room, type, name, instruction, status: device.status });

        res.json({ success: true, message: `Instruction envoyée à ${name} (${room} - ${type})` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        let { room, type, name, status } = req.body;

        if (!room || !type || !name) {
            return res.status(400).json({ error: "room, type et name sont requis." });
        }

        room = room.toLowerCase().replace(/\s+/g, '-');
        type = type.toLowerCase().replace(/\s+/g, '-');
        name = name.toLowerCase().replace(/\s+/g, '-');
        status = status ? status.toLowerCase() : "off";

        const updatedData = { room, type, name, status };

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

module.exports = { getDevices, createDevice, sendDeviceInstruction, updateDevice, deleteDevice, getDeviceById };
