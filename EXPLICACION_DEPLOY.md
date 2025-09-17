# Explicación sobre el Despliegue y Variables de Entorno (.env)

Hola, este archivo contiene la explicación detallada sobre por qué tu archivo `.env` no se sube a GitHub y cómo configurar correctamente tu proyecto en Vercel para que funcione sin problemas.

## ¿Por Qué "Desaparece" tu Archivo `.env`?

En realidad, `git` no está borrando tu archivo. El problema es una combinación de cómo funciona Git y cómo las plataformas de despliegue como Vercel manejan las "variables de entorno" (tus claves de API).

1.  **Seguridad primero:** El archivo `.env` contiene secretos (como tu `API_KEY`). **Nunca** debe subirse a un repositorio de GitHub, ni público ni privado. Para asegurar esto, se usa un archivo especial llamado `.gitignore`, que le dice a Git "ignora este archivo, no le des seguimiento". Esto es una práctica de seguridad fundamental.

2.  **Desarrollo Local vs. Producción (Vercel):**
    *   **En tu computadora (Local):** El archivo `.env` funciona perfectamente. Tu entorno de desarrollo lo lee y tu app se conecta a la API.
    *   **En Vercel (Producción):** Cuando Vercel despliega tu proyecto, clona tu repositorio de GitHub. Como el `.env` no está en el repositorio (¡y no debe estarlo!), Vercel no lo encuentra. Por eso la app desplegada no puede conectarse.

La solución no es forzar a Git a subir el archivo `.env`, sino darle a Vercel las claves de API de una manera segura.

## La Solución Profesional (Paso a Paso)

Para solucionar esto de raíz y seguir las mejores prácticas, se realizaron los siguientes cambios en tu proyecto:

1.  **Creación de `.gitignore`:** Se añadió un archivo `.gitignore` con la línea `.env` para asegurar que nunca más subas tus secretos a GitHub por accidente.
2.  **Creación de `.env.example`:** Este es un archivo de ejemplo. Sirve como una "plantilla" para que cualquiera (incluido tú en el futuro) sepa qué variables necesita el proyecto para funcionar. No contiene las claves reales.

### Tu Siguiente Paso: Configurar Vercel (¡El más importante!)

Ahora solo necesitas decirle a Vercel cuáles son tus claves de API de forma segura a través de su interfaz.

1.  Ve a tu panel de control de Vercel y selecciona tu proyecto `viajefamiliar30dias`.
2.  Navega a la pestaña **Settings** y luego a la sección **Environment Variables**.
3.  Crea dos nuevas variables:
    *   **Variable 1:**
        *   **Name:** `VITE_API_KEY`
        *   **Value:** `[Pega aquí tu clave de API de Gemini]`
    *   **Variable 2:**
        *   **Name:** `VITE_POLYGON_API_KEY`
        *   **Value:** `[Pega aquí tu clave de API de Polygon.io]`
4.  Guarda los cambios.
5.  Finalmente, ve a la pestaña **Deployments**, busca el último despliegue y haz clic en el menú de los tres puntos (...) y selecciona **Redeploy** para que los cambios surtan efecto.

¡Y listo! Con esto, tu aplicación funcionará perfectamente tanto en tu máquina como en Vercel, y tus claves de API estarán siempre seguras.
