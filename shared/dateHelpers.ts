export const defaultDateFormat = "dd.MM.yyyy";

export const getLocalDateString = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
