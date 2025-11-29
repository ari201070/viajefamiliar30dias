import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../src/locales');
const esPath = path.join(localesDir, 'es.json');
const hePath = path.join(localesDir, 'he.json');

console.log('🔍 Validating locale files...');

function readJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Check for duplicate keys using a custom parser or regex approach is hard for nested JSON,
        // but standard JSON.parse will just take the last one.
        // To detect duplicates, we can use a reviver function or a regex check.
        // For this specific "duplicate object key" error which often comes from copy-paste errors
        // where the entire object is duplicated inside itself, a simple structure check helps.

        const parsed = JSON.parse(content);
        return { content, parsed, error: null };
    } catch (e) {
        return { content: null, parsed: null, error: e.message };
    }
}

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            // We expect a flat structure for this project based on previous files, 
            // but if there are nested objects, we recurse.
            // However, the error we fixed was a nested object that shouldn't be there.
            // Let's warn if we see nested objects as this project seems to use flat keys mostly.
            keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
        } else {
            keys.push(`${prefix}${key}`);
        }
    }
    return keys;
}

// 1. Validate JSON Syntax
const es = readJsonFile(esPath);
const he = readJsonFile(hePath);

if (es.error) {
    console.error(`❌ Error in es.json: ${es.error}`);
    process.exit(1);
}
if (he.error) {
    console.error(`❌ Error in he.json: ${he.error}`);
    process.exit(1);
}

console.log('✅ JSON Syntax is valid.');

// 2. Check for nested structures (The specific bug we fixed)
// The bug was: { key: "val", ... { key: "val" } } - which is valid JSON but wrong for us if unintentional.
// Actually, strict JSON doesn't allow duplicate keys, but JS JSON.parse() is lenient.
// We can check if the file content has the same key appearing twice.

function checkDuplicateKeys(content, filename) {
    // Simple regex to find keys. This is not perfect for all JSON but good for standard formatted ones.
    const keyRegex = /"([^"]+)":/g;
    const keys = [];
    let match;
    const foundKeys = new Set();
    const duplicates = [];

    while ((match = keyRegex.exec(content)) !== null) {
        const key = match[1];
        if (foundKeys.has(key)) {
            duplicates.push(key);
        }
        foundKeys.add(key);
    }

    if (duplicates.length > 0) {
        // Filter out common false positives if any (unlikely in simple key-value pairs)
        // For now, report all.
        console.warn(`⚠️  Potential duplicate keys found in ${filename}:`, duplicates.slice(0, 5), duplicates.length > 5 ? '...' : '');
        // We won't fail the build for this regex check as it might be flaky with values containing quotes,
        // but it's a good warning.
        return false;
    }
    return true;
}

checkDuplicateKeys(es.content, 'es.json');
checkDuplicateKeys(he.content, 'he.json');


// 3. Compare Keys
const esKeys = new Set(getKeys(es.parsed));
const heKeys = new Set(getKeys(he.parsed));

const missingInHe = [...esKeys].filter(k => !heKeys.has(k));
const missingInEs = [...heKeys].filter(k => !esKeys.has(k));

if (missingInHe.length > 0) {
    console.error('❌ Missing keys in he.json:', missingInHe);
    process.exit(1);
}

if (missingInEs.length > 0) {
    console.error('❌ Missing keys in es.json:', missingInEs);
    process.exit(1);
}

console.log('✅ Keys match perfectly between languages.');
console.log('🎉 Validation passed!');
