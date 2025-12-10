import { initStaticEvent } from "./event.js";

// Plantilla para ítem de lista
const eventListItemTemplateElement = document.querySelector("[data-template='event-list-item']");

// Inicializa lista de eventos
export function initEventList(parent, events) {
  const eventListElement = parent.querySelector("[data-event-list]");

  // Evita propagación de clic
  eventListElement.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Agrega cada evento a la lista
  for (const event of events) {
    // Clona plantilla
    const eventListItemContent = eventListItemTemplateElement.content.cloneNode(true);
    const eventListItemElement = eventListItemContent.querySelector("[data-event-list-item]");

    // Inicializa datos del evento
    initStaticEvent(eventListItemElement, event);

    // Inserta en la lista
    eventListElement.appendChild(eventListItemElement);
  }
}