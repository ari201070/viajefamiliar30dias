# SUPERPROMP - GUÍA MAESTRA DEL PROYECTO
## Argentina Aventura Familiar de 30 Días

### 🎯 PROPÓSITO DE ESTA GUÍA
Este documento es **MI REFERENCIA PRINCIPAL Y ÚNICA** para el desarrollo del proyecto. **DEBO CONSULTAR ESTA GUÍA ANTES DE TOMAR CUALQUIER DECISIÓN** y en caso de conflicto entre instrucciones, **CONSULTAR AL USUARIO**.

---

## I. VISIÓN GENERAL Y OBJETIVOS CLAVE

### Objetivo Principal
Desarrollar una aplicación web interactiva, moderna y completamente funcional para planificar un viaje familiar de 30 días por Argentina.

### Público Objetivo
Familias (pareja + 2 hijos)

### Enfoque Central
- **Comodidad, seguridad y variedad de experiencias familiares**
- **PRIORIDAD ALIMENTARIA**: Siempre incluir opciones aptas para diabéticos, bajas en carbohidratos y sin gluten (sin excluir otras opciones)
- **Funcionamiento crítico**: Online Y offline, especialmente móviles y tablets Android
- **Experiencia premium, intuitiva y funcional**

### Ciudades del Itinerario
Buenos Aires, Rosario, Bariloche, Mendoza, Malargüe, Jujuy, Iguazú, Corrientes, Iberá

---

## II. PILARES FUNDAMENTALES (REGLAS NO NEGOCIABLES)

### A. BILINGÜISMO TOTAL (Español/Hebreo) y RTL
1. **TODO** el texto visible DEBE ser traducible dinámicamente
2. Usar función `t()` de `AppContext` con claves en `constants.ts` (`translations`)
3. Soporte RTL automático para hebreo (`document.documentElement.dir`)
4. Clases Tailwind específicas para RTL (`text-right`, `mr-`, `ml-`, `flex-row-reverse`)
5. Respuestas de IA en idioma de consulta + opción de retraducción
6. **SIN servicios externos** para traducción de UI - solo sistema local

### B. FUNCIONAMIENTO OFFLINE ROBUSTO (PWA)
1. **Service Worker (`sw.js`)** debe cachear TODO eficientemente
2. **Estrategia de caché**:
   - Core Assets: Cache First
   - CDN Assets: Cache First  
   - APIs: Network Only + fallbacks robustos
3. **Fuentes de datos autónomas** (estilo MCP local):
   - Conversor de moneda: `FALLBACK_EXCHANGE_RATES`
   - Respuestas IA: predefinidas útiles
   - Mapas: marcadores locales
4. **Informar claramente** fuente de datos (en vivo/caché/fallback)

### C. UI/UX UNIFICADA Y CONSISTENCIA ABSOLUTA
1. **REGLA DE ORO**: Mismo diseño, estructura y clases en TODAS las páginas
2. Componentes reutilizables: `TopBar.tsx`, `Footer.tsx`, `CityCard.tsx`
3. Tailwind CSS + paleta consistente (índigo, púrpura, esmeralda, teal, gris)
4. Botón "⬅ Volver al Itinerario" siempre presente
5. Estado idioma/moneda persistido en navegación
6. Feedback visual inmediato + transiciones suaves
7. **Mobile-first** responsivo

### D. ACCESIBILIDAD Y SEGURIDAD
1. HTML semántico + ARIA + contraste + teclado
2. API keys NUNCA expuestas (preconfiguradas en env)

---

## III. ESTRUCTURA DEL PROYECTO

### Estructura de Carpetas Actual
```
src/
├── components/ (TopBar, Footer, CityCard, InteractiveMap)
├── pages/ (HomePage, CityDetailPage)
├── config/ (constants.ts, types.ts)
├── contexts/ (AppContext)
├── services/ (apiService.ts)
├── utils/ (markdownParser.ts)
docs/imagenes/[ciudad]/
ciudades/ (.html y .md)
locales/ (es.json, he.json)
```

### Archivos Críticos
- **`constants.ts`**: Fuente de verdad local (CITIES, translations, FALLBACK_EXCHANGE_RATES)
- **`apiService.ts`**: Lógica Gemini + Polygon + fallbacks
- **`App.tsx`**: AppContext + HashRouter + TopBar + Footer
- **`sw.js`**: Caché PWA

---

## IV. FUNCIONALIDADES DETALLADAS

### 1. Conversor de Moneda (HomePage)
- **Monedas**: ARS, USD, EUR, ILS únicamente
- **Jerarquía de fuentes**:
  1. Polygon.io (online + API key)
  2. localStorage caché
  3. FALLBACK_EXCHANGE_RATES
- **Bridge vía USD** si tasa directa falla
- **UI**: Tarjeta dedicada + indicador fuente + botón actualizar
- **Puntos críticos**: ¿Conversión precisa? ¿Manejo offline transparente?

### 2. Consultor IA (Gemini API)
- **Modelo**: `gemini-2.5-flash-preview-04-17`
- **Consulta general** (HomePage) + **específicas** (CityDetailPage)
- **Fallbacks**: Mensajes útiles predefinidos cuando no hay API/conexión
- **Traducción** de respuesta + manejo de idiomas
- **Estados**: Carga/error/éxito claramente visibles

### 3. Mapas Interactivos (Leaflet)
- **Base**: OpenStreetMap
- **Offline**: Marcadores locales persisten + manejo gracioso
- **Popups**: Traducidos dinámicamente

### 4. Lista de Equipaje
- **CRUD** + marcar/desmarcar + persistencia localStorage
- **Tipos**: esenciales/opcionales
- **Traducción automática** vía Gemini (con fallback offline)

### 5. Tabla de Transporte
- **Datos locales**: TRANSPORT_DATA en constants.ts
- **Precios convertidos** a moneda global + indicador fuente tasa

---

## V. PÁGINAS Y COMPONENTES

### HomePage.tsx
- Tarjetas ciudades (CityCard)
- Mapa interactivo general
- Tabla transporte
- Conversor moneda (tarjeta dedicada)
- Lista equipaje
- Consulta IA general
- Análisis itinerario

### CityDetailPage.tsx
- Contenido desde CITIES (constants.ts)
- Markdown parseado
- Mapa específico + POIs
- Consultas IA específicas (menú, alojamiento, consejos, presupuesto)

### TopBar.tsx
- Selectores idioma/moneda
- Navegación consistente
- Botón "Volver al itinerario"

---

## VI. REGLAS DE DESARROLLO

### Entrega y Edición
1. **SIEMPRE** entregar archivos completos, nunca parciales
2. **CONSERVAR** toda estructura y contenido previo
3. **CONSULTAR** ante conflictos entre pedidos
4. **Castellano** para todas las instrucciones

### Traducción y Multilenguaje
1. **TODO** texto debe ser traducible con `t()`
2. **Diccionario completo** en constants.ts
3. **IDs y clases iguales** para traducción consistente
4. **Persistencia** de idioma en navegación
5. **RTL** automático para hebreo

### Herramientas Interactivas
1. **Conversor moneda**: Moderno + tasas reales + fallbacks
2. **Lista equipaje**: CRUD + persistencia + traducción automática
3. **IA**: Manejo errores + respuesta en idioma consulta + fallbacks útiles

### Imágenes y Datos
1. **Imágenes**: docs/imagenes/[ciudad]/ (nombre libre)
2. **Datos locales**: constants.ts como fuente verdad
3. **Documentación**: README en docs/ explicando estructura

---

## VII. FLUJO DE TRABAJO OBLIGATORIO

### Antes de Cualquier Cambio:
1. ✅ **Consultar esta guía**
2. ✅ **Entender pedido completo**
3. ✅ **Verificar consistencia** con pilares fundamentales
4. ✅ **Planificar cambios mínimos**
5. ✅ **Considerar funcionamiento offline**
6. ✅ **Asegurar traducción universal**
7. ✅ **Mantener UI/UX consistente**

### Durante Desarrollo:
1. **Chequeo constante** flujo y UI unificada
2. **Priorizar** funcionamiento offline + fuentes autónomas
3. **Informar** fuente de datos (vivo/caché/fallback)
4. **Probar mentalmente** todas las funcionalidades

### Ante Conflictos:
1. **CONSULTAR AL USUARIO PRIMERO**
2. No tomar decisiones unilaterales
3. Explicar claramente el conflicto detectado

---

## VIII. PUNTOS DE CHEQUEO CRÍTICOS

### Para Cada Funcionalidad:
- [ ] ¿Todo texto es traducible?
- [ ] ¿Funciona offline con fallbacks?
- [ ] ¿UI consistente con resto de app?
- [ ] ¿Persistencia de idioma/moneda?
- [ ] ¿Manejo de errores gracioso?
- [ ] ¿Mobile-first responsivo?
- [ ] ¿Accesibilidad básica?

### Para Cada Página:
- [ ] ¿TopBar con misma estructura?
- [ ] ¿Botón "Volver" funcional?
- [ ] ¿Traducción dinámica completa?
- [ ] ¿Navegación mantiene estado?
- [ ] ¿Imágenes desde estructura correcta?

---

## IX. INTEGRACIÓN MCP Y APIS

### Prioridades:
1. **Datos locales/predefinidos** como base
2. **APIs externas** como mejora (no dependencia)
3. **Fallbacks robustos** siempre presentes
4. **Transparencia** sobre fuente de datos

### APIs Integradas:
- **Gemini**: IA + fallbacks predefinidos útiles
- **Polygon**: Tasas cambio + FALLBACK_EXCHANGE_RATES
- **Leaflet**: Mapas + marcadores locales offline

---

## X. CIUDADES Y CONTENIDO

### Estructura Consistente:
- Introducción + fechas/duración
- Lugares imperdibles + actividades
- **Gastronomía con foco diabético/bajo carbohidrato**
- Alojamiento + agenda eventos
- Presupuesto + consejos familias
- Coordenadas + mapa

### Sincronización:
- .html ↔ .md ↔ docs/[ciudad]/
- Eventos solo para fechas específicas familia
- README.md explicativo en cada carpeta

---

## XI. RECORDATORIOS FINALES

### NUNCA OLVIDAR:
1. **Consultar esta guía ANTES de decidir**
2. **Experiencia familiar premium** como objetivo
3. **Funcionamiento offline robusto** es crítico
4. **Consistencia absoluta** en UI/UX
5. **Traducción universal** sin excepciones
6. **Consultar usuario** ante conflictos

### EN CASO DE DUDA:
**¡PREGUNTAR AL USUARIO ANTES DE PROCEDER!**

---

*Esta guía es la única fuente de verdad para el desarrollo. Cualquier desviación debe ser justificada y aprobada por el usuario.*