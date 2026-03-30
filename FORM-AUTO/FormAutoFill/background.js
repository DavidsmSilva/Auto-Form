// background.js - Service Worker para Manifest V3
// Maneja la comunicación entre content scripts y chrome.storage

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SAVE_FORM_DATA') {
    chrome.storage.local.set({ formData: message.data }, () => {
      chrome.runtime.sendMessage({ action: 'DATA_UPDATED' }).catch(() => {});
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.action === 'GET_FORM_DATA') {
    chrome.storage.local.get('formData', (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (message.action === 'CLEAR_FORM_DATA') {
    chrome.storage.local.remove(['formData', 'captureState'], () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.action === 'PING') {
    sendResponse({ ok: true });
    return false;
  }
});

// =========================================================
// MANEJO DE ATAJOS DE TECLADO
// =========================================================
chrome.commands.onCommand.addListener(async (command) => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    if (command === 'copy-form') {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: inyectarCopiaInstantanea
      });
    } 
    else if (command === 'paste-form') {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: inyectarPegadoInstantaneo
      });
    }
    else if (command === 'show-preview') {
      chrome.tabs.create({ url: 'preview.html' });
    }
  } catch (error) {
    console.error('Error ejecutando comando:', error);
  }
});

// =========================================================
// SCRIPT INYECTADO: COPIAR FORMULARIO
// =========================================================
function inyectarCopiaInstantanea() {
  function obtenerLabel(el) {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    if (el.id) {
      const lbl = document.querySelector('label[for="' + el.id + '"]');
      if (lbl) return lbl.textContent.trim();
    }
    const parent = el.closest('label');
    if (parent) return parent.textContent.trim();
    if (el.getAttribute('aria-labelledby')) {
      const labeledBy = document.getElementById(el.getAttribute('aria-labelledby'));
      if (labeledBy) return labeledBy.textContent.trim();
    }
    if (el.getAttribute('data-label')) return el.getAttribute('data-label').trim();
    const prev = el.previousElementSibling;
    if (prev && ['LABEL', 'SPAN', 'P', 'DIV', 'STRONG', 'B', 'TD', 'TH'].includes(prev.tagName)) {
      return prev.textContent.trim().replace(/\s*\*\s*$/, '').trim();
    }
    if (el.placeholder) return el.placeholder.trim();
    return '';
  }

  function obtenerOpcionesSelect(select) {
    const opciones = [];
    for (let opt of select.options) {
      if (opt.value) opciones.push({ value: opt.value, text: opt.text.trim(), selected: opt.selected });
    }
    return opciones;
  }

  function esVisible(el) {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    return true;
  }

  function mostrarBadge(msg, tipo) {
    const badgeId = 'faf-badge-' + tipo;
    let badge = document.getElementById(badgeId);
    if (badge) badge.remove();
    badge = document.createElement('div');
    badge.id = badgeId;
    const bgColor = tipo === 'copy' ? '#10B981' : tipo === 'error' ? '#EF4444' : '#3B82F6';
    badge.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:' + bgColor + ';color:white;padding:12px 20px;border-radius:10px;font-family:-apple-system,sans-serif;font-weight:600;font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.3s, transform 0.3s;pointer-events:none;transform:translateY(10px);max-width:300px;word-wrap:break-word;';
    document.body.appendChild(badge);
    badge.textContent = msg;
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
    setTimeout(() => { 
      badge.style.opacity = '0'; 
      badge.style.transform = 'translateY(10px)'; 
      setTimeout(() => badge.remove(), 300);
    }, 4000);
  }

  const campos = document.querySelectorAll(`
    input:not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]),
    select, textarea
  `);
  
  const datosCapturados = [];
  const seen = new Set();

  campos.forEach(campo => {
    if (campo.disabled && campo.type !== 'checkbox' && campo.type !== 'radio') return;
    if (!campo.value && campo.type !== 'checkbox' && campo.type !== 'radio') return;
    if ((campo.type === 'checkbox' || campo.type === 'radio') && !campo.checked) return;
    if (campo.type === 'hidden' && !campo.value) return;
    if (campo.type !== 'hidden' && !esVisible(campo)) return;

    const key = `${campo.name || ''}_${campo.id || ''}_${campo.type}`;
    if (seen.has(key) && campo.type !== 'checkbox' && campo.type !== 'radio') return;
    seen.add(key);

    const fieldData = {
      name: campo.name || '',
      id: campo.id || '',
      type: campo.type,
      tagName: campo.tagName.toLowerCase()
    };

    if (campo.type === 'checkbox' || campo.type === 'radio') {
      fieldData.value = campo.checked;
    } else if (campo.tagName.toLowerCase() === 'select') {
      fieldData.value = campo.value;
      fieldData.options = obtenerOpcionesSelect(campo);
      fieldData.multiple = campo.multiple;
    } else {
      fieldData.value = campo.value;
    }

    fieldData.label = obtenerLabel(campo);
    fieldData.placeholder = campo.placeholder || '';
    fieldData.required = campo.required || false;
    
    if (campo.tagName.toLowerCase() === 'select' && campo.selectedOptions[0]) {
      fieldData.selectedText = campo.selectedOptions[0].text.trim();
    }

    datosCapturados.push(fieldData);
  });

  // Iframes del mismo origen
  try {
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const iframeFields = iframeDoc.querySelectorAll(`input:not([type="file"]):not([type="submit"]):not([type="button"]), select, textarea`);
        for (const campo of iframeFields) {
          if (!campo.value && campo.type !== 'checkbox' && campo.type !== 'radio') continue;
          if ((campo.type === 'checkbox' || campo.type === 'radio') && !campo.checked) continue;
          datosCapturados.push({
            name: campo.name || '', id: campo.id || '', type: campo.type,
            value: campo.type === 'checkbox' || campo.type === 'radio' ? campo.checked : campo.value,
            label: '[iframe] ' + obtenerLabel(campo), tagName: campo.tagName.toLowerCase(), isIframe: true
          });
        }
      } catch (e) {}
    }
  } catch (e) {}

  console.log('[FormAutoFill] Capturados:', datosCapturados.length, 'campos');

  chrome.runtime.sendMessage({ action: 'SAVE_FORM_DATA', data: datosCapturados }, (response) => {
    if (chrome.runtime.lastError) {
      mostrarBadge('❌ Error: ' + chrome.runtime.lastError.message, 'error');
    } else {
      const msg = datosCapturados.length === 0 ? '⚠️ No se encontraron campos' : `📸 ¡Captura lista! ${datosCapturados.length} campos`;
      mostrarBadge(msg, 'copy');
    }
  });
}

// =========================================================
// SCRIPT INYECTADO: PEGAR FORMULARIO
// =========================================================
function inyectarPegadoInstantaneo() {
  function obtenerLabel(el) {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    if (el.id) {
      const lbl = document.querySelector('label[for="' + el.id + '"]');
      if (lbl) return lbl.textContent.trim();
    }
    const parent = el.closest('label');
    if (parent) return parent.textContent.trim();
    if (el.getAttribute('aria-labelledby')) {
      const labeledBy = document.getElementById(el.getAttribute('aria-labelledby'));
      if (labeledBy) return labeledBy.textContent.trim();
    }
    const prev = el.previousElementSibling;
    if (prev && ['LABEL', 'SPAN', 'P', 'DIV'].includes(prev.tagName)) return prev.textContent.trim();
    if (el.placeholder) return el.placeholder.trim();
    return '';
  }

  function mostrarBadge(msg, color) {
    let badge = document.getElementById('faf-badge-paste');
    if (badge) badge.remove();
    badge = document.createElement('div');
    badge.id = 'faf-badge-paste';
    badge.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:' + color + ';color:white;padding:12px 20px;border-radius:10px;font-family:-apple-system,sans-serif;font-weight:600;font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.3s, transform 0.3s;pointer-events:none;transform:translateY(10px);max-width:320px;word-wrap:break-word;';
    document.body.appendChild(badge);
    badge.textContent = msg;
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
    setTimeout(() => { badge.style.opacity = '0'; badge.style.transform = 'translateY(10px)'; setTimeout(() => badge.remove(), 300); }, 4000);
  }

  function encontrarCoincidencia(saved, fields) {
    const normalize = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    const sName = normalize(saved.name);
    const sId = normalize(saved.id);
    const sLabel = normalize(saved.label);
    const sPlaceholder = normalize(saved.placeholder);
    const sType = (saved.type || '').toLowerCase();

    const diccionario = {
      correo: ['email', 'correo', 'mail', 'e-mail'],
      telefono: ['telefono', 'phone', 'celular', 'mobile', 'whatsapp', 'tel', 'movil'],
      nombre: ['nombre', 'name', 'first', 'nombres'],
      apellido: ['apellido', 'lastname', 'last', 'surname', 'apellidos'],
      direccion: ['direccion', 'address', 'calle', 'street', 'domicilio'],
      ciudad: ['ciudad', 'city', 'poblacion', 'localidad', 'municipio', 'town'],
      estado: ['estado', 'provincia', 'state', 'region', 'departamento', 'province'],
      codigo_postal: ['postal', 'zip', 'zipcode', 'codigo', 'cp'],
      pais: ['pais', 'country', 'nacion', 'nation'],
      empresa: ['empresa', 'company', 'organizacion', 'business', 'compania', 'org'],
      documento: ['dni', 'cedula', 'documento', 'rut', 'nit', 'rfc', 'identificacion', 'id', 'passport', 'pasaporte'],
      fecha: ['fecha', 'date', 'nacimiento', 'cumpleaños', 'birthday'],
      password: ['password', 'contraseña', 'clave', 'pass', 'contrasena']
    };

    function coincideDiccionario(valTarget, valSaved) {
      if (!valTarget || !valSaved) return false;
      for (let key in diccionario) {
        let keywords = diccionario[key];
        if (keywords.some(k => valSaved.includes(k)) && keywords.some(k => valTarget.includes(k))) return true;
      }
      return false;
    }

    // 1. Match exacto
    let m = fields.find(f => {
      const fName = normalize(f.name);
      const fId = normalize(f.id);
      if ((fName && sName && fName === sName) || (fId && sId && fId === sId)) return true;
      if (coincideDiccionario(fName, sName) || coincideDiccionario(fId, sId)) return true;
      if (coincideDiccionario(fName, sLabel) || coincideDiccionario(fId, sLabel)) return true;
      return false;
    });
    if (m) return m;

    // 2. Por tipo (email, tel)
    if (sType === 'email') { let emails = fields.filter(f => f.type === 'email'); if (emails.length === 1) return emails[0]; }
    if (sType === 'tel') { let tels = fields.filter(f => f.type === 'tel'); if (tels.length === 1) return tels[0]; }

    // 3. Por label
    m = fields.find(f => {
      const fLabel = normalize(obtenerLabel(f));
      const fPl = normalize(f.placeholder);
      if (coincideDiccionario(fLabel, sLabel) || coincideDiccionario(fPl, sPlaceholder)) return true;
      if (coincideDiccionario(fLabel, sName) || coincideDiccionario(fPl, sName)) return true;
      return false;
    });
    if (m) return m;

    // 4. Subcadenas
    m = fields.find(f => {
      const fName = normalize(f.name);
      const fId = normalize(f.id);
      const fLabel = normalize(obtenerLabel(f));
      const subMatch = (t, s) => { if (!t || !s || t.length < 3 || s.length < 3) return false; return t.includes(s) || s.includes(t); };
      return subMatch(fName, sName) || subMatch(fId, sId) || subMatch(fLabel, sLabel) || subMatch(fLabel, sName);
    });

    return m || null;
  }

  chrome.runtime.sendMessage({ action: 'GET_FORM_DATA' }, (data) => {
    if (!data.formData || data.formData.length === 0) {
      mostrarBadge('❌ No hay datos en memoria', '#EF4444');
      return;
    }

    const campos = document.querySelectorAll(`input:not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea`);
    let camposDisponibles = Array.from(campos);
    const saved = data.formData;
    let count = 0;

    saved.forEach(s => {
      if (!s.value && s.type !== 'checkbox' && s.type !== 'radio') return;
      const target = encontrarCoincidencia(s, camposDisponibles);
      
      if (target) {
        camposDisponibles = camposDisponibles.filter(c => c !== target);

        const reactSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        const angularSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        const selectSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
        
        const type = target.tagName.toLowerCase();
        
        try {
          if (type === 'select' && target.multiple && s.options) {
            for (let opt of target.options) opt.selected = false;
            for (let opt of target.options) {
              if (opt.value === s.value || opt.text === s.selectedText) opt.selected = true;
            }
          }
          else if (type === 'select' && selectSetter) selectSetter.call(target, s.value);
          else if (type === 'textarea' && angularSetter) angularSetter.call(target, s.value);
          else if (type === 'input' && reactSetter) reactSetter.call(target, s.value);
          else target.value = s.value;
        } catch(e) { target.value = s.value; }

        if (target.type === 'checkbox' || target.type === 'radio') target.checked = !!s.value;

        // Animación
        const originalBg = target.style.backgroundColor;
        target.style.transition = 'background-color 0.5s ease';
        target.style.backgroundColor = '#D1FAE5';
        setTimeout(() => { target.style.backgroundColor = originalBg; }, 1000);

        // Eventos
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
        target.dispatchEvent(new CustomEvent('select2:select', { bubbles: true }));
        target.dispatchEvent(new CustomEvent('select2:change', { bubbles: true }));
        target.dispatchEvent(new Event('blur', { bubbles: true }));
        
        count++;
      }
    });

    if (count > 0) mostrarBadge(`⚡ ¡Pegados ${count} de ${saved.length}!`);
    else mostrarBadge('⚠️ Ningún campo coincide', '#F59E0B');
  });
}
