// Frontend utility to interact with email verification API

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const emailVerificationService = {
  async sendVerificationCode(email: string, userName: string) {
    try {
      const response = await fetch(`${API_BASE}/api/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Send verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send verification code',
      };
    }
  },

  async verifyCode(email: string, code: string) {
    try {
      const response = await fetch(`${API_BASE}/api/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Verify code error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify code',
      };
    }
  },
};
