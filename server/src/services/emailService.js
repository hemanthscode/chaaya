/**
 * Email Service
 * Handles email sending functionality
 */

import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });
};

/**
 * Send email
 */
export const sendEmail = async (to, subject, html, text = null) => {
  try {
    if (!config.email.user || !config.email.password) {
      logger.warn('Email service not configured - skipping email send');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      html,
      text: text || stripHtml(html)
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully:', {
      messageId: info.messageId,
      to
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send failed:', error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to send email'
    );
  }
};

/**
 * Send contact form notification to admin
 */
export const sendContactNotification = async (contactData) => {
  const subject = `New Contact Form Submission: ${contactData.subject || 'General Inquiry'}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Chaya Portfolio - New Contact Message</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${contactData.name}
          </div>
          <div class="field">
            <span class="label">Email:</span> ${contactData.email}
          </div>
          ${contactData.phone ? `
          <div class="field">
            <span class="label">Phone:</span> ${contactData.phone}
          </div>
          ` : ''}
          <div class="field">
            <span class="label">Subject:</span> ${contactData.subject || 'General Inquiry'}
          </div>
          <div class="field">
            <span class="label">Message:</span>
            <p>${contactData.message}</p>
          </div>
          <div class="field">
            <span class="label">Received:</span> ${new Date().toLocaleString()}
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from your Chaya portfolio website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(config.email.user, subject, html);
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Chaya Portfolio';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 30px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Chaya!</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Thank you for registering with Chaya Photography Portfolio. We're excited to have you!</p>
          <p>Your account has been successfully created and you can now explore our collection.</p>
          <a href="${config.clientUrl}" class="button">Explore Portfolio</a>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to contact us.</p>
          <p>&copy; ${new Date().getFullYear()} Chaya Portfolio. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(user.email, subject, html);
};

/**
 * Strip HTML tags for plain text version
 */
const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Test email configuration
 */
export const testEmailConnection = async () => {
  try {
    if (!config.email.user || !config.email.password) {
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    await transporter.verify();
    
    logger.info('Email service connection successful');
    return { success: true, message: 'Email service is working' };
  } catch (error) {
    logger.error('Email connection test failed:', error);
    return { success: false, message: error.message };
  }
};

export default {
  sendEmail,
  sendContactNotification,
  sendWelcomeEmail,
  testEmailConnection
};
