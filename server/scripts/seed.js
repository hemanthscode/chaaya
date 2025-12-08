/**
 * Database Seeding Script
 * Seeds the database with initial data
 */

import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import { ENUMS } from '../src/constants/enums.js';
import logger from '../src/utils/logger.js';

/**
 * Seed data
 */
const seedData = async () => {
  try {
    await connectDatabase();
    
    logger.info('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    
    logger.info('✅ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@chaya.com',
      password: 'Admin@123',
      role: ENUMS.USER_ROLES.ADMIN,
      isActive: true
    });

    logger.info('✅ Admin user created');
    logger.info(`   Email: ${adminUser.email}`);
    logger.info(`   Password: Admin@123`);

    // Create default categories
    const categories = [
      {
        name: 'Portrait',
        slug: 'portrait',
        description: 'Capturing the essence of individuals and their personalities',
        order: 1
      },
      {
        name: 'Landscape',
        slug: 'landscape',
        description: 'Natural and urban landscapes from around the world',
        order: 2
      },
      {
        name: 'Wildlife',
        slug: 'wildlife',
        description: 'Animals in their natural habitats',
        order: 3
      },
      {
        name: 'Street',
        slug: 'street',
        description: 'Candid moments from everyday life',
        order: 4
      },
      {
        name: 'Architecture',
        slug: 'architecture',
        description: 'Buildings and structural designs',
        order: 5
      },
      {
        name: 'Abstract',
        slug: 'abstract',
        description: 'Creative and conceptual photography',
        order: 6
      }
    ];

    await Category.insertMany(categories);
    
    logger.info('✅ Categories created');
    logger.info(`   Created ${categories.length} categories`);

    logger.info('');
    logger.info('🎉 Database seeding completed successfully!');
    logger.info('');
    logger.info('📋 Summary:');
    logger.info(`   - Admin users: 1`);
    logger.info(`   - Categories: ${categories.length}`);
    logger.info('');
    logger.info('🔑 Admin Login:');
    logger.info(`   Email: admin@chaya.com`);
    logger.info(`   Password: Admin@123`);
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();
