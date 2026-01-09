import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load .env manually
const envPath = path.join(rootDir, '.env');
console.log(`Checking .env at: ${envPath}`);

if (fs.existsSync(envPath)) {
  console.log(".env file exists. Reading...");
  const envConfig = fs.readFileSync(envPath, 'utf8');
  console.log(`File content length: ${envConfig.length}`);
  
  envConfig.split('\n').forEach((line, index) => {
    // console.log(`Line ${index}: ${line}`); // Be careful not to log secrets
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
            console.log(`Found key: "${key}"`);
            process.env[key] = value;
        }
    }
  });
} else {
    console.error("❌ .env file does NOT exist at check path.");
}

const apiKey = process.env.VITE_GOOGLE_API_KEY;
if (!apiKey) {
    console.error("❌ VITE_GOOGLE_API_KEY Not Found in .env");
    console.log("Keys in process.env:", Object.keys(process.env).filter(k => k.includes('API')));
    process.exit(1);
}

console.log(`✅ API Key found: ${apiKey.substring(0, 5)}...`);

const client = new GoogleGenAI({ apiKey });

async function verifyVision() {
    try {
        const imagePath = 'C:/Users/flier/.gemini/antigravity/brain/1d2c2db1-e72b-48bd-b501-8a500eb5eb4b/uploaded_image_1_1767175634863.jpg';
        
        if (!fs.existsSync(imagePath)) {
            console.error(`❌ Image not found at: ${imagePath}`);
             process.exit(1);
        }

        console.log(`📸 Reading image from: ${imagePath}`);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Data = imageBuffer.toString('base64');

        console.log("🚀 Sending request to Gemini Vision API...");
        
        const response = await client.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data
                    }
                },
                "Identifica el nombre específico de este lugar (ej. 'Aquafan', 'Teatro Colón', 'Glaciar Perito Moreno'). Si hay carteles visibles, úsalos. Responde SOLO con el nombre del lugar, sin explicaciones. Si no es un punto de interés claro, responde 'Desconocido'."
            ],
        });

        const result = (response.text || '').trim();
        console.log(`\n🎉 RESULT: "${result}"`);
        
        if (result && result !== 'Desconocido' && !result.includes('Error')) {
             console.log("✅ Verification SUCCESS: Place identified.");
        } else {
             console.log("⚠️ Verification INCONCLUSIVE or FAILED (Got 'Desconocido' or empty).");
        }

    } catch (error) {
        console.error("❌ Verification FAILED with error:", error);
    }
}

verifyVision();
