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
    *   El paso final es desplegar la aplicación para que sea accesible públicamente.
    *   Esto se gestiona desde el panel de Firebase.
    *   URL de Firebase: `https://studio.firebase.google.com/viajefamiliar30dias-36794250`

**Resumen del Flujo:**

`AI Studio -> Commit a GitHub -> Pull en Cloud Workstation (opcional) -> Despliegue en Firebase`
