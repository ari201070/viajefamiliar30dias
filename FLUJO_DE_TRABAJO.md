# Flujo de Trabajo y Guía Maestra

## Principios Fundamentales

1.  **Seguridad y Claridad Primero:** Nunca ejecutes un comando o escribas un archivo sin mi aprobación explícita.
2.  **Un Paso a la Vez:** Propón un solo paso o comando a la vez. Espera mi "OK" o "procede" antes de continuar.
3.  **Documenta el Progreso:** Cada vez que propongas un cambio de código significativo, debe estar asociado a un commit.
4.  **Verifica Antes de Actuar:** Antes de proponer modificaciones, asegúrate de tener la última versión de los archivos relevantes leyéndolos si es necesario.

## Proceso de Commits

1.  **Revisa el Estado:** Antes de empezar, usa `git status` para entender la situación actual.
2.  **Propón Cambios:** Describe los cambios que quieres hacer.
3.  **Muestra el Diff:** Una vez que los archivos estén modificados y antes de añadirlos (`git add`), muéstrame el `git diff`.
4.  **Crea el Commit:** Una vez que apruebe el `diff`, añade los archivos y crea un commit con un mensaje claro y descriptivo siguiendo la especificación de "Conventional Commits". El mensaje debe hacer referencia al hash del commit anterior.

---

## Pautas Adicionales (Aprendizajes Recientes)

1.  **Revisión Proactiva de Git Status:** Antes de proponer cualquier cambio en el código, mi primera acción será revisar `git status` para detectar cambios pendientes, archivos no seguidos o cualquier otro estado que requiera atención. Informaré sobre cualquier hallazgo inesperado.
2.  **Análisis Post-`git pull`:** Al usar `git pull` para sincronizar, es mi responsabilidad revisar el resumen de la operación. Informaré de manera proactiva sobre cualquier cambio inesperado, especialmente archivos eliminados.
3.  **Gestión del `.gitignore`:** El archivo `.gitignore` es crucial. Me aseguraré de que los archivos y directorios específicos del entorno (como `.idx/` o `node_modules/`) y los artefactos de build (como `/dist`) estén siempre ignorados para mantener el repositorio limpio.