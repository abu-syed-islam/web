-- Migration: Create time_slots table for managing available booking time slots
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week, start_time, end_time)
);

-- Create index for day_of_week queries
CREATE INDEX IF NOT EXISTS idx_time_slots_day_of_week ON time_slots(day_of_week);

-- Enable Row Level Security
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to time slots
CREATE POLICY "Allow public read access to time slots"
  ON time_slots
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated admin users to manage time slots
CREATE POLICY "Allow authenticated admin to insert time slots"
  ON time_slots
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to update time slots"
  ON time_slots
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to delete time slots"
  ON time_slots
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert default time slots (Monday to Friday, 9 AM to 6 PM, 1-hour slots)
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available)
SELECT 
  day_num,
  (LPAD(start_hour::text, 2, '0') || ':00:00')::time as start_time,
  (LPAD((start_hour + 1)::text, 2, '0') || ':00:00')::time as end_time,
  true
FROM generate_series(0, 4) as day_num
CROSS JOIN generate_series(9, 17) as start_hour
ON CONFLICT (day_of_week, start_time, end_time) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_time_slots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_time_slots_updated_at
  BEFORE UPDATE ON time_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_time_slots_updated_at();
