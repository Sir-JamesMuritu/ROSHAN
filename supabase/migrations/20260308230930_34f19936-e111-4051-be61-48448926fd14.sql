
-- Table to track issued student certificates
CREATE TABLE public.student_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  certificate_number text NOT NULL,
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id)
);

ALTER TABLE public.student_certificates ENABLE ROW LEVEL SECURITY;

-- Students can view their own certificates
CREATE POLICY "Students can view own certificates"
  ON public.student_certificates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all certificates
CREATE POLICY "Admins can manage certificates"
  ON public.student_certificates
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Students can insert their own certificates (for self-service generation)
CREATE POLICY "Students can generate own certificates"
  ON public.student_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
