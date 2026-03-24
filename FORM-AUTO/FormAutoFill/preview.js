document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();

  document.getElementById('btnEdit').addEventListener('click', habilitarEdicion);
  document.getElementById('btnClose').addEventListener('click', () => {
    guardarEdiciones();
    window.close();
  });
});

async function cargarDatos() {
  const data = await chrome.storage.local.get('formData');
  const formData = data.formData || [];
  const filled = formData.filter(f => f.value);

  if (filled.length === 0) {
    document.getElementById('tableContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('btnEdit').style.display = 'none';
    return;
  }

  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  filled.forEach((field, i) => {
    const row = document.createElement('tr');
    const fieldName = field.name || field.id || field.label || 'Campo ' + (i + 1);
    row.innerHTML =
      '<td class="field-name">' + escapar(fieldName) + '</td>' +
      '<td>' +
        '<span class="field-value">' + escapar(field.value) + '</span>' +
        '<input class="edit-input" value="' + escapar(field.value) + '">' +
      '</td>' +
      '<td><span class="field-type">' + (field.type || 'text') + '</span></td>';
    row.dataset.index = i;
    tbody.appendChild(row);
  });

  document.getElementById('fieldCount').textContent = filled.length + ' campos capturados';
}

function habilitarEdicion() {
  document.querySelectorAll('.field-value').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'block');
  document.getElementById('btnEdit').textContent = '💾 Guardar';
  document.getElementById('btnEdit').onclick = guardarEdiciones;
}

async function guardarEdiciones() {
  const data = await chrome.storage.local.get('formData');
  let formData = [...(data.formData || [])];

  const rows = document.querySelectorAll('#tableBody tr');
  rows.forEach(row => {
    const input = row.querySelector('.edit-input');
    const span = row.querySelector('.field-value');
    if (input && input.style.display !== 'none') {
      span.textContent = input.value;
      span.style.display = 'inline';
      input.style.display = 'none';

      const idx = parseInt(row.dataset.index);
      if (!isNaN(idx) && formData[idx]) {
        formData[idx].value = input.value;
      }
    }
  });

  await chrome.storage.local.set({ formData });
  document.getElementById('btnEdit').textContent = '✏️ Editar';
  document.getElementById('btnEdit').onclick = habilitarEdicion;
}

function escapar(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
