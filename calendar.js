// Importa funciones necesarias
import { initMonthCalendar } from "./month-calendar.js";
import { initWeekCalendar } from "./week-calendar.js";
import { currentDeviceType } from "./responsive.js";
import { getUrlDate, getUrlView } from "./url.js";

// Inicializa el calendario
export function initCalendar(eventStore) {
  // Obtiene el elemento del calendario
  const calendarElement = document.querySelector("[data-calendar]");

  // Variables iniciales
  let selectedView = getUrlView();
  let selectedDate = getUrlDate();
  let deviceType = currentDeviceType();

  // Actualiza el calendario
  function refreshCalendar() {
    // Elemento desplazable
    const calendarScrollableElement = calendarElement.querySelector("[data-calendar-scrollable]");

    // Guarda posición de scroll
    const scrollTop = calendarScrollableElement === null ? 0 : calendarScrollableElement.scrollTop;

    // Limpia contenido
    calendarElement.replaceChildren();

    // Renderiza según vista
    if (selectedView === "month") {
      initMonthCalendar(calendarElement, selectedDate, eventStore);
    } else if (selectedView === "week") {
      initWeekCalendar(calendarElement, selectedDate, eventStore, false, deviceType);
    } else {
      initWeekCalendar(calendarElement, selectedDate, eventStore, true, deviceType);
    }

    // Restaura scroll
    calendarElement.querySelector("[data-calendar-scrollable]").scrollTo({ top: scrollTop });
  }

  // Escucha cambios de vista
  document.addEventListener("view-change", (event) => {
    selectedView = event.detail.view;
    refreshCalendar();
  });

  // Escucha cambios de fecha
  document.addEventListener("date-change", (event) => {
    selectedDate = event.detail.date;
    refreshCalendar();
  });

  // Escucha cambios de dispositivo
  document.addEventListener("device-type-change", (event) => {
    deviceType = event.detail.deviceType;
    refreshCalendar();
  });

  // Escucha cambios de eventos
  document.addEventListener("events-change", () => {
    refreshCalendar();
  });

  // Render inicial
  refreshCalendar();
}