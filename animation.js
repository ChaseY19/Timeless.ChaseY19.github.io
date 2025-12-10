// Exporta la función
export function waitUntilAnimationsFinish(element) {
  // Obtiene las animaciones y sus promesas de finalización
  const animationPromises = element.getAnimations().map(animation => animation.finished);

  // Espera a que todas terminen (resueltas o rechazadas)
  return Promise.allSettled(animationPromises);
}