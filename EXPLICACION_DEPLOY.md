# Guía Definitiva de Configuración de Claves (Local y Vercel)

Hola, este archivo explica el método final y correcto para configurar las claves de la aplicación. **Hemos eliminado por completo la pantalla de configuración manual de la aplicación.**

## El Nuevo Método: Variables de Entorno

A partir de ahora, toda la configuración se maneja a través de "variables de entorno", que es la práctica estándar y más segura en el desarrollo de software.

-   **Localmente (tu computadora):** Se usa un archivo llamado `.env` en la raíz del proyecto.
-   **En Producción (Vercel):** Se configuran las mismas variables en el panel de control de Vercel.

---

## **Acción Requerida: Configuración Única**

### 1. Configuración Local (Tu Computadora)

Crea un archivo llamado `.env` en la carpeta principal del proyecto (al mismo nivel que `package.json`).

Dentro de ese archivo, pega **una sola línea** con el siguiente formato, reemplazando con tus valores reales de Firebase:

```env
VITE_FIREBASE_CONFIG={"apiKey":"TU_API_KEY","authDomain":"TU_AUTH_DOMAIN","projectId":"TU_PROJECT_ID","storageBucket":"TU_STORAGE_BUCKET","messagingSenderId":"TU_MESSAGING_SENDER_ID","appId":"TU_APP_ID"}
```

**Instrucciones importantes:**

1.  Copia tu objeto `firebaseConfig` que te da la consola de Firebase.
2.  Asegúrate de que esté en **una sola línea** y sin espacios extra.
3.  El `VITE_FIREBASE_CONFIG=` debe estar al principio.

Una vez guardado, reinicia el servidor de desarrollo local (`npm run dev`) si estaba corriendo. La aplicación debería funcionar directamente llevándote al login de Google.

### 2. Configuración en Vercel (Para la App Desplegada)

Este es el paso más importante para que la versión online funcione.

1.  Ve a tu panel de control de Vercel y selecciona tu proyecto `viajefamiliar30dias`.
2.  Navega a la pestaña **Settings** y luego a la sección **Environment Variables**.
3.  Crea **una única variable de entorno**:
    -   **Name:** `VITE_FIREBASE_CONFIG`
    -   **Value:** Pega aquí el mismo objeto JSON de una sola línea que usaste en tu archivo `.env`. Debe empezar con `{` y terminar con `}`.
      ```json
      {"apiKey":"TU_API_KEY","authDomain":"TU_AUTH_DOMAIN","projectId":"TU_PROJECT_ID","storageBucket":"TU_STORAGE_BUCKET","messagingSenderId":"TU_MESSAGING_SENDER_ID","appId":"TU_APP_ID"}
      ```

4.  Guarda los cambios.
5.  Finalmente, ve a la pestaña **Deployments**, busca el último despliegue, haz clic en el menú de los tres puntos (...) y selecciona **Redeploy**. Esto aplicará la nueva variable de entorno.

Con esta configuración, la aplicación funcionará de forma robusta y segura tanto en tu máquina como en Vercel, sin más pasos manuales.
