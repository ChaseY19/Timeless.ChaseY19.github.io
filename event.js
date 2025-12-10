// Plantilla del evento
const eventTemplateElement = document.querySelector("[data-template='event']");

// Formato de hora (es-MX)
const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: "numeric",
  minute: "numeric"
});

// Evento estático (lista/mes)
export function initStaticEvent(parent, event) {
  const eventElement = initEvent(event);

  // Marca como lleno si es todo el día
  if (isEventAllDay(event)) {
    eventElement.classList.add("event--filled");
  }

  parent.appendChild(eventElement);
}

// Evento dinámico (semana/posición)
export function initDynamicEvent(parent, event, dynamicStyles) {
  const eventElement = initEvent(event);

  eventElement.classList.add("event--filled");
  eventElement.classList.add("event--dynamic");

  // Posicionamiento
  eventElement.style.top = dynamicStyles.top;
  eventElement.style.left = dynamicStyles.left;
  eventElement.style.bottom = dynamicStyles.bottom;
  eventElement.style.right = dynamicStyles.right;

  eventElement.dataset.eventDynamic = true;

  parent.appendChild(eventElement);
}

// Inicializa DOM del evento
function initEvent(event) {
  const eventContent = eventTemplateElement.content.cloneNode(true);
  const eventElement = eventContent.querySelector("[data-event]");
  const eventTitleElement = eventElement.querySelector("[data-event-title]");
  const eventStartTimeElement = eventElement.querySelector("[data-event-start-time]");
  const eventEndTimeElement = eventElement.querySelector("[data-event-end-time]");

  // Fechas de inicio/fin
  const startDate = eventTimeToDate(event, event.startTime);
  const endDate = eventTimeToDate(event, event.endTime);

  // Datos visuales/texto
  eventElement.style.setProperty("--event-color", event.color);
  eventTitleElement.textContent = event.title;
  eventStartTimeElement.textContent = dateFormatter.format(startDate);
  eventEndTimeElement.textContent = dateFormatter.format(endDate);

  // Abre detalles al darle click
  eventElement.addEventListener("click", () => {
    eventElement.dispatchEvent(new CustomEvent("event-click", {
      detail: {
        event,
      },
      bubbles: true
    }));
  });

  return eventElement;
}

// ¿Dura todo el día?
export function isEventAllDay(event) {
  return event.startTime === 0 && event.endTime === 1440;
}

// Compara inicio
export function eventStartsBefore(eventA, eventB) {
  return eventA.startTime < eventB.startTime;
}

// Compara fin
export function eventEndsBefore(eventA, eventB) {
  return eventA.endTime < eventB.endTime;
}

// ¿Colisionan los tiempos?
export function eventCollidesWith(eventA, eventB) {
  const maxStartTime = Math.max(eventA.startTime, eventB.startTime);
  const minEndTime = Math.min(eventA.endTime, eventB.endTime);

  return minEndTime > maxStartTime;
}

// Convierte minutos a Date
export function eventTimeToDate(event, eventTime) {

  const hours = Math.floor(eventTime / 60);
  const minutes = eventTime % 60;

  return new Date(
    event.date.getFullYear(),
    event.date.getMonth(),
    event.date.getDate(),
    hours,
    minutes
  );
}

// Valida rangos de tiempo
export function validateEvent(event) {
  if (event.startTime >= event.endTime) {
    return "La hora de finalización del evento debe ser después de su tiempo de inicio";
  }

  return null;
}

// Ajusta líneas del título según altura
export function adjustDynamicEventMaxLines(dynamicEventElement) {
  const availableHeight = dynamicEventElement.offsetHeight;
  const lineHeight = 16;
  const padding = 8;
  const maxTitleLines = Math.floor((availableHeight - lineHeight - padding) / lineHeight);

  dynamicEventElement.style.setProperty("--event-title-max-lines", maxTitleLines);
}

// Genera id simple
export function generateEventId() {
  return Date.now();
}