import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENUMS } from '../constants/enums.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: Object.values(ENUMS.USER_ROLES), default: ENUMS.USER_ROLES.USER },
  avatar: { type: String, default: null },
  bio: { type: String, maxlength: 500, default: '' },
  website: { type: String, default: null },
  social: {
    instagram: String, twitter: String, facebook: String, linkedin: String
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.index({ role: 1, isActive: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id, name: this.name, email: this.email, role: this.role,
    avatar: this.avatar, bio: this.bio, website: this.website,
    social: this.social, createdAt: this.createdAt
  };
};

userSchema.methods.isAdmin = function() {
  return this.role === ENUMS.USER_ROLES.ADMIN;
};

export default mongoose.model('User', userSchema);
