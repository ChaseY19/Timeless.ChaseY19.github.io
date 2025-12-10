import { today } from './date.js';

// Inicializa manejo de URL
export function initUrl() {
  // Vista actual
  let selectedView = getUrlView();
  // Fecha actual
  let selectedDate = getUrlDate();

  // Actualiza parámetros en la URL
  function updateUrl() {
    const url = new URL(window.location);

    url.searchParams.set('view', selectedView);
    url.searchParams.set('date', selectedDate.toLocaleDateString('en-CA'));

    history.replaceState(null, '', url);
  }

  // Cambia vista y actualiza URL
  document.addEventListener('view-change', (event) => {
    selectedView = event.detail.view;
    updateUrl();
  });

  // Cambia fecha y actualiza URL
  document.addEventListener('date-change', (event) => {
    selectedDate = event.detail.date instanceof Date
      ? event.detail.date
      : new Date(event.detail.date);
    updateUrl();
  });
}

// Obtiene vista desde URL
export function getUrlView() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('view') || 'month';
}

// Obtiene fecha desde URL
export function getUrlDate() {
  const urlParams = new URLSearchParams(window.location.search);
  const dateStr = urlParams.get('date');

  if (!dateStr) return today();

  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}
