import { initDialog } from "./dialog.js";

// Inicializa sidebar móvil
export function initMobileSidebar() {
  const dialog = initDialog("mobile-sidebar");

  // Abre sidebar al solicitarlo
  document.addEventListener("mobile-sidebar-open-request", () => {
    dialog.open();
  });

  // Cierra sidebar al cambiar fecha
  document.addEventListener("date-change", () => {
    dialog.close();
  });
}