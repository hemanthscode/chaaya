#!/usr/bin/env node
/**
 * Database Seeding Script - Enterprise Edition
 * Creates production-ready sample data (NO DOUBLE HASHING)
 */

import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Series from '../src/models/Series.js';
import Image from '../src/models/Image.js';
import Testimonial from '../src/models/Testimonial.js';
import { ENUMS } from '../src/constants/enums.js';
import logger from '../src/utils/logger.js';

const seedData = async () => {
  try {
    await connectDatabase();
    logger.info('🌱 Enterprise seeding started...');

    // Clear existing
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Series.deleteMany({}),
      Image.deleteMany({}),
      Testimonial.deleteMany({})
    ]);

    // 1. Admin User - PLAIN PASSWORD (Schema handles hashing)
    const admin = await User.create({
      name: 'Chaaya Admin',
      email: 'admin@chaaya.com',
      password: 'Admin123!',  
      role: ENUMS.USER_ROLES.ADMIN
    });

    // 2. Categories
    const categories = await Category.insertMany([
      { name: 'Portrait', slug: 'portrait', order: 1, description: 'People & emotions' },
      { name: 'Landscape', slug: 'landscape', order: 2, description: 'Nature & travel' },
      { name: 'Street', slug: 'street', order: 3, description: 'Urban life' }
    ]);

    // 3. Series
    const portraitSeries = await Series.create({
      title: 'Portraits 2024',
      slug: 'portraits-2024',
      description: 'Emotional portraits collection',
      category: categories[0]._id,
      featured: true,
      status: 'published'
    });

    // 4. Testimonials
    await Testimonial.insertMany([
      {
        name: 'Sarah Johnson',
        role: 'Art Director',
        content: "Chaaya's work captures emotion perfectly!",
        featured: true
      }
    ]);

    logger.info('✅ Seeding complete!');
    logger.info('👤 Admin: admin@chaaya.com / Admin123!');
    logger.info('📂 Categories:', categories.length);
    logger.info('📚 Series:', 1);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
