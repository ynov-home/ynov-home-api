const express = require("express");
const { getDevices, createDevice, updateDevice, deleteDevice, sendDeviceInstruction, getDeviceById } = require("../controllers/devicesController");
const { sendInstruction } = require("../mqtt/mqttClient");
const { processVoiceCommand } = require("../controllers/aiController");

const router = express.Router();

module.exports = router;

router.get("/", getDevices);
router.get("/:id", getDeviceById);
router.post("/", createDevice);
router.post("/send-mqtt", sendDeviceInstruction);
router.put("/:id", updateDevice);
router.delete("/:id", deleteDevice);
router.post("/voice-command", processVoiceCommand);

router.post("/send-mqtt", (req, res) => {
    const { room, type, name, instruction } = req.body;

    if (!room || !type || !name || !instruction) {
        return res.status(400).json({ error: "Données invalides : room, type, name et instruction sont requis." });
    }

    sendInstruction({ room, type, instruction });

    res.json({ success: true, message: `Instruction envoyée : ${instruction} pour ${room}` });
});

module.exports = router;
