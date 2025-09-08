# Flujo de Desarrollo del Proyecto

Este documento describe el flujo de trabajo para el desarrollo y despliegue del proyecto "Viaje Familiar por Argentina".

1.  **Proyecto "Madre" en AI Studio:**
    *   El desarrollo principal y la edición de contenido se realizan en el entorno de AI Studio.
    *   URL: `https://ai.studio/apps/drive/1bqAlm7Cs1Q70sRKmVelIlQz_BAVkn3Zz`

2.  **Sincronización con GitHub:**
    *   Los cambios realizados en AI Studio se guardan y se suben a un repositorio de GitHub.
    *   Esto se hace utilizando la función "Save to GitHub" dentro de AI Studio.
    *   Repositorio: `https://github.com/ari201070/viajefamiliar30dias.git`

3.  **Entorno de Cloud Workstation (este entorno):**
    *   Este entorno es una estación de trabajo en la nube para pruebas, depuración y tareas de desarrollo más complejas.
    *   Para actualizar el código en este entorno, se debe hacer un `git pull` desde el repositorio de GitHub para traer los últimos cambios.
    *   URL de previsualización de este entorno: `https://4175-firebase-viajefamiliar30dias-1757076810021.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev/`

4.  **Despliegue a Producción con Firebase:**
    *   El despliegue se realiza directamente desde la terminal de este entorno de Cloud Workstation.

    **Paso 4.1: Invalidar la Caché del Service Worker**
    *   **IMPORTANTE:** Antes de cada despliegue, para asegurar que los usuarios vean la última versión de la aplicación, es **crucial** invalidar la caché del navegador.
    *   Para ello, abre el archivo `public/sw.js`.
    *   Busca la línea `const CACHE_NAME = 'argentina-familia-cache-vX';` e incrementa el número de la versión (por ejemplo, de `v3` a `v4`).
    *   Guarda el cambio en el archivo y haz un `commit` en Git.

    **Paso 4.2: Ejecutar el Despliegue**
    *   Una vez invalidada la caché y subidos los cambios a GitHub, ejecuta el siguiente comando en la terminal para desplegar la aplicación:
    ```bash
    firebase deploy
    ```
    *   Este comando construirá el proyecto, subirá los archivos a Firebase Hosting y actualizará las Cloud Functions si es necesario.

5.  **Aplicación Web en Producción:**
    *   Esta es la URL pública de la aplicación, visible para los usuarios finales.
    *   URL: `https://viajes-argentina-en-30-dias.web.app`

## Comandos de Git para Sincronizar

Estos son los comandos que debes ejecutar en la terminal de Cloud Workstation para mantener tu código sincronizado con GitHub.

1.  **Ver el estado de tus cambios:**

    ```bash
    git status
    ```

2.  **Traer los últimos cambios de GitHub:**

    ```bash
    git pull
    ```

3.  **Añadir tus cambios al área de preparación:**

    ```bash
    git add .
    ```

4.  **Confirmar tus cambios:**

    ```bash
    git commit -m "Un mensaje descriptivo de tus cambios"
    ```

5.  **Subir tus cambios a GitHub:**

    ```bash
    git push
    ```

### Política de Mensajes de Commit

Para mantener un historial claro, seguro y fácil de auditar, es obligatorio seguir una política estricta para los mensajes de commit.

El mensaje de commit **debe** ser descriptivo y seguir la siguiente estructura:

```
<tipo>(<ámbito>): <asunto>

<cuerpo>

<pie>
```

*   **Tipo:** Define la categoría del cambio (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`).
*   **Ámbito (opcional):** El módulo o parte del código afectado (ej. `functions`, `ui`, `deploy`).
*   **Asunto:** Un resumen conciso del cambio en presente (ej. "Añadir botón de logout").
*   **Cuerpo (opcional pero recomendado):** Una explicación más detallada del *qué* y el *porqué* del cambio.
*   **Pie (obligatorio):** Debe incluir el hash completo del commit anterior para facilitar un posible rollback. Se obtiene con `git rev-parse HEAD` **antes** de hacer el commit.

**Ejemplo de un buen mensaje de commit:**

```
feat(functions): Restaurar Cloud Functions de IA

Se restaura el código de las funciones `sendMessageInChat` y `translateText` que fueron eliminadas accidentalmente durante un despliegue anterior.

Este cambio reintroduce la funcionalidad de chat y traducción en la aplicación.

Commit anterior para rollback: d6aa8e01c64aaf9174a583991ee3a43a18e65cb2
```

### Nota Importante sobre `git push --force`

En situaciones excepcionales, como después de haber usado `git reset --hard` para revertir el repositorio a un estado anterior, el comando `git push` normal fallará. Esto ocurre porque la historia del repositorio local ha sido reescrita y ya no es compatible con la historia del repositorio remoto en GitHub.

En estos casos, y **solo si estás 100% seguro de que la versión de tu repositorio local es la correcta y debe sobreescribir la versión remota**, debes forzar la subida con el siguiente comando:

```bash
git push --force origin main
```

**Advertencia:** Usar `git push --force` es una acción destructiva que puede eliminar cambios hechos por otras personas. Úsalo con extrema precaución y solo cuando sea absolutamente necesario para corregir un error, como en el caso de una reversión con `git reset`.

**Resumen del Flujo:**

`AI Studio -> Commit a GitHub -> Pull en Cloud Workstation -> Incrementar versión en sw.js -> Commit -> Push -> firebase deploy -> URL Pública`
