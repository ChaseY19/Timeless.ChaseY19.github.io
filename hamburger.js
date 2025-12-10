// Inicializa botón hamburguesa
export function initHamburger() {
  const hamburgetButtonElement = document.querySelector("[data-hamburger-button]");

  // Al hacer clic, solicita abrir sidebar móvil
  hamburgetButtonElement.addEventListener("click", () => {
    hamburgetButtonElement.dispatchEvent(new CustomEvent("mobile-sidebar-open-request", {
      bubbles: true
    }));
  });
}