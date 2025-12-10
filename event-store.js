import { isTheSameDay } from './date.js';

// Inicializa el almacén de eventos
export function initEventStore() {
  // Crear evento
  document.addEventListener('event-create', (event) => {
    const createdEvent = event.detail.event;
    const events = getEventsFromLocalStorage();
    events.push(createdEvent);
    saveEventsIntoLocalStorage(events);

    // Notifica cambios
    document.dispatchEvent(new CustomEvent('events-change', {
      bubbles: true
    }));
  });

  // Eliminar evento
  document.addEventListener('event-delete', (event) => {
    const deletedEvent = event.detail.event;
    const events = getEventsFromLocalStorage().filter((event) => {
      return event.id !== deletedEvent.id;
    });
    saveEventsIntoLocalStorage(events);

    // Notifica cambios
    document.dispatchEvent(new CustomEvent('events-change', {
      bubbles: true
    }));
  });

  // Editar evento
  document.addEventListener('event-edit', (event) => {
    const editedEvent = event.detail.event;
    const events = getEventsFromLocalStorage().map((event) => {
      return event.id === editedEvent.id ? editedEvent : event;
    });
    saveEventsIntoLocalStorage(events);

    // Notifica cambios
    document.dispatchEvent(new CustomEvent('events-change', {
      bubbles: true
    }));
  });

  // API de lectura
  return {
    getEventsByDate(date) {
      const events = getEventsFromLocalStorage();
      const filteredEvents = events.filter((event) => isTheSameDay(event.date, date));
      return filteredEvents;
    }
  };
}

// Guarda en localStorage
function saveEventsIntoLocalStorage(events) {

  // Serializa fechas como YYYY-MM-DD
  const safeToStringifyEvents = events.map((event) => ({
    ...event,
    date: event.date.toLocaleDateString('en-CA')
  }));

  let stringifiedEvents;
  try {
    stringifiedEvents = JSON.stringify(safeToStringifyEvents);
  } catch (error) {
    console.error('Stringify events failed', error);
  }

  localStorage.setItem('events', stringifiedEvents);
}

// Obtiene de localStorage
function getEventsFromLocalStorage() {
  const localStorageEvents = localStorage.getItem('events');
  if (localStorageEvents === null) {
    return [];
  }

  let parsedEvents;
  try {
    parsedEvents = JSON.parse(localStorageEvents);
  } catch (error) {
    console.error('Parse events failed', error);
    return [];
  }

  // Convierte string a Date (medianoche)
  const events = parsedEvents.map((event) => {
    const [year, month, day] = event.date.split('-').map(Number);
    return {
      ...event,
      date: new Date(year, month - 1, day, 0, 0, 0, 0)
    };
  });

  return events;
}