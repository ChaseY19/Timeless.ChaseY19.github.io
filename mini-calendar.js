import { today, subtractMonths, addMonths, generateMonthCalendarDays, isTheSameDay } from "./date.js";
import { getUrlDate } from "./url.js";

// Plantilla de ítem de día
const calendarDayListItemTemplateElement = document.querySelector("[data-template='mini-calendar-day-list-item']");

// Formato mes/año (es-MX)
const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  month: 'long',
  year: 'numeric'
});

// Inicializa todos los mini-calendarios
export function initMiniCalendars() {
  const calendarElements = document.querySelectorAll("[data-mini-calendar]");

  // Configura cada uno
  for (const calendarElement of calendarElements) {
    initMiniCalendar(calendarElement);
  }
}

// Inicializa un mini-calendario
function initMiniCalendar(calendarElement) {
  const calendarPreviousButtonElement = calendarElement.querySelector("[data-mini-calendar-previous-button]");
  const calendarNextButtonElement = calendarElement.querySelector("[data-mini-calendar-next-button]");

  // Estado inicial
  let selectedDate = getUrlDate();
  let miniCalendarDate = getUrlDate();

  // Render principal
  function refreshMiniCalendar() {
    refreshDateElement(calendarElement, miniCalendarDate);
    refreshDayListElement(
      calendarElement,
      miniCalendarDate,
      selectedDate
    );
  }

  // Mes anterior
  calendarPreviousButtonElement.addEventListener("click", () => {
    miniCalendarDate = subtractMonths(miniCalendarDate, 1);
    refreshMiniCalendar();
  });

  // Mes siguiente
  calendarNextButtonElement.addEventListener("click", () => {
    miniCalendarDate = addMonths(miniCalendarDate, 1);
    refreshMiniCalendar();
  });

  // Sincroniza con cambio de fecha global
  document.addEventListener("date-change", (event) => {
    selectedDate = event.detail.date;
    miniCalendarDate = event.detail.date;
    refreshMiniCalendar();
  });

  // Render inicial
  refreshMiniCalendar();
}

// Actualiza encabezado de fecha
function refreshDateElement(parent, date) {
  const calendarDateElement = parent.querySelector("[data-mini-calendar-date]");

  calendarDateElement.textContent = dateFormatter.format(date);
}

// Actualiza lista de días
function refreshDayListElement(parent, miniCalendarDate, selectedDate) {
  const calendarDayListElement = parent.querySelector("[data-mini-calendar-day-list]");

  calendarDayListElement.replaceChildren();
  const calendarDays = generateMonthCalendarDays(miniCalendarDate);
  // Renderiza cada día
  for (const calendarDay of calendarDays) {
    const calendarDayListItemContent = calendarDayListItemTemplateElement.content.cloneNode(true);
    const calendarDayListItemElement = calendarDayListItemContent.querySelector("[data-mini-calendar-day-list-item]");
    const calendarDayElement = calendarDayListItemElement.querySelector("[data-mini-calendar-day]");

    // Número del día
    calendarDayElement.textContent = calendarDay.getDate();

    // Estilo de días fuera del mes
    if (miniCalendarDate.getMonth() !== calendarDay.getMonth()) {
      calendarDayElement.classList.add("mini-calendar__day--other");
    }

    // Selección actual
    if (isTheSameDay(selectedDate, calendarDay)) {
      calendarDayElement.classList.add("button--primary");
    } else {
      calendarDayElement.classList.add("button--secondary");
    }

    // Resalta hoy
    if (isTheSameDay(today(), calendarDay)) {
      calendarDayElement.classList.add("mini-calendar__day--highlight");
    }

    // Cambia la fecha al darle click
    calendarDayElement.addEventListener("click", () => {
      calendarDayElement.dispatchEvent(new CustomEvent("date-change", {
        detail: {
          date: calendarDay
        },
        bubbles: true
      }));
    });

    // Inserta en la lista
    calendarDayListElement.appendChild(calendarDayListItemElement);
  }
}