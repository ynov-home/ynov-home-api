require("dotenv").config();
const { OpenAI } = require("openai");
const { sendInstruction } = require("../mqtt/mqttClient");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const analyzeVoiceCommand = async (commandText) => {
    const prompt = `
    Analyse la phrase suivante et extrait les informations en JSON :
    Phrase: "${commandText}"
    
    Format attendu :
    {
        "room": "<nom de la pièce>",
        "type": "<type d'objet>",
        "name": "<nom de l'objet>",
        "instruction": "<action à effectuer>"
    }
    
    Réponds uniquement avec du JSON sans texte explicatif ou additionnel.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 100
        });

        console.log("🤖 Réponse de l'IA :", response.choices[0].message.content);

        const jsonResponse = JSON.parse(response.choices[0].message.content);
        return jsonResponse;
    } catch (error) {
        console.error("❌ Erreur lors de l'analyse de la commande vocale :", error);
        throw new Error("Impossible d'analyser la commande.");
    }
};

// API Endpoint
const processVoiceCommand = async (req, res) => {
    try {
        const { command } = req.body;
        if (!command) {
            return res.status(400).json({ error: "Commande vocale manquante." });
        }

        const formattedCommand = await analyzeVoiceCommand(command);

        sendInstruction(formattedCommand);
        res.json({ success: true, command: formattedCommand });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processVoiceCommand };
