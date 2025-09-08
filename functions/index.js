const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {VertexAI} = require("@google-cloud/vertexai");

admin.initializeApp();

// Inicializa Vertex AI
const vertex_ai = new VertexAI({project: process.env.GCLOUD_PROJECT, location: "us-central1"});
const model = "gemini-1.0-pro-001"; // O el modelo que desees usar

const generativeModel = vertex_ai.getGenerativeModel({
    model: model,
    generation_config: {
        "max_output_tokens": 2048,
        "temperature": 0.5,
        "top_p": 1,
    },
});

exports.sendMessageInChat = functions.https.onCall(async (data, context) => {
    // Asegurarse de que el usuario está autenticado
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { prompt, chatId } = data;

    if (!prompt || !chatId) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with 'prompt' and 'chatId' arguments.");
    }

    try {
        const req = {
            contents: [{role: "user", parts: [{text: prompt}]}],
        };

        const result = await generativeModel.generateContent(req);
        const response = result.response;
        const text = response.candidates[0].content.parts[0].text;

        // Aquí podrías guardar el historial del chat en Firestore si quisieras

        return { response: text };

    } catch (error) {
        console.error("Error calling generative model:", error);
        throw new functions.https.HttpsError("internal", "Failed to get response from AI model.");
    }
});

exports.translateText = functions.https.onCall(async (data, context) => {
     if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { text, targetLanguage } = data;

    if (!text || !targetLanguage) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with 'text' and 'targetLanguage' arguments.");
    }

    const prompt = `Translate the following text to ${targetLanguage}: ${text}`;

    try {
        const req = {
            contents: [{role: "user", parts: [{text: prompt}]}],
        };

        const result = await generativeModel.generateContent(req);
        const response = result.response;
        const translatedText = response.candidates[0].content.parts[0].text;

        return { translation: translatedText };

    } catch (error) {
        console.error("Error calling generative model:", error);
        throw new functions.https.HttpsError("internal", "Failed to translate text.");
    }
});
