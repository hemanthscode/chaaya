import mongoose from 'mongoose';

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidSlug = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
export const sanitizeString = (str) => (str ? str.replace(/<[^>]*>/g, '').trim() : '');
export const generateSlug = (str) => 
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export const isStrongPassword = (password) => 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

export const parsePagination = (page, limit) => {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  return {
    page: parsedPage > 0 ? parsedPage : 1,
    limit: parsedLimit > 0 && parsedLimit <= 100 ? parsedLimit : 20,
    skip: function() { return (this.page - 1) * this.limit; }
  };
};

export default {
  isValidObjectId, isValidEmail, isValidSlug, sanitizeString,
  generateSlug, isStrongPassword, parsePagination
};
