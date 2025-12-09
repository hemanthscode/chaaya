import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

const createTransporter = () => nodemailer.createTransporter({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: { user: config.email.user, pass: config.email.password }
});

export const sendEmail = async (to, subject, html) => {
  try {
    if (!config.email.user || !config.email.password) {
      logger.warn('Email not configured');
      return { success: false };
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: config.email.from,
      to, subject, html
    });

    logger.info('Email sent:', { messageId: info.messageId, to });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email failed:', error);
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Email failed');
  }
};

export const sendContactNotification = async (contactData) => {
  const subject = `New Contact: ${contactData.subject || 'Inquiry'}`;
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
      <p><strong>Subject:</strong> ${contactData.subject || 'General'}</p>
      <p><strong>Message:</strong><br>${contactData.message}</p>
      <p><em>${new Date().toLocaleString()}</em></p>
    </div>
  `;
  return sendEmail(config.email.user, subject, html);
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to Chaaya!</h1>
      <p>Hello ${user.name},</p>
      <p>Your account has been created successfully.</p>
      <a href="${config.clientUrl}" style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Explore Portfolio</a>
    </div>
  `;
  return sendEmail(user.email, 'Welcome to Chaaya', html);
};

export default { sendEmail, sendContactNotification, sendWelcomeEmail };
