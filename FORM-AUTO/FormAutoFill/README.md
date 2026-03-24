# 📋 FormAutoFill - Extensión de Chrome para Auto-rellenar Formularios

## ¿Qué es FormAutoFill?

FormAutoFill es una extensión de navegador que te permite **copiar automáticamente los datos de un formulario** y **pegarlos en otro formulario** con un solo clic. Funciona en **cualquier sitio web** sin importar su estructura.

---

## ✅ Navegadores Compatibles

| Navegador | Estado |
|-----------|--------|
| Google Chrome | ✅ Compatible |
| Microsoft Edge | ✅ Compatible |
| Opera | ✅ Compatible |
| Brave | ✅ Compatible |

---

## 🚀 Instalación (Paso a Paso)

### Paso 1: Abrir la página de extensiones
Abre Chrome (o Edge/Opera/Brave) y escribe en la barra de direcciones:

```
chrome://extensions/
```

### Paso 2: Activar el Modo Desarrollador
En la esquina **superior derecha** de la página, activa el switch que dice **"Modo de desarrollador"**.

### Paso 3: Cargar la extensión
Haz clic en el botón **"Cargar descomprimida"** (en inglés: "Load unpacked").

### Paso 4: Seleccionar la carpeta
Navega hasta la carpeta donde descargaste la extensión y selecciona la carpeta **FormAutoFill**.

### Paso 5: Confirmar
La extensión aparecerá en tu lista de extensiones activas. Verás el ícono 📋 en la barra de herramientas del navegador.

> **Nota:** Si no ves el ícono, haz clic en el icono de piezas de rompecabezas (🧩) en la barra de herramientas y fija **FormAutoFill** para que siempre sea visible.

---

## 🎯 ¿Cómo Funciona?

La extensión tiene un flujo muy simple de 3 pasos:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PASO 1: Presionas "Nuevo Formulario"                   │
│          La extensión empieza a ESCUCHAR                │
│                                                         │
│  PASO 2: Llenas el formulario en la web NORMALMENTE     │
│          La extensión CAPTURA los datos automáticamente │
│                                                         │
│  PASO 3: Vas a otro formulario y presionas "Llenar"     │
│          Los datos se PEGAN solos                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ Interfaz de la Extensión

Al hacer clic en el ícono de la extensión aparece este panel:

```
┌──────────────────────────────┐
│  📋 FormAutoFill             │
│  Copia y pega formularios    │
│  ────────────────────────    │
│                              │
│  🔄 Nuevo Formulario         │  ← Activa el modo captura
│  👁️ Ver Preview              │  ← Revisa los datos guardados
│  📝 Llenar Formulario        │  ← Pega los datos en la página
│                              │
│  ────────────────────────    │
│  Estado:                     │
│  Modo: Capturando ●          │  ← Indicador de estado
│  Capturados: 8 campos        │
│  Origen: midominio.com       │
│  🗑️ Borrar todos los datos   │
└──────────────────────────────┘
```

### Botones Explicados

| Botón | Función |
|-------|---------|
| 🔄 **Nuevo Formulario** | Activa el modo de captura. La extensión empieza a guardar los datos que escribas en los campos del formulario. |
| 👁️ **Ver Preview** | Abre una nueva pestaña mostrando todos los datos que se han capturado. Puedes revisarlos y editarlos antes de pegarlos. |
| 📝 **Llenar Formulario** | Pega automáticamente los datos capturados en los campos del formulario de la página actual. |
| 🗑️ **Borrar todos los datos** | Elimina todos los datos guardados y reinicia la extensión para un nuevo formulario. |

---

## 📋 Guía de Uso Detallada

### Ejemplo Práctico: Copiar datos de un formulario de registro

#### Escenario:
Tienes un formulario largo en la **Página A** que ya llenaste. Quieres copiar esos datos a un formulario similar en la **Página B**.

#### Pasos:

**En la Página A (donde ya llenaste el formulario):**

1. Haz clic en el ícono de la extensión 📋
2. Presiona el botón **"🔄 Nuevo Formulario"**
3. La extensión mostrará: "Modo: Capturando ●"
4. **No necesitas hacer nada más.** Si ya tenías el formulario llenado, la extensión detecta los valores existentes.
5. Si llenaste el formulario después de activar la captura, cada vez que escribas en un campo aparecerá un aviso:
   > ✅ 3 campo(s) capturado(s)
6. Puedes verificar los datos presionando **"👁️ Ver Preview"**

**En la Página B (donde quieres pegar los datos):**

1. Abre el formulario vacío
2. Haz clic en el ícono de la extensión 📋
3. Presiona **"📝 Llenar Formulario"**
4. Los campos se llenarán automáticamente
5. Verás un aviso:
   > ✅ 8/10 campos llenados

**Para empezar de nuevo:**

1. Haz clic en el ícono de la extensión 📋
2. Presiona **"🗑️ Borrar todos los datos"**
3. Confirma la acción
4. La extensión está lista para un nuevo formulario

---

## 👁️ Vista Previa (Preview)

La vista previa te permite:

- **Ver** todos los datos capturados en una tabla organizada
- **Editar** cualquier valor antes de pegarlo
- **Confirmar** que los datos son correctos

```
┌────────────────────────────────────────────────┐
│  👁️ Preview de Datos                           │
│  Revisa los datos antes de pegarlos            │
├────────────────────────────────────────────────┤
│  Campo           │ Valor           │ Tipo      │
│  ───────────────┼────────────────┼────────── │
│  nombre          │ Juan Pérez      │ text      │
│  email           │ juan@mail.com   │ email     │
│  telefono        │ 555-1234567     │ tel       │
│  ciudad          │ Bogotá          │ text      │
├────────────────────────────────────────────────┤
│  4 campos capturados    ✏️ Editar  ✅ Listo    │
└────────────────────────────────────────────────┘
```

---

## 🔍 ¿Qué Campos Detecta?

La extensión detecta y captura los siguientes tipos de campos:

| Tipo de Campo | Ejemplo | Detectado |
|--------------|---------|-----------|
| Texto | Nombre, Dirección | ✅ |
| Email | Correo electrónico | ✅ |
| Número | Teléfono, Cédula | ✅ |
| Contraseña | Password | ✅ |
| Textarea | Comentarios, Descripción | ✅ |
| Select (Dropdown) | País, Ciudad, Categoría | ✅ |
| Checkbox | Acepto términos | ✅ |
| Radio | Opción A, Opción B | ✅ |
| Fecha | Fecha de nacimiento | ✅ |
| Hidden (oculto) | Tokens, IDs internos | ❌ No captura |
| File (archivo) | Subir documento | ❌ No captura |

---

## 🧠 ¿Cómo Encuentra los Campos Correctos?

La extensión usa un algoritmo inteligente de matching que busca coincidencias en este orden de prioridad:

```
Prioridad 1: Nombre exacto del campo
             Ej: "email" coincide con "email"

Prioridad 2: ID exacto del campo
             Ej: "user-email" coincide con "user-email"

Prioridad 3: Placeholder igual
             Ej: "Ingrese su correo" coincide con "Ingrese su correo"

Prioridad 4: Mismo tipo de campo
             Ej: Campo de tipo "email" coincide con otro campo "email"
```

---

## 🔔 Notificaciones Visuales

Cuando la extensión está activa, verás un **aviso flotante** en la esquina inferior derecha de la página:

| Aviso | Significado |
|-------|------------|
| 🔄 Captura activada. Llena el formulario normalmente. | El modo captura se activó correctamente |
| ✅ 5 campo(s) capturado(s) | Se guardaron 5 campos con valores |
| ✅ 8/10 campos llenados | Se pegaron 8 de 10 campos en el formulario |
| ❌ No hay datos guardados | Intentaste llenar sin haber capturado antes |

---

## 🛡️ Privacidad y Seguridad

- **100% local:** Todos los datos se guardan en tu navegador usando `chrome.storage.local`. No se envían a ningún servidor.
- **Sin internet:** La extensión funciona completamente sin conexión a internet.
- **Sin cuentas:** No necesitas registrarte ni iniciar sesión.
- **Control total:** Tú decides cuándo borrar los datos con el botón "🗑️ Borrar todos los datos".
- **Sin rastreo:** La extensión no recopila ni transmite ninguna información.

---

## ⚠️ Limitaciones Conocidas

| Situación | Comportamiento |
|-----------|----------------|
| Formularios idénticos (misma estructura) | ✅ Funciona perfecto |
| Formularios similares (nombres diferentes) | ✅ Funciona por coincidencia de nombre/placeholder |
| Formularios muy diferentes | ⚠️ Puede no encontrar todos los campos |
| Formularios dentro de iframes de otro dominio | ❌ No soportado (limitación del navegador) |
| Campos generados dinámicamente después de activar | ✅ Detectados automáticamente |
| Múltiples formularios en una misma página | ⚠️ Captura campos de TODOS los formularios |

---

## 🔧 Solución de Problemas

### La extensión no aparece en la barra de herramientas
- Haz clic en el icono de piezas de rompecabezas (🧩)
- Busca "FormAutoFill" en la lista
- Haz clic en el icono de pin (📌) para fijarlo

### No se capturan los datos
- Asegúrate de haber presionado **"Nuevo Formulario"** primero
- El indicador debe mostrar **"Modo: Capturando ●"** (punto verde parpadeando)
- Los campos ocultos (hidden) y de archivo (file) no se capturan

### Los datos no se pegan correctamente
- Verifica que los formularios tengan campos similares
- Abre **"Ver Preview"** para confirmar que los datos están guardados
- Los nombres de los campos deben coincidir o ser similares

### La extensión dejó de funcionar después de actualizar Chrome
- Ve a `chrome://extensions/`
- Busca "FormAutoFill"
- Haz clic en el icono de actualizar (🔄)

---

## 📁 Estructura de Archivos

```
FormAutoFill/
├── manifest.json      → Configuración de la extensión
├── popup.html         → Diseño visual del panel de la extensión
├── popup.js           → Lógica de los botones y comunicación
├── content.js         → Script que se ejecuta en las páginas web
├── preview.html       → Diseño de la página de vista previa
├── preview.js         → Lógica de la vista previa y edición
└── README.md          → Este documento
```

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Verifica la sección **"Solución de Problemas"** de este documento
2. Revisa que estés usando un navegador compatible (Chrome, Edge, Opera, Brave)
3. Asegúrate de tener la última versión de la extensión

---

## 📝 Versión

- **Versión:** 1.0
- **Última actualización:** Marzo 2026
- **Tamaño:** ~25 KB
- **Licencia:** Uso interno
