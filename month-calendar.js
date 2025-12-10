import { generateMonthCalendarDays, today, isTheSameDay } from "./date.js";
import { isEventAllDay, eventStartsBefore } from "./event.js";
import { initEventList } from "./event-list.js";

// Plantillas
const calendarTemplateElemenent = document.querySelector("[data-template='month-calendar']");
const calendarDayTemplateElement = document.querySelector("[data-template='month-calendar-day']");

// Clases por número de semanas
const calendarWeekClasses = {
  4: "four-week",
  5: "five-week",
  6: "six-week"
};

// Inicializa calendario mensual
export function initMonthCalendar(parent, selectedDate, eventStore) {
  const calendarContent = calendarTemplateElemenent.content.cloneNode(true);
  const calendarElement = calendarContent.querySelector("[data-month-calendar]");
  const calendarDayListElement = calendarElement.querySelector("[data-month-calendar-day-list]");

  const calendarDays = generateMonthCalendarDays(selectedDate);
  const calendarWeeks = calendarDays / 7;

  const calendarWeekClass = calendarWeekClasses[calendarWeeks];
  calendarElement.classList.add(calendarWeekClass);

  // Renderiza días y eventos
  for (const calendarDay of calendarDays) {
    const events = eventStore.getEventsByDate(calendarDay);
    sortCalendarDayEvents(events);

    initCalendarDay(calendarDayListElement, calendarDay, events);
  }

  parent.appendChild(calendarElement);
}

// Inicializa un día del calendario
function initCalendarDay(parent, calendarDay, events) {
  const calendarDayContent = calendarDayTemplateElement.content.cloneNode(true);
  const calendarDayElemenent = calendarDayContent.querySelector("[data-month-calendar-day]");
  const calendarDayLabelElemenent = calendarDayContent.querySelector("[data-month-calendar-day-label]");
  const calendarEventListWrapper = calendarDayElemenent.querySelector("[data-month-calendar-event-list-wrapper]");

  // Resalta hoy
  if (isTheSameDay(today(), calendarDay)) {
    calendarDayElemenent.classList.add("month-calendar__day--highlight");
  }

  // Número del día
  calendarDayLabelElemenent.textContent = calendarDay.getDate();

  // Al dar click en etiqueta cambia la vista a día
  calendarDayLabelElemenent.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("date-change", {
      detail: {
        date: calendarDay
      },
      bubbles: true
    }));

    document.dispatchEvent(new CustomEvent("view-change", {
      detail: {
        view: 'day'
      },
      bubbles: true
    }));
  });

  // Al dar click en lista solicita crear un evento
  calendarEventListWrapper.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("event-create-request", {
      detail: {
        date: calendarDay,
        startTime: 600,
        endTime: 960
      },
      bubbles: true
    }));
  });

  // Lista de eventos del día
  initEventList(calendarDayElemenent, events);

  parent.appendChild(calendarDayElemenent);
}

// Ordena eventos del día
function sortCalendarDayEvents(events) {
  events.sort((eventA, eventB) => {
    if (isEventAllDay(eventA)) {
      return -1;
    }

    if (isEventAllDay(eventB)) {
      return 1;
    }

    return eventStartsBefore(eventA, eventB) ? -1 : 1;
  });
}