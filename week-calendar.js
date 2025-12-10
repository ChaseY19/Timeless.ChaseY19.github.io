import { generateWeekDays, isTheSameDay, today } from "./date.js";
import { isEventAllDay, eventStartsBefore, eventEndsBefore, initDynamicEvent, eventCollidesWith, adjustDynamicEventMaxLines } from "./event.js";
import { initEventList } from "./event-list.js";

// Plantillas del calendario semanal
const calendarTemplateElement = document.querySelector("[data-template='week-calendar']");
const calendarDayOfWeekTemplateElement = document.querySelector("[data-template='week-calendar-day-of-week']");
const calendarAllDayListItemTemplateElement = document.querySelector("[data-template='week-calendar-all-day-list-item']");
const calendarColumnTemplateElement = document.querySelector("[data-template='week-calendar-column']");

// Formato de día corto (es-MX)
const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: 'short'
});

//  Inicializa calendario semanal
export function initWeekCalendar(parent, selectedDate, eventStore, isSingleDay, deviceType) {
  const calendarContent = calendarTemplateElement.content.cloneNode(true);
  const calendarElement = calendarContent.querySelector("[data-week-calendar]");
  const calendarDayOfWeekListElement = calendarElement.querySelector("[data-week-calendar-day-of-week-list]");
  const calendarAllDayListElement = calendarElement.querySelector("[data-week-calendar-all-day-list]");
  const calendarColumnsElement = calendarElement.querySelector("[data-week-calendar-columns]");

  // Días de la semana o día único
  const weekDays = isSingleDay ? [selectedDate] : generateWeekDays(selectedDate);
  // Render por día
  for (const weekDay of weekDays) {
    const events = eventStore.getEventsByDate(weekDay);
    // Todo el día
    const allDayEvents = events.filter((event) => isEventAllDay(event));
    // Con horario
    const nonAllDayEvents = events.filter((event) => !isEventAllDay(event));

    // Orden cronológico
    sortEventsByTime(nonAllDayEvents);

    initDayOfWeek(calendarDayOfWeekListElement, selectedDate, weekDay, deviceType);

    // En desktop, o en mobile solo el día seleccionado
    if (deviceType === "desktop" || (deviceType === "mobile" && isTheSameDay(weekDay, selectedDate))) {
      initAllDayListItem(calendarAllDayListElement, allDayEvents);
      initColumn(calendarColumnsElement, weekDay, nonAllDayEvents);
    }
  }

  // Clase para vista de un solo día
  if (isSingleDay) {
    calendarElement.classList.add("week-calendar--day");
  }

  parent.appendChild(calendarElement);

  // Ajusta líneas del título según altura
  const dynamicEventElements = calendarElement.querySelectorAll("[data-event-dynamic]");

  for (const dynamicEventElement of dynamicEventElements) {
    adjustDynamicEventMaxLines(dynamicEventElement);
  }
}

// Encabezado de día (nombre + número)
function initDayOfWeek(parent, selectedDate, weekDay, deviceType) {
  const calendarDayOfWeekContent = calendarDayOfWeekTemplateElement.content.cloneNode(true);
  const calendarDayOfWeekElement = calendarDayOfWeekContent.querySelector("[data-week-calendar-day-of-week]");
  const calendarDayOfWeekButtonElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-button]");
  const calendarDayOfWeekDayElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-day]");
  const calendarDayOfWeekNumberElement = calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-number]");

  // Texto del día
  calendarDayOfWeekNumberElement.textContent = weekDay.getDate();
  calendarDayOfWeekDayElement.textContent = dateFormatter.format(weekDay);

  // Resalta hoy
  if (isTheSameDay(weekDay, today())) {
    calendarDayOfWeekButtonElement.classList.add("week-calendar__day-of-week-button--highlight");
  }

  // Marca seleccionado
  if (isTheSameDay(weekDay, selectedDate)) {
    calendarDayOfWeekButtonElement.classList.add("week-calendar__day-of-week-button--selected");
  }

  // Al dar click cambia fecha (y vista en desktop)
  calendarDayOfWeekButtonElement.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("date-change", {
      detail: {
        date: weekDay
      },
      bubbles: true
    }));

    // En desktop cambia a vista día
    if (deviceType !== "mobile") {
      document.dispatchEvent(new CustomEvent("view-change", {
        detail: {
          view: "day"
        },
        bubbles: true
      }));
    }
  });

  parent.appendChild(calendarDayOfWeekElement);
}

// Lista de eventos "todo el día"
function initAllDayListItem(parent, events) {
  const calendarAllDayListItemContent = calendarAllDayListItemTemplateElement.content.cloneNode(true);
  const calendarAllDayListItemElement = calendarAllDayListItemContent.querySelector("[data-week-calendar-all-day-list-item]");

  // Inserta eventos
  initEventList(calendarAllDayListItemElement, events);

  parent.appendChild(calendarAllDayListItemElement);
}

// Columna con celdas y eventos dinámicos
function initColumn(parent, weekDay, events) {
  const calendarColumnContent = calendarColumnTemplateElement.content.cloneNode(true);
  const calendarColumnElement = calendarColumnContent.querySelector("[data-week-calendar-column]");
  const calendarColumnCellElements = calendarColumnElement.querySelectorAll("[data-week-calendar-cell]");

  // Calcula estilos de posición
  const eventsWithDynamicStyles = calculateEventsDynamicStyles(events);
  for (const eventWithDynamicStyles of eventsWithDynamicStyles) {
    initDynamicEvent(
      calendarColumnElement,
      eventWithDynamicStyles.event,
      eventWithDynamicStyles.styles
    );
  }

  // Al dar click en una celda se crea un evento
  for (const calendarColumnCellElement of calendarColumnCellElements) {
    const cellStartTime = Number.parseInt(
      calendarColumnCellElement.dataset.weekCalendarCell,
      10
    );
    const cellEndTime = cellStartTime + 60;

    calendarColumnCellElement.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("event-create-request", {
        detail: {
          date: weekDay,
          startTime: cellStartTime,
          endTime: cellEndTime
        },
        bubbles: true
      }));
    });
  }

  parent.appendChild(calendarColumnElement);
}

// Estilos dinámicos (top/left/bottom/right)
function calculateEventsDynamicStyles(events) {
  const { eventGroups, totalColumns } = groupEvents(events);
  const columnWidth = 100 / totalColumns;
  const initialEventGroupItems = [];

  // Toma ítems iniciales
  for (const eventGroup of eventGroups) {
    for (const eventGroupItem of eventGroup) {
      if (eventGroupItem.isInitial) {
        initialEventGroupItems.push(eventGroupItem);
      }
    }
  }

  // Convierte a porcentajes
  return initialEventGroupItems.map((eventGroupItem) => {
    const topPercentage = 100 * (eventGroupItem.event.startTime / 1440);
    const bottomPercentage = 100 - 100 * (eventGroupItem.event.endTime / 1440);
    const leftPercentage = columnWidth * eventGroupItem.columnIndex;
    const rightPercentage = columnWidth * (totalColumns - eventGroupItem.columnIndex - eventGroupItem.columnSpan);

    return {
      event: eventGroupItem.event,
      styles: {
        top: `${topPercentage}%`,
        bottom: `${bottomPercentage}%`,
        left: `${leftPercentage}%`,
        right: `${rightPercentage}%`
      }
    }
  });
}

// Agrupa eventos por colisión y columnas
function groupEvents(events) {
  if (events.length === 0) {
    return { eventGroups: [], totalColumns: 0 };
  }

  // Primer grupo con el primer evento
  const firstEventGroup = [
    {
      event: events[0],
      columnIndex: 0,
      isInitial: true,
      eventIndex: 0
    }
  ];

  const eventGroups = [firstEventGroup];

  // Recorre eventos y agrupa por colisión
  for (let i = 1; i < events.length; i += 1) {
    const lastEventGroup = eventGroups[eventGroups.length - 1];
    const loopEvent = events[i];

    // Ítems que colisionan con el evento actual
    const lastEventGroupCollidingItems = lastEventGroup.filter((eventGroupItem) => eventCollidesWith(eventGroupItem.event, loopEvent));

    // Si no colisiona crea un nuevo grupo
    if (lastEventGroupCollidingItems.length === 0) {
      const newEventGroupItem = {
        event: loopEvent,
        columnIndex: 0,
        isInitial: true,
        eventIndex: i
      };

      const newEventGroup = [newEventGroupItem];
      eventGroups.push(newEventGroup);
      continue;
    }

    // Si colisiona con todos se agrega al final
    if (lastEventGroupCollidingItems.length === lastEventGroup.length) {
      const newEventGroupItem = {
        event: loopEvent,
        columnIndex: lastEventGroup.length,
        isInitial: true,
        eventIndex: i
      };

      lastEventGroup.push(newEventGroupItem);
      continue;
    }

    // Busca columna libre
    let newColumnIndex = 0;
    while (true) {
      const isColumnIndexInUse = lastEventGroupCollidingItems.some((eventGroupItem) => eventGroupItem.columnIndex === newColumnIndex);

      if (isColumnIndexInUse) {
        newColumnIndex += 1;
      } else {
        break;
      }
    }

    // Inserta ítem en columna disponible
    const newEventGroupItem = {
      event: loopEvent,
      columnIndex: newColumnIndex,
      isInitial: true,
      eventIndex: i
    };

    // El nuevo grupo los marca anteriores como no iniciales
    const newEventGroup = [
      ...lastEventGroupCollidingItems.map((eventGroupItem) => ({
        ...eventGroupItem,
        isInitial: false
      })),
      newEventGroupItem
    ];

    eventGroups.push(newEventGroup);
  }

  // Calcula total de columnas
  let totalColumns = 0;
  for (const eventGroup of eventGroups) {
    for (const eventGroupItem of eventGroup) {
      totalColumns = Math.max(totalColumns, eventGroupItem.columnIndex + 1);
    }
  }

  // Ordena por columna y calcula span
  for (const eventGroup of eventGroups) {
    eventGroup.sort((columnGroupItemA, columnGroupItemB) => {
      return columnGroupItemA.columnIndex < columnGroupItemB.columnIndex ? -1 : 1;
    });

    for (let i = 0; i < eventGroup.length; i += 1) {
      const loopEventGroupItem = eventGroup[i];
      if (i === eventGroup.length - 1) {
        // Último: span hasta la última columna
        loopEventGroupItem.columnSpan = totalColumns - loopEventGroupItem.columnIndex;
      } else {
        // Span hasta la siguiente columna ocupada
        const nextLoopEventGroupItem = eventGroup[i + 1];
        loopEventGroupItem.columnSpan = nextLoopEventGroupItem.columnIndex - loopEventGroupItem.columnIndex;
      }
    }
  }

  // Ajusta span mínimo por evento
  for (let i = 0; i < events.length; i += 1) {
    let lowestColumnSpan = Infinity;

    // Encuentra el menor span entre grupos
    for (const eventGroup of eventGroups) {
      for (const eventGroupItem of eventGroup) {
        if (eventGroupItem.eventIndex === i) {
          lowestColumnSpan = Math.min(lowestColumnSpan, eventGroupItem.columnSpan);
        }
      }
    }

    // Aplica el menor span al evento en todos los grupos
    for (const eventGroup of eventGroups) {
      for (const eventGroupItem of eventGroup) {
        if (eventGroupItem.eventIndex === i) {
          eventGroupItem.columnSpan = lowestColumnSpan;
        }
      }
    }
  }

  return { eventGroups, totalColumns };
}

// Ordena eventos por tiempo
function sortEventsByTime(events) {
  events.sort((eventA, eventB) => {
    // Si empieza antes entonces es el primero
    if (eventStartsBefore(eventA, eventB)) {
      return -1;
    }

    // Si empieza después entonces se coloca después
    if (eventStartsBefore(eventB, eventA)) {
      return 1
    }

    // Si empiezan igual entonces el que termina antes va después
    return eventEndsBefore(eventA, eventB) ? 1 : -1;
  });
}