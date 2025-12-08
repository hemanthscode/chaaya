/**
 * Contact Controller
 * Handles contact form submissions
 */

import Contact from '../models/Contact.js';
import { ApiError, sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { parsePagination } from '../utils/validators.js';
import { sendContactNotification } from '../services/emailService.js';
import { trackContactSubmission } from '../services/analyticsService.js';
import logger from '../utils/logger.js';

/**
 * @desc    Submit contact form
 * @route   POST /api/v1/contact
 * @access  Public
 */
export const submitContactForm = asyncHandler(async (req, res) => {
  const data = req.validatedData;

  // Get IP address
  const ipAddress = req.ip || req.connection.remoteAddress;

  // Create contact submission
  const contact = await Contact.create({
    ...data,
    ipAddress
  });

  // Send notification email (non-blocking)
  sendContactNotification(data).catch(err =>
    logger.error('Failed to send contact notification:', err)
  );

  // Track analytics (non-blocking)
  trackContactSubmission().catch(err =>
    logger.error('Failed to track contact submission:', err)
  );

  logger.info(`Contact form submitted: ${data.email}`);

  sendCreated(res, { contact }, MESSAGES.CONTACT.SEND_SUCCESS);
});

/**
 * @desc    Get all contact submissions
 * @route   GET /api/v1/contact
 * @access  Private/Admin
 */
export const getAllContacts = asyncHandler(async (req, res) => {
  const { page, limit, isRead } = req.query;

  const pagination = parsePagination(page, limit);

  // Build query
  const query = {};
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const [contacts, total] = await Promise.all([
    Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(pagination.skip())
      .limit(pagination.limit)
      .lean(),
    Contact.countDocuments(query)
  ]);

  sendPaginated(
    res,
    { contacts },
    { page: pagination.page, limit: pagination.limit, total },
    'Contact submissions retrieved successfully'
  );
});

/**
 * @desc    Get single contact submission
 * @route   GET /api/v1/contact/:id
 * @access  Private/Admin
 */
export const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Contact submission not found'
    );
  }

  // Mark as read automatically
  if (!contact.isRead) {
    await contact.markAsRead();
  }

  sendSuccess(res, { contact }, 'Contact submission retrieved successfully');
});

/**
 * @desc    Mark contact as read
 * @route   PUT /api/v1/contact/:id/read
 * @access  Private/Admin
 */
export const markContactAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Contact submission not found'
    );
  }

  await contact.markAsRead();

  sendSuccess(res, { contact }, 'Contact marked as read');
});

/**
 * @desc    Mark contact as replied
 * @route   PUT /api/v1/contact/:id/replied
 * @access  Private/Admin
 */
export const markContactAsReplied = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Contact submission not found'
    );
  }

  await contact.markAsReplied();

  if (notes) {
    contact.notes = notes;
    await contact.save();
  }

  sendSuccess(res, { contact }, 'Contact marked as replied');
});

/**
 * @desc    Delete contact submission
 * @route   DELETE /api/v1/contact/:id
 * @access  Private/Admin
 */
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Contact submission not found'
    );
  }

  await contact.deleteOne();

  logger.info(`Contact submission deleted: ${contact.email}`);

  sendSuccess(res, null, 'Contact submission deleted successfully');
});

export default {
  submitContactForm,
  getAllContacts,
  getContactById,
  markContactAsRead,
  markContactAsReplied,
  deleteContact
};
