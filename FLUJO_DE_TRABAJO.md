# Flujo de Trabajo: AI Studio -> Cloud Workstation -> Firebase

Este documento describe el proceso para desarrollar en AI Studio, sincronizar el código con Cloud Workstation y desplegar la aplicación en Firebase.

## Configuración Inicial

### 1. En AI Studio

*   **Ya estás aquí.** Este es tu entorno de desarrollo principal.

### 2. En Cloud Workstation (si necesitas un entorno de desarrollo en la nube)

1.  **Clona el repositorio de GitHub:**

    ```bash
    git clone https://github.com/ari201070/viajefamiliar30dias.git
    cd viajefamiliar30dias
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

### 3. En Firebase

1.  **Asegúrate de tener Firebase CLI:** Si no lo tienes, instálalo:

    ```bash
    npm install -g firebase-tools
    ```

2.  **Inicia sesión en Firebase:**

    ```bash
    firebase login
    ```

3.  **Selecciona tu proyecto de Firebase:**

    ```bash
    firebase use --add
    ```
    Y elige el proyecto correspondiente de la lista.

## Ciclo de Desarrollo

El flujo de trabajo se basa en hacer cambios en AI Studio y subirlos a GitHub. Opcionalmente, puedes bajar esos cambios a Cloud Workstation para continuar trabajando o para desplegar.

### Pasos

1.  **Haz tus cambios en AI Studio.**

2.  **Sincroniza tus cambios con el repositorio remoto (GitHub):**

    Primero, obtén los últimos cambios del servidor:
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

**Resumen del Flujo:**

`AI Studio -> Commit a GitHub -> Pull en Cloud Workstation (opcional) -> Despliegue en Firebase`

**Resumen del Flujo con URLs:**

`AI Studio (Desarrollo Local) -> Commit a GitHub (https://github.com/ari201070/viajefamiliar30dias) -> Pull en Cloud Workstation (Opcional) -> Despliegue a Firebase (https://viajes-argentina-en-30-dias.web.app/)`
