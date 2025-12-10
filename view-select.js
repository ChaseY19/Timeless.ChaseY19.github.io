import { getUrlView } from "./url.js";

// Inicializa selector de vista
export function initViewSelect() {
  const viewSelectElement = document.querySelector("[data-view-select]");
  // Establece vista inicial
  viewSelectElement.value = getUrlView();

  // Cambio manual de vista
  viewSelectElement.addEventListener("change", (event) => {
    viewSelectElement.dispatchEvent(new CustomEvent("view-change", {
      detail: {
        view: viewSelectElement.value
      },
      bubbles: true
    }));
  });

  // Actualiza selector cuando cambia la vista global
  document.addEventListener("view-change", (event) => {
    viewSelectElement.value = event.detail.view;
  });
}