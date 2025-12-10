import { initDialog } from "./dialog.js";
import { initEventForm } from "./event-form.js";
import { initToaster } from "./toaster.js";

// Inicializa diálogo del formulario de evento
export function initEventFormDialog() {
  // Diálogo
  const dialog = initDialog("event-form");
  // Notificaciones
  const toaster = initToaster(dialog.dialogElement);
  // Formulario
  const eventForm = initEventForm(toaster);

  const dialogTitleElement = dialog.dialogElement.querySelector("[data-dialog-title]");

  // Crear evento
  document.addEventListener("event-create-request", (event) => {
    dialogTitleElement.textContent = "Crear evento";
    eventForm.switchToCreateMode(
      event.detail.date,
      event.detail.startTime,
      event.detail.endTime
    );
    dialog.open();
  });

  // Editar evento
  document.addEventListener("event-edit-request", (event) => {
    dialogTitleElement.textContent = "Editar evento";
    eventForm.switchToEditMode(event.detail.event);
    dialog.open();
  });

  // Reset al cerrar
  dialog.dialogElement.addEventListener("close", () => {
    eventForm.reset();
  });

  // Cierra al crear
  eventForm.formElement.addEventListener("event-create", () => {
    dialog.close();
  });

  // Cierra al editar
  eventForm.formElement.addEventListener("event-edit", () => {
    dialog.close();
  });
}