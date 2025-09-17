# Guía de Despliegue y Variables de Entorno (Actualizado)

Hola, este archivo explica cómo configurar las claves de API (variables de entorno) para que tu aplicación funcione tanto en tu computadora como en Vercel.

## El Problema: Local vs. Producción

El problema que experimentaste, donde la app funciona localmente pero no en Vercel, es muy común. Se debe a cómo se manejan las "variables de entorno" (tus claves de API secretas).

-   **Localmente:** Usas un archivo `.env` que contiene tus claves. Tu entorno de desarrollo lo lee y todo funciona.
-   **En Vercel:** Vercel no tiene acceso a tu archivo `.env` (¡y no debería, por seguridad!). Necesita que le proporciones las claves de otra manera.

## La Solución: Separar Variables de Backend y Frontend

Para solucionar esto de forma robusta, hemos separado las variables del backend (servidor) de las del frontend (navegador).

-   Las variables del **backend** (nuestra función `api/proxy.js`) ahora usarán nombres directos, sin prefijos. Son las que necesita el servidor para funcionar.
-   Las variables del **frontend** (si las hubiera) usarían el prefijo `VITE_` para ser accesibles en el navegador. En nuestro caso, no tenemos ninguna, ya que todas las llamadas a las APIs se hacen de forma segura a través del proxy.

Este cambio hace el proyecto más seguro, claro y compatible con la forma en que Vercel trabaja.

---

## **Acción Requerida: Tu Configuración (Local y Vercel)**

### 1. Actualiza tu Archivo `.env` Local

Para que la aplicación siga funcionando en tu computadora, abre tu archivo `.env` y **cambia los nombres de las variables** así:

```env
# Cambia esto:
VITE_API_KEY=tu_clave_de_gemini
VITE_POLYGON_API_KEY=tu_clave_de_polygon
VITE_OPENWEATHER_API_KEY=tu_clave_de_openweathermap

# A esto (sin el prefijo VITE_ y con el nuevo nombre para Gemini):
GEMINI_API_KEY=tu_clave_de_gemini
POLYGON_API_KEY=tu_clave_de_polygon
OPENWEATHER_API_KEY=tu_clave_de_openweathermap
```

### 2. Configura las Nuevas Variables en Vercel (Paso Clave)

Ahora, haz lo mismo en Vercel para que tu app desplegada funcione:

1.  Ve a tu panel de control de Vercel y selecciona tu proyecto `viajefamiliar30dias`.
2.  Navega a la pestaña **Settings** y luego a la sección **Environment Variables**.
3.  **Elimina las variables antiguas** (`VITE_API_KEY`, `VITE_POLYGON_API_KEY`, `VITE_OPENWEATHER_API_KEY`) si existen.
4.  Crea **tres nuevas variables** con los nombres corregidos:
    *   **Variable 1 (Gemini):**
        *   **Name:** `GEMINI_API_KEY`
        *   **Value:** `[Pega aquí tu clave de API de Gemini]`
    *   **Variable 2 (Polygon):**
        *   **Name:** `POLYGON_API_KEY`
        *   **Value:** `[Pega aquí tu clave de API de Polygon.io]`
    *   **Variable 3 (OpenWeather):**
        *   **Name:** `OPENWEATHER_API_KEY`
        *   **Value:** `[Pega aquí tu clave de API de OpenWeatherMap]`

5.  Guarda los cambios.
6.  Finalmente, ve a la pestaña **Deployments**, busca el último despliegue y haz clic en el menú de los tres puntos (...) y selecciona **Redeploy** para que los cambios surtan efecto.

¡Y listo! Con esta configuración, tu aplicación funcionará perfectamente en ambos entornos y tus claves estarán seguras.