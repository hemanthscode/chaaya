import { formatDate, formatDateTime, truncate } from './utils.js';

export const formatContactSubject = (subject) => truncate(subject, 80);
export const formatContactDate = (date) => formatDateTime(date);
export const formatImageTitle = (title) => truncate(title, 60);

export { formatDate, formatDateTime, truncate };
