// Canal para sincronización entre pestañas
const broadcastChannel = new BroadcastChannel("events-change-channel");

// Inicializa sincronización
export function initSync() {
  // Escucha mensajes del canal y dispara evento global
  broadcastChannel.addEventListener("message", () => {
    document.dispatchEvent(new CustomEvent("events-change", {
      detail: {
        source: "broadcast-channel"
      },
      bubbles: true
    }));
  });

  // Cuando hay cambios locales, notifica a otras pestañas
  document.addEventListener("events-change", (event) => {
    if (event?.detail?.source !== "broadcast-channel") {
      broadcastChannel.postMessage({});
    }
  });
}