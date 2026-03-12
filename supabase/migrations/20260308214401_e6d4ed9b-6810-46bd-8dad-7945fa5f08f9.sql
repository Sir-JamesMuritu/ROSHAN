
CREATE TABLE public.intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'upcoming', 'full')),
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.intakes ENABLE ROW LEVEL SECURITY;

-- Everyone can read active intakes
CREATE POLICY "Anyone can read active intakes" ON public.intakes
  FOR SELECT USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage intakes" ON public.intakes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_intakes_updated_at
  BEFORE UPDATE ON public.intakes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure only one active intake at a time via function
CREATE OR REPLACE FUNCTION public.ensure_single_active_intake()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.intakes SET is_active = false WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ensure_single_active_intake_trigger
  BEFORE INSERT OR UPDATE ON public.intakes
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_active_intake();

-- Seed initial intake
INSERT INTO public.intakes (name, status, is_active) VALUES ('March 2026 Intake', 'open', true);
