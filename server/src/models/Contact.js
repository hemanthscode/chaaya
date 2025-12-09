import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, trim: true, maxlength: 200, default: 'General Inquiry' },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  phone: { type: String, trim: true },
  isRead: { type: Boolean, default: false },
  isReplied: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  ipAddress: { type: String, default: null }
}, { timestamps: true });

contactSchema.index({ isRead: 1, createdAt: -1 });

contactSchema.methods.markAsRead = async function() {
  this.isRead = true;
  await this.save();
};

contactSchema.methods.markAsReplied = async function() {
  this.isReplied = true;
  await this.save();
};

export default mongoose.model('Contact', contactSchema);
