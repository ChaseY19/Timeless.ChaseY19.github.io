// Media query para escritorio
const isDesktopMediaQuery = window.matchMedia("(min-width: 768px)");

// Inicializa comportamiento responsiv
export function initResponsive() {
  // En móvil, fuerza vista mensual al inicio
  if (currentDeviceType() === "mobile") {
    document.dispatchEvent(new CustomEvent("view-change", {
      detail: {
        view: "month"
      },
      bubbles: true
    }));
  }

  // Reacciona a cambios de tamaño (desktop/mobile)
  isDesktopMediaQuery.addEventListener("change", () => {
    const deviceType = currentDeviceType();

    // Notifica tipo de dispositivo
    document.dispatchEvent(new CustomEvent("device-type-change", {
      detail: {
        deviceType
      },
      bubbles: true
    }));

    // En móvil, cambia a vista mensual
    if (deviceType === "mobile") {
      document.dispatchEvent(new CustomEvent("view-change", {
        detail: {
          view: "month"
        },
        bubbles: true
      }));
    }
  });
}

// Devuelve tipo de dispositivo actual
export function currentDeviceType() {
  return isDesktopMediaQuery.matches ? "desktop" : "mobile";
}