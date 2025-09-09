# Backend

API Node.js/Express para subir y listar fotos en Google Cloud Storage.

## Uso rápido

1. Instalar dependencias:

   ```
   npm install express multer @google-cloud/storage cors
   ```

2. Crear el archivo `.env` en `/backend` con:

   ```
   GCLOUD_PROJECT_ID=tu-id-de-proyecto
   GCLOUD_BUCKET=nombre-del-bucket
   GCLOUD_KEYFILE=credencial.json
   ```

3. Poner el archivo de credenciales de Google en `/backend/credencial.json` (**NO subir a GitHub**).

4. Levantar la API:

   ```
   npm start
   ```

## Endpoints

- `POST /upload` — Sube una foto (campo 'file', tipo multipart/form-data)
- `GET /list` — Devuelve listado con URLs de imágenes públicas en el bucket

---

**¡Recuerda nunca subir tu credencial.json ni .env al control de versiones!**
