-- Run these commands in your Supabase SQL Editor to fix the visibility of new plans!
GRANT ALL ON public.plans TO anon;
GRANT ALL ON public.plans TO authenticated;
GRANT ALL ON public.exercises TO anon;
GRANT ALL ON public.exercises TO authenticated;
