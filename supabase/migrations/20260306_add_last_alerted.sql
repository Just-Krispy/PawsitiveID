-- Add last_alerted timestamp to dog_profiles for dedup between real-time and cron alerts
ALTER TABLE dog_profiles ADD COLUMN IF NOT EXISTS last_alerted TIMESTAMPTZ;
