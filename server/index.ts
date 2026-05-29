import express from 'express';
import cors from 'cors';
import { sendVerificationEmail, generateVerificationCode } from './email-service';
import { supabase } from './supabase-config';

const app = express();
app.use(cors());
app.use(express.json());

// Send verification email
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email, userName } = req.body;

    if (!email || !userName) {
      return res.status(400).json({ error: 'Email and name required' });
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in Supabase
    const { error: dbError } = await supabase.from('email_verifications').insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      verified: false,
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to save verification code' });
    }

    // Send email
    const emailSent = await sendVerificationEmail(email, code, userName);

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.json({ success: true, message: 'Verification email sent!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email code
app.post('/api/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code required' });
    }

    // Check if code is valid
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    // Mark as verified
    await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('id', data[0].id);

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Email service running on port ${PORT}`);
});
