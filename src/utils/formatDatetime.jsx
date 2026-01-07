export const formatDatetime= (value) => {
  const date = new Date(value);

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};