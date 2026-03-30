# FormAutoFill 📋

Chrome extension to copy and paste form data between any web page.

## What does it do?

Copy a filled form and paste it on another site in seconds. Perfect when you need to fill the same form across different pages or when you lose data due to timeouts.

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **"Load unpacked"**
5. Select the `FORM-AUTO/FormAutoFill` folder

```
📁 FORM-AUTO
  └── FormAutoFill ← select this folder
        ├── background.js
        ├── content.js
        ├── manifest.json
        ├── popup.html
        ├── popup.js
        ├── preview.html
        └── preview.js
```

## How to use

### Method 1: Popup buttons

1. Go to a page with a filled form
2. Click the extension icon
3. Click **"Copy Form"** (📸)
4. Go to another page with a similar form
5. Click **"Paste Form"** (⚡)

### Method 2: Keyboard shortcuts

| Windows/Linux | Mac | Action |
|---------------|-----|--------|
| `Ctrl + Shift + C` | `Cmd + Shift + C` | Copy form |
| `Ctrl + Shift + V` | `Cmd + Shift + V` | Paste form |
| `Ctrl + Shift + P` | `Cmd + Shift + P` | Preview saved data |

## Features

- ✅ Captures all input types (text, email, tel, number, date, etc.)
- ✅ Supports selects, textareas, checkboxes and radios
- ✅ Smart matching between different forms
- ✅ Multilingual dictionary (Spanish/English)
- ✅ Compatible with React, Angular, jQuery and Select2
- ✅ Same-origin iframe support
- ✅ Keyboard shortcuts
- ✅ Preview of saved data
- ✅ Edit values before pasting
- ✅ Visual confirmation animations
- ✅ Zero external dependencies

## Smart Matching

The extension uses a 4-level algorithm to find which destination field corresponds to each copied value:

1. **Exact match** by name, id or dictionary match
2. **Type matching** (if there's only one email field, it uses it directly)
3. **Visual label matching** (aria-label, placeholder, associated label)
4. **Substring matching** (if "name" appears in "full_name")

### Field Dictionary

| Field | Spanish synonyms | English synonyms |
|-------|-----------------|-----------------|
| Email | email, correo, mail | email, mail, e-mail |
| Phone | telefono, celular, móvil | phone, mobile, whatsapp |
| First name | nombre, nombres | name, first |
| Last name | apellido, apellidos | lastname, surname |
| Address | direccion, calle, domicilio | address, street |
| City | ciudad, localidad, municipio | city, town |
| Document | dni, cédula, rut, nit, rfc | id, passport |

## Test Form

The repository includes `test-form.html` with 50+ fields of different types to test the extension.

1. Open `test-form.html` in Chrome
2. Fill the fields manually
3. Use the extension to copy
4. Open another tab with the same form
5. Paste the data

## Supported Data Types

| Type | Description |
|------|-------------|
| `text` | Free text |
| `email` | Email address |
| `tel` | Phone number |
| `password` | Password |
| `number` | Numbers |
| `date` | Dates |
| `datetime-local` | Date and time |
| `time` | Time |
| `color` | Color picker |
| `range` | Range slider |
| `url` | URLs |
| `select` | Dropdowns |
| `select multiple` | Multiple selection lists |
| `textarea` | Text areas |
| `checkbox` | Checkboxes |
| `radio` | Radio buttons |
| `hidden` | Hidden fields (only if they have a value) |

## Project Structure

```
FORM-AUTO/FormAutoFill/
├── manifest.json      # Extension configuration (Manifest V3)
├── background.js      # Service Worker for message handling
├── popup.html         # Main interface
├── popup.js           # Popup logic and injected scripts
├── content.js         # Content script (messaging)
├── preview.html       # Data preview interface
└── preview.js         # Preview logic

test-form.html         # HTML test form
```

## Privacy

- **No data** sent to any server
- **No analytics** or tracking
- Data is stored **locally** in your browser (`chrome.storage.local`)
- Only you have access to your captured data

## Requirements

- Chrome 88+ (Manifest V3 support)

## License

MIT

## Contributions

Issues and pull requests are welcome.

## Author

David Silva
