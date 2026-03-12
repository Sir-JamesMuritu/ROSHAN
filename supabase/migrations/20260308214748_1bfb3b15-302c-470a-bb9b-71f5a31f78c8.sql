
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  program TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can read active testimonials
CREATE POLICY "Anyone can read active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed with existing data
INSERT INTO public.testimonials (name, role, program, rating, text) VALUES
  ('Grace Mwangi', 'Data Analyst at Safaricom', 'Data Analytics Professional', 5, 'RDTI completely transformed my career. I went from knowing nothing about data to landing a job as a data analyst within 3 months of completing the program.'),
  ('Kevin Ochieng', 'ML Engineer at Andela', 'Python for AI & Machine Learning', 5, 'The hands-on approach made all the difference. I built real ML models during the course that I later showcased in interviews. The instructors are world-class.'),
  ('Amina Hassan', 'BI Consultant', 'Business Intelligence & Reporting', 4, 'The Power BI and Tableau skills I gained here are what I use daily in my consulting work. Practical, relevant, and extremely well-taught.'),
  ('David Kimani', 'Junior Developer at KCB', 'SQL & Database Management', 5, 'I was struggling with databases before RDTI. Now I write complex SQL queries confidently and even mentor others. Best investment I''ve made in myself.');
