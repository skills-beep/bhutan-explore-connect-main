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

// ============================================
// PRESENCE TRACKING ENDPOINTS
// ============================================

// Set user online/offline status
app.post('/api/presence/update', async (req, res) => {
  try {
    const { userId, isOnline } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Upsert user presence
    const { data, error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: userId,
        is_online: isOnline === true,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('Presence update error:', error);
      return res.status(500).json({ error: 'Failed to update presence' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get online users
app.get('/api/presence/online', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_presence')
      .select('user_id, is_online, last_seen_at')
      .eq('is_online', true);

    if (error) {
      console.error('Fetch online error:', error);
      return res.status(500).json({ error: 'Failed to fetch online users' });
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user presence status
app.get('/api/presence/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const { data, error } = await supabase
      .from('user_presence')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Fetch presence error:', error);
      return res.status(500).json({ error: 'Failed to fetch presence' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// CONNECTION REQUESTS ENDPOINTS
// ============================================

// Send connection request
app.post('/api/connection-requests', async (req, res) => {
  try {
    const { fromUserId, toUserId, message } = req.body;

    if (!fromUserId || !toUserId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('connection_requests')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        message,
        status: 'pending',
      })
      .select();

    if (error) {
      console.error('Connection request error:', error);
      return res.status(500).json({ error: 'Failed to send connection request' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get connection requests for user
app.get('/api/connection-requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get both received and sent requests
    const { data: received, error: recError } = await supabase
      .from('connection_requests')
      .select('*, from_user:connect_profiles!from_user_id(*)')
      .eq('to_user_id', userId);

    const { data: sent, error: sentError } = await supabase
      .from('connection_requests')
      .select('*, to_user:connect_profiles!to_user_id(*)')
      .eq('from_user_id', userId);

    if (recError || sentError) {
      console.error('Fetch requests error:', recError || sentError);
      return res.status(500).json({ error: 'Failed to fetch connection requests' });
    }

    res.json({ success: true, data: { received: received || [], sent: sent || [] } });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update connection request status
app.patch('/api/connection-requests/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({ error: 'Request ID and status required' });
    }

    if (!['pending', 'accepted', 'rejected', 'blocked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('connection_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select();

    if (error) {
      console.error('Update request error:', error);
      return res.status(500).json({ error: 'Failed to update connection request' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// MESSAGES ENDPOINTS
// ============================================

// Send message
app.post('/api/messages', async (req, res) => {
  try {
    const { fromUserId, toUserId, message } = req.body;

    if (!fromUserId || !toUserId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        message,
        content: message, // Support both field names
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Message send error:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages for user pair
app.get('/api/messages/:fromUserId/:toUserId', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.params;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*, from_user:connect_profiles!from_user_id(*)')
      .or(
        `and(from_user_id.eq.${fromUserId},to_user_id.eq.${toUserId}),and(from_user_id.eq.${toUserId},to_user_id.eq.${fromUserId})`
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch messages error:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as read
app.patch('/api/messages/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ error: 'Message ID required' });
    }

    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select();

    if (error) {
      console.error('Mark read error:', error);
      return res.status(500).json({ error: 'Failed to mark message as read' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Email service running on port ${PORT}`);
});
