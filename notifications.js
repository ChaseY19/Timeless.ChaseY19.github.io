import { initToaster } from "./toaster.js";

// Inicializa notificaciones
export function initNotifications() {
  // Crea toaster en el body
  const toaster = initToaster(document.body);

  // Notifica creación
  document.addEventListener("event-create", () => {
    toaster.success("El evento ha sido creado");
  });

  // Notifica eliminación
  document.addEventListener("event-delete", () => {
    toaster.success("El evento ha sido eliminado");
  });

  // Notifica edición
  document.addEventListener("event-edit", () => {
    toaster.success("El evento ha sido editado");
  });
}