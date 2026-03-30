# FormAutoFill 📋

Extensión de Chrome para copiar y pegar formularios de cualquier página web.

## ¿Qué hace?

Copiás un formulario lleno y lo pegás en otro sitio en segundos. Ideal para cuando necesitás llenar el mismo formulario en diferentes páginas o cuando perdés datos por timeouts.

## Instalación

### Desde Chrome Web Store
*(Próximamente)*

### Instalación manual (Developer Mode)

1. Descargá o cloná este repositorio
2. Abrí Chrome e ingresá a `chrome://extensions/`
3. Activá el **Modo de desarrollador** (switch en la esquina superior derecha)
4. Hacé click en **"Cargar extensión sin empaquetar"**
5. Seleccioná la carpeta `FORM-AUTO/FormAutoFill`

```
📁 FORM-AUTO
  └── FormAutoFill ← seleccionar esta carpeta
        ├── background.js
        ├── content.js
        ├── manifest.json
        ├── popup.html
        ├── popup.js
        ├── preview.html
        └── preview.js
```

## Cómo usarlo

### Método 1: Botones del popup

1. Andá a una página con un formulario lleno
2. Click en el ícono de la extensión
3. Click en **"Copiar Formulario"** (📸)
4. Andá a otra página con un formulario similar
5. Click en **"Pegar Formulario"** (⚡)

### Método 2: Atajos de teclado

| Atajo Windows/Linux | Atajo Mac | Acción |
|---------------------|-----------|--------|
| `Ctrl + Shift + C` | `Cmd + Shift + C` | Copiar formulario |
| `Ctrl + Shift + V` | `Cmd + Shift + V` | Pegar formulario |
| `Ctrl + Shift + P` | `Cmd + Shift + P` | Ver datos guardados |

## Características

- ✅ Captura todos los tipos de inputs (text, email, tel, number, date, etc.)
- ✅ Soporte para selects, textareas, checkboxes y radios
- ✅ Matching inteligente entre formularios diferentes
- ✅ Diccionario multilingüe (español/inglés)
- ✅ Compatible con React, Angular, jQuery y Select2
- ✅ Soporte para iframes del mismo origen
- ✅ Atajos de teclado
- ✅ Vista previa de datos guardados
- ✅ Edición de valores antes de pegar
- ✅ Animaciones visuales de confirmación
- ✅ Zero dependencias externas

## Matching inteligente

La extensión usa un algoritmo de 4 niveles para encontrar qué campo en destino corresponde a cada dato copiado:

1. **Match exacto** por name, id o coincidencia en diccionario
2. **Match por tipo** (si hay un solo campo email, lo usa directo)
3. **Match por labels visuales** (aria-label, placeholder, label asociado)
4. **Match por subcadenas** (si "nombre" aparece en "nombre_completo")

### Diccionario de campos

| Campo | Sinónimos en español | Sinónimos en inglés |
|-------|---------------------|-------------------|
| Correo | email, correo, mail | email, mail, e-mail |
| Teléfono | telefono, celular, móvil | phone, mobile, whatsapp |
| Nombre | nombre, nombres | name, first |
| Apellido | apellido, apellidos | lastname, surname |
| Dirección | direccion, calle, domicilio | address, street |
| Ciudad | ciudad, localidad, municipio | city, town |
| Documento | dni, cédula, rut, nit, rfc | id, passport |

## Formulario de prueba

El repositorio incluye `formulario-prueba.html` con 50+ campos de diferentes tipos para testear la extensión.

1. Abrí `formulario-prueba.html` en Chrome
2. Completá los campos manualmente
3. Usá la extensión para copiar
4. Abrí otra pestaña con el mismo formulario
5. Pegá los datos

## Tipos de datos soportados

| Tipo | Descripción |
|------|-------------|
| `text` | Texto libre |
| `email` | Correo electrónico |
| `tel` | Teléfono |
| `password` | Contraseña |
| `number` | Números |
| `date` | Fechas |
| `datetime-local` | Fecha y hora |
| `time` | Hora |
| `color` | Selector de color |
| `range` | Rango |
| `url` | URLs |
| `select` | Listas desplegables |
| `select multiple` | Listas con selección múltiple |
| `textarea` | Áreas de texto |
| `checkbox` | Casillas de verificación |
| `radio` | Botones de opción |
| `hidden` | Campos ocultos (solo si tienen valor) |

## Estructura del proyecto

```
FORM-AUTO/FormAutoFill/
├── manifest.json      # Configuración de la extensión (Manifest V3)
├── background.js      # Service Worker para manejo de mensajes
├── popup.html         # Interfaz principal
├── popup.js           # Lógica del popup y scripts inyectados
├── content.js         # Script de contenido (messaging)
├── preview.html       # Vista previa de datos guardados
└── preview.js         # Lógica de la vista previa

formulario-prueba.html # Formulario HTML de prueba
```

## Privacidad

- **No envía datos** a ningún servidor
- **No usa analytics** ni tracking
- Los datos se guardan **localmente** en tu navegador (`chrome.storage.local`)
- Solo vos tenés acceso a tus datos capturados

## Requisitos

- Chrome 88+ (soporte para Manifest V3)

## Licencia

MIT

## Contribuciones

Las issues y pull requests son bienvenidas.

## Autor

David Silva
