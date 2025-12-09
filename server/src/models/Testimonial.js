import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, trim: true, maxlength: 100 },
  content: { type: String, required: true, trim: true, maxlength: 500 },
  avatar: { type: String },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

testimonialSchema.index({ featured: 1, status: 1 });

export default mongoose.model('Testimonial', testimonialSchema);
