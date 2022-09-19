export const defaultDateFormat = "dd.MM.yyyy";

export const getLocalDateString = (date: Date) =>
  date.toLocaleDateString(navigator.language, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
