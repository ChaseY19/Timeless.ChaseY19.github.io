import { validateEvent, generateEventId } from "./event.js";

// Inicializa el formulario de eventos
export function initEventForm(toaster) {
  const formElement = document.querySelector("[data-event-form]");

  // Modo actual
  let mode = "create";

  // Maneja envío de formulario
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    // Convierte el form a objeto evento
    const formEvent = formIntoEvent(formElement);
    // Valida datos
    const validationError = validateEvent(formEvent);
    if (validationError !== null) {
      toaster.error(validationError);
      return;
    }

    // Dispara evento según modo
    if (mode === "create") {
      formElement.dispatchEvent(new CustomEvent("event-create", {
        detail: { event: formEvent },
        bubbles: true
      }));
    }

    if (mode === "edit") {
      formElement.dispatchEvent(new CustomEvent("event-edit", {
        detail: { event: formEvent },
        bubbles: true
      }));
    }
  });

  // API del formulario
  return {
    formElement,
    switchToCreateMode(date, startTime, endTime) {
      mode = "create";
      // Rellena datos base
      fillFormWithDate(formElement, date, startTime, endTime);
    },
    switchToEditMode(event) {
      mode = "edit";
      // Rellena con evento
      fillFormWithEvent(formElement, event);
    },
    reset() {
      // Limpia id
      formElement.querySelector("#id").value = null;
      // Resetea form
      formElement.reset();
    }
  };
}
// Fecha a YYYY-MM-DD local (en-CA)
function toYyyyMmDdLocal(date) {
  return date.toLocaleDateString("en-CA");
}

// Rellena form con fecha y horarios
function fillFormWithDate(formElement, date, startTime, endTime) {
  const dateInputElement = formElement.querySelector("#date");
  const startTimeSelectElement = formElement.querySelector("#start-time");
  const endTimeSelectElement = formElement.querySelector("#end-time");

  dateInputElement.value = toYyyyMmDdLocal(date);
  startTimeSelectElement.value = startTime;
  endTimeSelectElement.value = endTime;
}

// Rellena form con datos de evento
function fillFormWithEvent(formElement, event) {
  const idInputElement = formElement.querySelector("#id");
  const titleInputElement = formElement.querySelector("#title");
  const dateInputElement = formElement.querySelector("#date");
  const startTimeSelectElement = formElement.querySelector("#start-time");
  const endTimeSelectElement = formElement.querySelector("#end-time");
  const colorInputElement = formElement.querySelector(`[value='${event.color}']`);

  idInputElement.value = event.id;
  titleInputElement.value = event.title;
  dateInputElement.value = toYyyyMmDdLocal(event.date);
  startTimeSelectElement.value = event.startTime;
  endTimeSelectElement.value = event.endTime;
  colorInputElement.checked = true;
}

// Parsea YYYY-MM-DD a Date local (medianoche)
function parseYyyyMmDdToLocalDate(yyyyMmDd) {
  const [year, month, day] = yyyyMmDd.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

// Convierte el formulario a objeto evento
function formIntoEvent(formElement) {
  const formData = new FormData(formElement);
  const id = formData.get("id");
  const title = formData.get("title");
  const dateStr = formData.get("date");
  const startTime = formData.get("start-time");
  const endTime = formData.get("end-time");
  const color = formData.get("color");

  const event = {
    // Usa id o genera nuevo
    id: id ? Number.parseInt(id, 10) : generateEventId(),
    title,
    // Fecha normalizada
    date: parseYyyyMmDdToLocalDate(dateStr),
    startTime: Number.parseInt(startTime, 10),
    endTime: Number.parseInt(endTime, 10),
    color
  };

  return event;
}