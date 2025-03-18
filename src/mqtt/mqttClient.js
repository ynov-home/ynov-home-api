const mqtt = require("mqtt");
const { updateDeviceStatus } = require("../models/deviceModel");

const MQTT_BROKER = "mqtt://10.70.4.114:1883"; // Broker local (mathieu)

const client = mqtt.connect(MQTT_BROKER);

const generateTopic = (room) => `maison/${room}`;

const generateStatusTopic = (room, name) => `maison/${room}/${name}/status`;

client.on("connect", () => {
    console.log("✅ Connecté à MQTT Broker");

    client.subscribe("maison/+/+/status", (err) => {
        if (err) console.error("❌ Erreur d'abonnement aux retours d'état MQTT", err);
        else console.log("📡 Abonné aux topics de statut MQTT");
    });
});

client.on("message", async (topic, message) => {
    console.log(`📩 Message reçu sur ${topic}: ${message.toString()}`);

    try {
        const payload = JSON.parse(message.toString());
        const [, room, name, statusType] = topic.split("/"); // maison/salon/lampadaire/status

        if (statusType === "status" && payload.status) {
            console.log(`🔄 Mise à jour du statut de ${name} (${room}) -> ${payload.status}`);

            await updateDeviceStatus(room, name, payload.status);
            console.log("✅ Base de données mise à jour !");
        }
    } catch (error) {
        console.error("❌ Erreur de traitement du message MQTT:", error);
    }
});

const sendInstruction = (data) => {
    if (!data.room || !data.type || !data.name || !data.instruction) {
        console.error("❌ Données invalides pour l'instruction MQTT.");
        return;
    }

    const topic = generateTopic(data.room);
    const payload = {
        type: data.type.toLowerCase(),
        name: data.name.toLowerCase(),
        instruction: data.instruction.toLowerCase(),
        timestamp: new Date().toISOString()
    };

    client.publish(topic, JSON.stringify(payload), (err) => {
        if (err) {
            console.error("❌ Erreur lors de l'envoi de l'instruction MQTT", err);
        } else {
            console.log(`📤 Instruction envoyée sur ${topic}: ${JSON.stringify(payload)}`);
        }
    });
};

module.exports = { sendInstruction };
