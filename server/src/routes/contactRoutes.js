import express from 'express';
import { submitContactForm, getAllContacts, getContactById, markContactAsRead, markContactAsReplied, deleteContact } from '../controllers/contactController.js';
import { validateContactSubmission } from '../validators/contactValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', contactLimiter, validateRequest(validateContactSubmission), submitContactForm);

router.use(protect, adminOnly);
router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.put('/:id/read', markContactAsRead);
router.put('/:id/replied', markContactAsReplied);
router.delete('/:id', deleteContact);

export default router;
