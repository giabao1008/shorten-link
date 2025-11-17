-- Run this in Supabase SQL editor (requires service-role privileges)
select auth.admin.create_user(
  email        => 'tuyenbq.dev@gmail.com',
  password     => 'ChangeMe!2025', -- TODO: replace with a stronger secret before running
  email_confirm => true,
  user_metadata => jsonb_build_object('role', 'admin')
);
