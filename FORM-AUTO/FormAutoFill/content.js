// content.js - Se ejecuta en todas las paginas
// Escucha mensajes del popup y ejecuta acciones

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.action === 'PING') {
    respond({ ok: true });
    return false;
  }
  
  // Por ahora no procesamos otros mensajes desde content script
  // El popup maneja toda la lógica mediante scripts inyectados
  return false;
});
