// Hoy a medianoche
export function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

// Sumar meses (ajusta al último día si aplica)
export function addMonths(date, months) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth() + months, 1, 0, 0, 0, 0);
  const lastDayOfMonth = getLastDayOfMonthDate(firstDayOfMonth);

  const dayOfMonth = Math.min(date.getDate(), lastDayOfMonth.getDate());

  return new Date(date.getFullYear(), date.getMonth() + months, dayOfMonth, 0, 0, 0, 0);
}

// Restar meses
export function subtractMonths(date, months) {
  return addMonths(date, -months);
}

// Sumar días
export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 0, 0, 0, 0);
}

// Restar días
export function subtractDays(date, days) {
  return addDays(date, -days);
}

// Generar días para vista mensual
export function generateMonthCalendarDays(currentDate) {
  const calendarDays = [];

  // Último día del mes anterior
  const lastDayOfPreviousMonthDate = getLastDayOfMonthDate(subtractMonths(currentDate, 1));

  // Completar inicio de semana con días del mes anterior
  const lastDayOfPreviousMonthWeekDay = lastDayOfPreviousMonthDate.getDay();
  if (lastDayOfPreviousMonthWeekDay !== 6) {
    for (let i = lastDayOfPreviousMonthWeekDay; i >= 0; i -= 1) {
      const calendarDay = subtractDays(lastDayOfPreviousMonthDate, i);
      calendarDays.push(calendarDay);
    }
  }

  // Días del mes actual
  const lastDayOfCurrentMonthDate = getLastDayOfMonthDate(currentDate);
  for (let i = 1; i <= lastDayOfCurrentMonthDate.getDate(); i += 1) {
    const calendarDay = addDays(lastDayOfPreviousMonthDate, i);
    calendarDays.push(calendarDay);
  }

  // Completar cuadrícula a semanas completas (7 días)
  const totalWeeks = Math.ceil(calendarDays.length / 7);
  const totalDays = totalWeeks * 7;
  const missingDayAmount = totalDays - calendarDays.length;
  for (let i = 1; i <= missingDayAmount; i += 1) {
    const calendarDay = addDays(lastDayOfCurrentMonthDate, i);
    calendarDays.push(calendarDay);
  }

  return calendarDays;
}

// Comparar si es el mismo día
export function isTheSameDay(dateA, dateB) {
  return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
}

// Generar semana (domingo a sábado)
export function generateWeekDays(date) {
  const weekDays = [];
  const firstWeekDay = subtractDays(date, date.getDay());

  for (let i = 0; i <= 6; i += 1) {
    const weekDay = addDays(firstWeekDay, i);
    weekDays.push(weekDay);
  }

  return weekDays;
}

// Último día del mes
function getLastDayOfMonthDate(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0);
}
