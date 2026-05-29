// Email verification service
// This file handles sending verification codes via email

import nodemailer from 'nodemailer';

// Configure your Gmail here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASSWORD, // Your Gmail app password (NOT regular password)
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
  userName: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: '🔐 Bhutan Explore Connect - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Bhutan Connects!</h1>
          </div>
          
          <div style="background: #f7fafc; padding: 40px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #2d3748; margin-bottom: 20px;">
              Hi <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 15px; color: #4a5568; line-height: 1.6; margin-bottom: 30px;">
              Thank you for joining Bhutan Connects! To verify your email address and start connecting with hosts and travel buddies, please use the verification code below:
            </p>
            
            <div style="background: white; border: 3px solid #667eea; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
              <p style="color: #718096; font-size: 13px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">
                Your Verification Code
              </p>
              <p style="font-size: 36px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 5px;">
                ${verificationCode}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #4a5568; background: #edf2f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ⏱️ <strong>This code expires in 10 minutes</strong>
            </p>
            
            <p style="font-size: 14px; color: #718096; margin-top: 30px;">
              Enter this code in the app to verify your email and complete your profile setup.
            </p>
            
            <p style="font-size: 14px; color: #718096; margin-top: 20px;">
              If you didn't sign up for Bhutan Connects, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #a0aec0; text-align: center; margin: 0;">
              © 2026 Bhutan Explore Connect. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
