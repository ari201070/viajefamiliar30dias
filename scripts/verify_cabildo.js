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
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
            process.env[key] = value;
        }
    }
  });
}

const apiKey = process.env.VITE_GOOGLE_API_KEY;
if (!apiKey) {
    console.error("❌ VITE_GOOGLE_API_KEY Not Found");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

async function verifyVisionCabildo() {
    try {
        // Use Cabildo.jpg from public docs
        const imagePath = path.join(rootDir, 'public', 'docs', 'imagenes', 'buenosaires', 'Cabildo.jpg');
        
        if (!fs.existsSync(imagePath)) {
            console.error(`❌ Image not found at: ${imagePath}`);
             process.exit(1);
        }

        console.log(`📸 Reading image from (Cabildo): ${imagePath}`);
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

verifyVisionCabildo();
