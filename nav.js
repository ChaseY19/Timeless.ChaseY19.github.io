import { today, addDays, addMonths, subtractDays, subtractMonths } from "./date.js";
import { getUrlDate, getUrlView } from "./url.js";

// Formato mes/año (es-MX)
const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric"
});

// Inicializa la barra de navegación
export function initNav() {
  const todayButtonElements = document.querySelectorAll("[data-nav-today-button]");
  const previousButtonElement = document.querySelector("[data-nav-previous-button]");
  const nextButtonElement = document.querySelector("[data-nav-next-button]");
  const dateElement = document.querySelector("[data-nav-date]");

  // Estado inicial
  let selectedView = getUrlView();
  let selectedDate = getUrlDate();

  // Botón "Hoy"
  for (const todayButtonElement of todayButtonElements) {
    todayButtonElement.addEventListener("click", () => {
      todayButtonElement.dispatchEvent(new CustomEvent("date-change", {
        detail: {
          date: today()
        },
        bubbles: true
      }));
    });
  }

  // Botón "Anterior"
  previousButtonElement.addEventListener("click", () => {
    previousButtonElement.dispatchEvent(new CustomEvent("date-change", {
      detail: {
        date: getPreviousDate(selectedView, selectedDate)
      },
      bubbles: true
    }));
  });

  // Botón "Siguiente"
  nextButtonElement.addEventListener("click", () => {
    nextButtonElement.dispatchEvent(new CustomEvent("date-change", {
      detail: {
        date: getNextDate(selectedView, selectedDate)
      },
      bubbles: true
    }));
  });

  // Actualiza vista seleccionada
  document.addEventListener("view-change", (event) => {
    selectedView = event.detail.view;
  });

  // Actualiza fecha seleccionada y header
  document.addEventListener("date-change", (event) => {
    selectedDate = event.detail.date;
    refreshDateElement(dateElement, selectedDate);
  });

  // Render inicial del header
  refreshDateElement(dateElement, selectedDate);
}

// Actualiza el texto de la fecha
function refreshDateElement(dateElement, selectedDate) {
  dateElement.textContent = dateFormatter.format(selectedDate);
}

// Calcula fecha anterior según vista
function getPreviousDate(selectedView, selectedDate) {
  if (selectedView === "day") {
    return subtractDays(selectedDate, 1);
  }

  if (selectedView === "week") {
    return subtractDays(selectedDate, 7);
  }

  return subtractMonths(selectedDate, 1);
}

// Calcula fecha siguiente según vista
function getNextDate(selectedView, selectedDate) {
  if (selectedView === "day") {
    return addDays(selectedDate, 1);
  }

  if (selectedView === "week") {
    return addDays(selectedDate, 7);
  }

  return addMonths(selectedDate, 1);
}