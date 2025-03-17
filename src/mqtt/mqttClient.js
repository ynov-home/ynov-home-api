const mqtt = require("mqtt");

const MQTT_BROKER = "mqtt://test.mosquitto.org"; // Exemple de broker public
const MQTT_TOPIC = "iot/devices";

const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
    console.log("✅ Connecté à MQTT Broker");
    client.subscribe(MQTT_TOPIC, (err) => {
        if (err) console.error("Erreur de souscription MQTT", err);
    });
});

client.on("message", (topic, message) => {
    console.log(`📩 Message reçu sur ${topic}: ${message.toString()}`);
});

const sendMessage = (message) => {
    client.publish(MQTT_TOPIC, message);
};

module.exports = { sendMessage };
