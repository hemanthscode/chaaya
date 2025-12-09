import Contact from '../models/Contact.js';
import { ApiError, sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { parsePagination } from '../utils/validators.js';
import { sendContactNotification } from '../services/emailService.js';
import { trackContactSubmission } from '../services/analyticsService.js';
import logger from '../utils/logger.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const data = req.validatedData;
  data.ipAddress = req.ip || req.connection.remoteAddress;

  const contact = await Contact.create(data);
  sendContactNotification(data).catch(err => logger.error('Notification failed:', err));
  trackContactSubmission().catch(err => logger.error('Tracking failed:', err));

  logger.info(`Contact form: ${data.email}`);
  sendCreated(res, { contact }, MESSAGES.CONTACT.SEND_SUCCESS);
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query.page, req.query.limit);
  const query = req.query.isRead !== undefined ? { isRead: req.query.isRead === 'true' } : {};

  const [contacts, total] = await Promise.all([
    Contact.find(query).sort({ createdAt: -1 }).skip(pagination.skip()).limit(pagination.limit).lean(),
    Contact.countDocuments(query)
  ]);

  sendPaginated(res, { contacts }, { page: pagination.page, limit: pagination.limit, total });
});

export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Contact not found');

  if (!contact.isRead) await contact.markAsRead();
  sendSuccess(res, { contact }, 'Contact retrieved');
});

export const markContactAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Contact not found');

  await contact.markAsRead();
  sendSuccess(res, { contact }, 'Marked as read');
});

export const markContactAsReplied = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Contact not found');

  await contact.markAsReplied();
  if (req.body.notes) {
    contact.notes = req.body.notes;
    await contact.save();
  }
  sendSuccess(res, { contact }, 'Marked as replied');
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Contact not found');
  sendSuccess(res, null, 'Contact deleted');
});

export default {
  submitContactForm, getAllContacts, getContactById,
  markContactAsRead, markContactAsReplied, deleteContact
};
