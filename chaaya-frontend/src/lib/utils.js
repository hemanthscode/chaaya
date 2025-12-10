export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
};

export const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
};

export const truncate = (text, length = 120) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.slice(0, length)}…`;
};
