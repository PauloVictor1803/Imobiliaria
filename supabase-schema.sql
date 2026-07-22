-- Execute this SQL in your Supabase SQL Editor to create the necessary tables

CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  "oldPrice" NUMERIC,
  cost NUMERIC DEFAULT 0,
  area NUMERIC DEFAULT 0,
  style TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  garages INTEGER DEFAULT 0,
  kitchens INTEGER DEFAULT 0,
  "livingRooms" INTEGER DEFAULT 0,
  "hasLeisureArea" BOOLEAN DEFAULT false,
  "isSold" BOOLEAN DEFAULT false,
  lat NUMERIC,
  lng NUMERIC,
  poi JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access
CREATE POLICY "Allow public read access" ON public.properties
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated full access" ON public.properties
  FOR ALL TO authenticated USING (true);
