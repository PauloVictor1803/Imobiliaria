-- Run these commands in your Supabase SQL editor to add the new columns

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS "oldPrice" NUMERIC,
ADD COLUMN IF NOT EXISTS "isSold" BOOLEAN DEFAULT false;
