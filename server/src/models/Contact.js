/**
 * Contact Model
 * Stores contact form submissions
 */

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
      default: 'General Inquiry'
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isReplied: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
contactSchema.index({ email: 1 });
contactSchema.index({ isRead: 1 });
contactSchema.index({ createdAt: -1 });

/**
 * Mark as read
 */
contactSchema.methods.markAsRead = async function () {
  this.isRead = true;
  await this.save();
};

/**
 * Mark as replied
 */
contactSchema.methods.markAsReplied = async function () {
  this.isReplied = true;
  await this.save();
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
