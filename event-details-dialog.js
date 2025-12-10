import { initDialog } from "./dialog.js";
import { eventTimeToDate } from "./event.js";

// Fecha a medianoche
function normalizeToMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

// Formato de fecha (es-MX)
const eventDateFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

// Formato de hora (es-MX)
const eventTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: '2-digit',
  minute: '2-digit'
});

// Diálogo de detalles de evento
export function initEventDetailsDialog() {
  const dialog = initDialog("event-details");

  // Botones de acción
  const deleteButtonElemenet = dialog.dialogElement.querySelector("[data-event-details-delete-button]");
  const editButtonElement = dialog.dialogElement.querySelector("[data-event-details-edit-button]");

  // Evento actual
  let currentEvent = null;

  // Abrir al hacer clic en un evento
  document.addEventListener("event-click", (event) => {
    currentEvent = event.detail.event;
    fillEventDetailsDialog(dialog.dialogElement, event.detail.event);
    dialog.open();
  });

  // Solicitar eliminación
  deleteButtonElemenet.addEventListener("click", () => {
    dialog
      .close()
      .then(() => {
        deleteButtonElemenet.dispatchEvent(new CustomEvent("event-delete-request", {
          detail: { event: currentEvent },
          bubbles: true
        }));
      });
  });

  // Solicitar edición
  editButtonElement.addEventListener("click", () => {
    dialog
      .close()
      .then(() => {
        editButtonElement.dispatchEvent(new CustomEvent("event-edit-request", {
          detail: { event: currentEvent },
          bubbles: true
        }));
      });
  });
}

// Rellena los datos en el diálogo
function fillEventDetailsDialog(parent, event) {
  const eventDetailsElement = parent.querySelector("[data-event-details]");
  const eventDetailsTitleElement = eventDetailsElement.querySelector("[data-event-details-title]");
  const eventDetailsDateElement = eventDetailsElement.querySelector("[data-event-details-date]");
  const eventDetailsStartTimeElement = eventDetailsElement.querySelector("[data-event-details-start-time]");
  const eventDetailsEndTimeElement = eventDetailsElement.querySelector("[data-event-details-end-time]");

  // Texto y formatos
  eventDetailsTitleElement.textContent = event.title;
  eventDetailsDateElement.textContent = eventDateFormatter.format(normalizeToMidnight(event.date));
  eventDetailsStartTimeElement.textContent = eventTimeFormatter.format(eventTimeToDate(event, event.startTime));
  eventDetailsEndTimeElement.textContent = eventTimeFormatter.format(eventTimeToDate(event, event.endTime));

  // Color del evento
  eventDetailsElement.style.setProperty("--event-color", event.color);
}