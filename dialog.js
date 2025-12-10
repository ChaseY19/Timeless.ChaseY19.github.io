import { waitUntilAnimationsFinish } from "./animation.js";

// Inicializa un diálogo por nombre
export function initDialog(name) {
  // Elemento del diálogo
  const dialogElement = document.querySelector(`[data-dialog=${name}]`);
  // Botones de cierre
  const closeButtonElements = document.querySelectorAll("[data-dialog-close-button]");

  // Cerrar diálogo con animación
  function close() {
    dialogElement.classList.add("dialog--closing");

    return waitUntilAnimationsFinish(dialogElement)
      .then(() => {
        dialogElement.classList.remove("dialog--closing");
        dialogElement.close();
      })
      .catch((error) => {
        console.error("Finish dialog animation promise failed", error);
      });
  }

  // Click en botones de cierre
  for (const closeButtonElement of closeButtonElements) {
    closeButtonElement.addEventListener("click", () => {
      close();
    });
  }

  // Clic fuera del contenido (backdrop)
  dialogElement.addEventListener("click", (event) => {
    if (event.target === dialogElement) {
      close();
    }
  });

  // Intercepta Escape (cancel) y cierra
  dialogElement.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });

  // API pública del diálogo
  return {
    dialogElement,
    open() {
      dialogElement.showModal();
    },
    close() {
      return close();
    }
  };
}