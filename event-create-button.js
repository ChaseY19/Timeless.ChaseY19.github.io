import { getUrlDate } from './url.js';

// Normaliza fecha a medianoche
function normalizeToMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

// Inicializa botones para crear eventos
export function initEventCreateButtons() {
  const buttonElements = document.querySelectorAll('[data-event-create-button]');

  // Configura cada botón
  for (const buttonElement of buttonElements) {
    initEventCreateButton(buttonElement);
  }
}

// Configura botón individual
function initEventCreateButton(buttonElement) {
  let selectedDate = getUrlDate();

  // Al hacer clic, dispara evento personalizado
  buttonElement.addEventListener('click', () => {
    buttonElement.dispatchEvent(new CustomEvent('event-create-request', {
      detail: {
        date: normalizeToMidnight(selectedDate),
        startTime: 600,
        endTime: 960
      },
      bubbles: true
    }));
  });

  // Actualiza fecha seleccionada cuando cambia
  document.addEventListener('date-change', (event) => {
    selectedDate = event.detail.date instanceof Date
      ? event.detail.date
      : new Date(event.detail.date);
  });
}