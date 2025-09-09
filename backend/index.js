const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

const GCLOUD_PROJECT_ID = process.env.GCLOUD_PROJECT_ID;
const GCLOUD_BUCKET = process.env.GCLOUD_BUCKET;
const GCLOUD_KEYFILE = process.env.GCLOUD_KEYFILE;

const storage = new Storage({
    projectId: GCLOUD_PROJECT_ID,
    keyFilename: GCLOUD_KEYFILE,
});
const bucket = storage.bucket(GCLOUD_BUCKET);

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const blob = bucket.file(Date.now() + '-' + req.file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
    });
    blobStream.on('error', err => res.status(500).send({ message: err.message }));
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${blob.name}`;
        res.status(200).send({ url: publicUrl });
    });
    blobStream.end(req.file.buffer);
});

app.get('/list', async (req, res) => {
    try {
        const [files] = await bucket.getFiles();
        const urls = files.map(file => ({
            name: file.name,
            url: `https://storage.googleapis.com/${GCLOUD_BUCKET}/${file.name}`
        }));
        res.json(urls);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('API escuchando en puerto', PORT));
