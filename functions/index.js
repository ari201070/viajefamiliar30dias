
const functions = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { v2 } = require("@google-cloud/translate");

// --- UTILS ---

const MODEL_NAME = "gemini-pro";
// Make sure to set API_KEY in your environment variables
const API_KEY = process.env.API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const translateClient = new v2.Translate();

const callGenerativeModel = async (prompt, history, userText) => {
    const chat = model.startChat({
        history: history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        })),
        generationConfig: {
            maxOutputTokens: 2048,
        },
    });

    try {
        const result = await chat.sendMessage(userText);
        const response = await result.response;
        return response.text();
    } catch (error) {
        logger.error("Error calling generative model:", error);
        throw new HttpsError("internal", "Failed to get response from AI model.", {
            details: error.message,
        });
    }
};

// --- CLOUD FUNCTIONS ---

exports.sendMessageInChat = onCall(async (request) => {
    logger.info("sendMessageInChat called with data:", { data: request.data });

    const { systemInstruction, history, userText } = request.data;
    if (systemInstruction === undefined || history === undefined || userText === undefined) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with 'systemInstruction', 'history', and 'userText'."
        );
    }
    
    // The new Gemini API handles the system instruction as part of the conversation history.
    const fullHistory = [
        { role: 'user', text: systemInstruction },
        { role: 'model', text: 'Ok, I understand. Let\'s start.' }, 
        ...history
    ];

    return await callGenerativeModel(systemInstruction, fullHistory, userText);
});

exports.translateText = onCall(async (request) => {
    logger.info("translateText called with data:", { data: request.data });

    const { text, targetLang } = request.data;
    if (!text || !targetLang) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with 'text' and 'targetLang'."
        );
    }

    try {
        const [translation] = await translateClient.translate(text, targetLang);
        return translation;
    } catch (error) {
        logger.error("Translation API call failed:", error);
        throw new HttpsError("internal", "Failed to translate text.", {
            details: error.message,
        });
    }
});
