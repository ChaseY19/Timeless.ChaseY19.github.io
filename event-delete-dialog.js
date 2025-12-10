import { initDialog } from "./dialog.js";

// Diálogo de eliminar evento
export function initEventDeleteDialog() {
  const dialog = initDialog("event-delete");

  // Botón eliminar
  const deleteButtonElement = dialog.dialogElement.querySelector("[data-event-delete-button]");

  // Evento actual
  let currentEvent = null;

  // Solicitud de eliminación
  document.addEventListener("event-delete-request", (event) => {
    currentEvent = event.detail.event;
    fillEventDeleteDialog(dialog.dialogElement, event.detail.event);
    dialog.open();
  });

  // Confirmar eliminación
  deleteButtonElement.addEventListener("click", () => {
    dialog.close();
    deleteButtonElement.dispatchEvent(new CustomEvent("event-delete", {
      detail: {
        event: currentEvent
      },
      bubbles: true
    }));
  });
}

// Rellena el diálogo con datos
function fillEventDeleteDialog(parent, event) {
  const eventDeleteTitleElement = parent.querySelector("[data-event-delete-title]");

  eventDeleteTitleElement.textContent = event.title;
}