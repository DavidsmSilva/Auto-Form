document.addEventListener('DOMContentLoaded', () => {
  actualizarEstado();

  document.getElementById('btnCopy').addEventListener('click', copiarFormulario);
  document.getElementById('btnPreview').addEventListener('click', verPreview);
  document.getElementById('btnFill').addEventListener('click', llenarFormulario);
  document.getElementById('btnDelete').addEventListener('click', borrarTodo);
});

async function copiarFormulario() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Inyectar el script de copiado instantáneo
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: inyectarCopiaInstantanea
    });

    // Guardar el origen
    const estado = {
      url: new URL(tab.url).hostname,
      timestamp: Date.now()
    };
    await chrome.storage.local.set({ captureState: estado });

    // Dar tiempo al flujo local para actualizar estado
    setTimeout(actualizarEstado, 300);
  } catch (e) {
    console.error('Error copiando el formulario:', e);
  }
}

async function verPreview() {
  chrome.tabs.create({ url: 'preview.html' });
}

async function llenarFormulario() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: inyectarPegadoInstantaneo
    });
  } catch (e) {
    console.error('Error pegando el formulario:', e);
  }
}

async function borrarTodo() {
  if (confirm('¿Estas seguro? Se borraran todos los datos guardados en la extensión.')) {
    await chrome.storage.local.remove(['formData', 'captureState']);
    actualizarEstado();
  }
}

async function actualizarEstado() {
  const data = await chrome.storage.local.get(['formData', 'captureState']);
  const formData = data.formData || [];
  const captureState = data.captureState || {};

  const filledFields = formData.filter(f => f.value);

  document.getElementById('fieldCount').textContent = filledFields.length;
  document.getElementById('sourceUrl').textContent = captureState.url || 'Ninguno';

  const btnFill = document.getElementById('btnFill');
  btnFill.disabled = filledFields.length === 0;
  const btnPreview = document.getElementById('btnPreview');
  btnPreview.disabled = formData.length === 0;
}

// =========================================================
// SCRIPT INYECTADO: COPIAR AL INSTANTE
// =========================================================
function inyectarCopiaInstantanea() {
  function obtenerLabel(el) {
    if (el.id) {
      const lbl = document.querySelector('label[for="' + el.id + '"]');
      if (lbl) return lbl.textContent.trim();
    }
    const parent = el.closest('label');
    if (parent) return parent.textContent.trim();
    const prev = el.previousElementSibling;
    if (prev && ['LABEL', 'SPAN', 'P', 'DIV'].includes(prev.tagName)) {
      return prev.textContent.trim();
    }
    return '';
  }

  function mostrarBadge(msg) {
    let badge = document.getElementById('faf-badge-copy');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'faf-badge-copy';
      badge.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:#10B981;color:white;padding:12px 20px;border-radius:10px;font-family:-apple-system,sans-serif;font-weight:600;font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.3s, transform 0.3s;pointer-events:none;transform:translateY(10px);';
      document.body.appendChild(badge);
    }
    badge.textContent = msg;
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
    setTimeout(() => { badge.style.opacity = '0'; badge.style.transform = 'translateY(10px)'; }, 3000);
  }

  const campos = document.querySelectorAll('input:not([type="hidden"]):not([type="file"]):not([type="submit"]):not([type="button"]), select, textarea');
  const datosCapturados = [];

  campos.forEach(campo => {
    // Ignorar campos vacíos o inputs deshabilitados
    if (!campo.value || campo.disabled || campo.readOnly) return;
    if (campo.type === 'checkbox' && !campo.checked) return;
    if (campo.type === 'radio' && !campo.checked) return;
    // Ignorar elementos ocultos por CSS
    const rect = campo.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(campo).display === 'none') return;

    datosCapturados.push({
      name: campo.name || '',
      id: campo.id || '',
      type: campo.type,
      value: campo.type === 'checkbox' || campo.type === 'radio' ? campo.checked : campo.value,
      label: obtenerLabel(campo),
      placeholder: campo.placeholder || '',
      tagName: campo.tagName.toLowerCase()
    });
  });

  chrome.storage.local.set({ formData: datosCapturados }, () => {
    mostrarBadge(`📸 ¡Captura lista! Se copiaron ${datosCapturados.length} campos.`);
  });
}

// =========================================================
// SCRIPT INYECTADO: PEGAR AL INSTANTE
// =========================================================
function inyectarPegadoInstantaneo() {
  function obtenerLabel(el) {
    if (el.id) {
      const lbl = document.querySelector('label[for="' + el.id + '"]');
      if (lbl) return lbl.textContent.trim();
    }
    const parent = el.closest('label');
    if (parent) return parent.textContent.trim();
    const prev = el.previousElementSibling;
    if (prev && ['LABEL', 'SPAN', 'P', 'DIV'].includes(prev.tagName)) {
      return prev.textContent.trim();
    }
    return '';
  }

  function mostrarBadge(msg, color = '#3B82F6') {
    let badge = document.getElementById('faf-badge-paste');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'faf-badge-paste';
      badge.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:999999;background:${color};color:white;padding:12px 20px;border-radius:10px;font-family:-apple-system,sans-serif;font-weight:600;font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.3s, transform 0.3s;pointer-events:none;transform:translateY(10px);`;
      document.body.appendChild(badge);
    }
    badge.textContent = msg;
    badge.style.background = color;
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
    setTimeout(() => { badge.style.opacity = '0'; badge.style.transform = 'translateY(10px)'; }, 3000);
  }

  // Lógica de coincidencia mejorada (flexible a React/Single Page Apps y variaciones estructurales)
  function encontrarCoincidencia(saved, fields) {
    // 1. Coincidencia exacta
    let m = fields.find(f => f.name && saved.name && f.name.toLowerCase() === saved.name.toLowerCase());
    if (m) return m;

    m = fields.find(f => f.id && saved.id && f.id.toLowerCase() === saved.id.toLowerCase());
    if (m) return m;

    // 2. Coincidencia parcial (e.g., 'shipping_state' vs 'state')
    m = fields.find(f => f.name && saved.name && saved.name.length > 3 && (f.name.toLowerCase().includes(saved.name.toLowerCase()) || saved.name.toLowerCase().includes(f.name.toLowerCase())));
    if (m) return m;

    m = fields.find(f => f.id && saved.id && saved.id.length > 3 && (f.id.toLowerCase().includes(saved.id.toLowerCase()) || saved.id.toLowerCase().includes(f.id.toLowerCase())));
    if (m) return m;

    // 3. Coincidencias de Etiquetas o Placeholders
    m = fields.find(f => {
      const pl = (f.placeholder || '').toLowerCase();
      const sp = (saved.placeholder || '').toLowerCase();
      return pl && sp && (pl.includes(sp) || sp.includes(pl));
    });
    if (m) return m;

    m = fields.find(f => {
      const lf = obtenerLabel(f).toLowerCase();
      const ls = (saved.label || '').toLowerCase();
      return lf && ls && lf.length > 2 && ls.length > 2 && (lf.includes(ls) || ls.includes(lf));
    });
    if (m) return m;

    return null;
  }

  chrome.storage.local.get('formData', (data) => {
    if (!data.formData || data.formData.length === 0) {
      mostrarBadge('❌ No hay datos copiados en memoria', '#EF4444');
      return;
    }

    // Buscamos sin limitarnos a elementos que ya tienen value para poder llenarlos
    const campos = document.querySelectorAll('input:not([type="hidden"]):not([type="file"]):not([type="submit"]):not([type="button"]), select, textarea');
    
    // Eliminamos del arreglo los campos que ya fueron emparejados para no sobreescribir el mismo campo 5 veces
    let camposDisponibles = Array.from(campos);
    const saved = data.formData;
    let count = 0;

    saved.forEach(s => {
      if (!s.value) return;
      
      const target = encontrarCoincidencia(s, camposDisponibles);
      
      if (target) {
        // Remover el target usado para no reutilizarlo
        camposDisponibles = camposDisponibles.filter(c => c !== target);

        // Asignación compatible con frameworks modernos mediante validación de setters
        const reactSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        const angularSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        const selectSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
        
        const type = target.tagName.toLowerCase();
        try {
            if (type === 'textarea' && angularSetter) {
                 angularSetter.call(target, s.value);
            } else if (type === 'select' && selectSetter) {
                 selectSetter.call(target, s.value);
            } else if (type === 'input' && reactSetter) {
                 reactSetter.call(target, s.value);
            } else {
                 target.value = s.value;
            }
        } catch(e) { target.value = s.value; /* Fallback estándar */ }

        if (target.type === 'checkbox' || target.type === 'radio') {
            target.checked = s.value;
        }

        // Animar el fondo para indicar qué campos se llenaron
        const originalBg = target.style.backgroundColor;
        const originalTrans = target.style.transition;
        target.style.transition = 'background-color 0.5s ease';
        target.style.backgroundColor = '#D1FAE5'; // Verde suave
        setTimeout(() => { target.style.backgroundColor = originalBg; target.style.transition = originalTrans; }, 1000);

        // Disparar eventos para asegurar frameworks como jQuery, React o select2
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
        target.dispatchEvent(new CustomEvent('select2:select', { bubbles: true })); // Evento específico para librerías Select2 (comunes en Woo/Magento)
        target.dispatchEvent(new Event('blur', { bubbles: true }));
        
        count++;
      }
    });

    if (count > 0) {
       mostrarBadge(`⚡ ¡Perfecto! He pegado ${count} datos de los ${saved.length} guardados.`);
    } else {
       mostrarBadge(`⚠️ Ningún campo de destino coincide con los copiados.`, '#F59E0B');
    }
  });
}
