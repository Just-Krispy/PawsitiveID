-- PawsitiveID Supabase Database Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Dog profiles table
CREATE TABLE dog_profiles (
  id TEXT PRIMARY KEY,
  breed TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  distinguishing_features TEXT[] DEFAULT '{}',
  has_collar BOOLEAN DEFAULT false,
  collar_description TEXT,
  estimated_age TEXT,
  gender TEXT DEFAULT 'unknown',
  description TEXT NOT NULL,
  confidence TEXT,
  health_notes TEXT,
  photo_url TEXT NOT NULL DEFAULT '',
  location_text TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  reporter_name TEXT,
  reporter_email TEXT,
  shelter_results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dog_profiles_breed ON dog_profiles(breed);
CREATE INDEX idx_dog_profiles_created ON dog_profiles(created_at DESC);
CREATE INDEX idx_dog_profiles_location ON dog_profiles(latitude, longitude);

-- Community sightings table
CREATE TABLE sightings (
  id TEXT PRIMARY KEY,
  dog_profile_id TEXT NOT NULL REFERENCES dog_profiles(id) ON DELETE CASCADE,
  location_text TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  spotted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  reporter_name TEXT,
  reporter_email TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sightings_dog ON sightings(dog_profile_id);
CREATE INDEX idx_sightings_location ON sightings(latitude, longitude);
CREATE INDEX idx_sightings_time ON sightings(spotted_at DESC);

-- Email alert subscriptions table
CREATE TABLE alert_subscriptions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  breed_filter TEXT,
  size_filter TEXT,
  location_text TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  radius_miles INTEGER DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  unsubscribe_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_alerts_active ON alert_subscriptions(is_active) WHERE is_active = true;
CREATE INDEX idx_alerts_breed ON alert_subscriptions(breed_filter);

-- Storage bucket for dog photos (run this separately or via Dashboard > Storage)
-- Create a bucket called "dog-photos" with public access:
-- Dashboard > Storage > New Bucket > Name: "dog-photos" > Public: ON

-- RLS Policies (allow public read, authenticated write via service key)
ALTER TABLE dog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read dog profiles" ON dog_profiles FOR SELECT USING (true);
CREATE POLICY "Public read sightings" ON sightings FOR SELECT USING (true);

-- Allow service role to insert/update (API routes use service key)
CREATE POLICY "Service insert dog profiles" ON dog_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Service insert sightings" ON sightings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service insert alerts" ON alert_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update alerts" ON alert_subscriptions FOR UPDATE USING (true);
CREATE POLICY "Service read alerts" ON alert_subscriptions FOR SELECT USING (true);
