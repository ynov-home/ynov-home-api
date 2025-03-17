const mqtt = require("mqtt");

const MQTT_BROKER = "mqtt://10.70.4.114:1883"; // Broker local (mathieu)

const client = mqtt.connect(MQTT_BROKER);

const generateTopic = (room) => `maison/${room}`;
// Changer le préfixe pour cibler un topic précis

client.on("connect", () => {
    console.log("✅ Connecté à MQTT Broker");
});

client.on("message", (topic, message) => {
    console.log(`📩 Message reçu sur ${topic}: ${message.toString()}`);
});

const sendInstruction = (data) => {
    if (!data.room || !data.type || !data.name || !data.instruction) {
        console.error("❌ Données invalides pour l'instruction MQTT.");
        return;
    }
    console.log(`📤 Envoi de l'instruction MQTT pour ${data.name} (${data.room} - ${data.type})`);

    const topic = generateTopic(data.room);
    console.log(`📤 Envoi de l'instruction MQTT sur le topic ${topic}`);
    const payload = {
        type: data.type,
        name: data.name,
        instruction: data.instruction,
        timestamp: new Date().toISOString()
    };
    console.log(`📤 Payload de l'instruction MQTT: ${JSON.stringify(payload)}`);

    client.publish(topic, JSON.stringify(payload), (err) => {
        if (err) {
            console.error("❌ Erreur lors de l'envoi de l'instruction MQTT", err);
        } else {
            console.log(`📤 Instruction envoyée sur ${topic}: ${JSON.stringify(payload)}`);
        }
    });
};

module.exports = { sendInstruction };
