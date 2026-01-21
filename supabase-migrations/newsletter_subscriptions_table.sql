-- Migration: Create newsletter_subscriptions table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

-- Enable Row Level Security
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert (for newsletter signups)
CREATE POLICY "Allow public newsletter subscriptions"
  ON newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Don't allow public reads (privacy)
-- Only authenticated admin users should be able to read subscriptions
