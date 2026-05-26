import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env');
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const env = envText.split(/\r?\n/).reduce((acc, line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return acc;
  const [key, ...rest] = trimmed.split('=');
  acc[key] = rest.join('=');
  return acc;
}, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testEmail = 'test-profile-user@example.com';
const testPassword = 'TestProfile123!';
const profileData = {
  id: '',
  name: 'Test Profile User',
  email: testEmail,
  age: 30,
  gender: 'Non-binary',
  bio: 'This is a test profile for Bhutan Connects.',
  profile_photo: 'https://i.pravatar.cc/300?img=12',
  travel_group_code: 'TEST-GROUP',
  emergency_contact_name: 'Test Emergency',
  emergency_contact_phone: '+1234567890',
  languages: ['English', 'Dzongkha'],
  interests: ['travel', 'culture', 'photography'],
  verified: 'unverified',
  is_host: true,
  is_looking_for_buddy: false,
  profile_visibility: 'public',
};

const createOrSignInUser = async () => {
  console.log('Signing up / signing in test user:', testEmail);
  const signUpResponse = await supabase.auth.signUp({ email: testEmail, password: testPassword });

  if (signUpResponse.error && signUpResponse.error.message.includes('already registered')) {
    console.log('User already exists, signing in.');
    const signInResponse = await supabase.auth.signInWithPassword({ email: testEmail, password: testPassword });
    if (signInResponse.error) {
      console.error('Error signing in existing user:', signInResponse.error.message);
      process.exit(1);
    }
    return signInResponse.data.user;
  }
  if (signUpResponse.error) {
    console.error('Sign-up error:', signUpResponse.error.message);
    process.exit(1);
  }
  if (!signUpResponse.data.user) {
    console.error('No user returned from signUp');
    process.exit(1);
  }
  console.log('User signed up successfully.');
  return signUpResponse.data.user;
};

const insertProfile = async (userId) => {
  profileData.id = userId;
  const { data, error } = await supabase.from('connect_profiles').insert([profileData]).select();
  if (error) {
    console.error('Insert profile error:', error.message, error.details || '');
    return null;
  }
  return data?.[0];
};

const fetchProfile = async (userId) => {
  const { data, error } = await supabase.from('connect_profiles').select('*').eq('id', userId).single();
  if (error) {
    console.error('Fetch profile error:', error.message);
    return null;
  }
  return data;
};

const main = async () => {
  const user = await createOrSignInUser();
  console.log('Authenticated user id:', user.id);

  const profile = await insertProfile(user.id);
  if (profile) {
    console.log('Profile inserted successfully:');
    console.log(profile);
  } else {
    console.log('Trying to fetch existing profile...');
    const existing = await fetchProfile(user.id);
    if (existing) {
      console.log('Existing profile found:');
      console.log(existing);
    }
  }
};

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
