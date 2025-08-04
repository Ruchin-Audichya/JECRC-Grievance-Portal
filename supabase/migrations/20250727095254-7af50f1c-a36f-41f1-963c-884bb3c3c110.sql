-- Insert demo users for testing
-- Note: These will be created with password 'password123'

-- Demo student user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'student@jecrcu.edu.in',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Demo Student"}',
  false,
  '',
  '',
  '',
  ''
);

-- Demo resolver user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'resolver@jecrcu.edu.in',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Demo Resolver"}',
  false,
  '',
  '',
  '',
  ''
);

-- Demo admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@jecrcu.edu.in',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Demo Admin"}',
  false,
  '',
  '',
  '',
  ''
);

-- Create profiles for demo users
-- Student profile
INSERT INTO public.profiles (user_id, name, role, department)
SELECT id, 'Demo Student', 'student', 'Computer Science'
FROM auth.users 
WHERE email = 'student@jecrcu.edu.in';

-- Resolver profile  
INSERT INTO public.profiles (user_id, name, role, department)
SELECT id, 'Demo Resolver', 'resolver', 'IT Support'
FROM auth.users 
WHERE email = 'resolver@jecrcu.edu.in';

-- Admin profile
INSERT INTO public.profiles (user_id, name, role, department)
SELECT id, 'Demo Admin', 'admin', 'Administration'
FROM auth.users 
WHERE email = 'admin@jecrcu.edu.in';