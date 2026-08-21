CREATE TYPE public.app_role AS ENUM ('patient','doctor','admin');
CREATE TYPE public.triage_priority AS ENUM ('RED','AMBER','GREEN');
CREATE TYPE public.interview_status AS ENUM ('DRAFT','TRANSCRIBED','EXTRACTED','TRIAGED','SUBMITTED','REVIEWED','INFO_REQUESTED');
CREATE TYPE public.doctor_decision AS ENUM ('ACCEPT','OVERRIDE','REQUEST_INFO');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  preferred_language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_code text NOT NULL UNIQUE DEFAULT ('PT-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  sex text,
  year_of_birth integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.patients TO authenticated;
GRANT ALL ON public.patients TO service_role;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  language text NOT NULL,
  input_mode text NOT NULL DEFAULT 'voice',
  status public.interview_status NOT NULL DEFAULT 'DRAFT',
  audio_path text,
  audio_duration_seconds numeric,
  transcript text,
  transcript_provider text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.interviews TO authenticated;
GRANT ALL ON public.interviews TO service_role;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.patient_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  input_type text NOT NULL,
  raw_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.patient_responses TO authenticated;
GRANT ALL ON public.patient_responses TO service_role;
ALTER TABLE public.patient_responses ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.clinical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL UNIQUE REFERENCES public.interviews(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  structured jsonb NOT NULL DEFAULT '{}'::jsonb,
  standardized jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary text,
  missing_information jsonb NOT NULL DEFAULT '[]'::jsonb,
  uncertainties jsonb NOT NULL DEFAULT '[]'::jsonb,
  extraction_model text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.clinical_records TO authenticated;
GRANT ALL ON public.clinical_records TO service_role;
ALTER TABLE public.clinical_records ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.triage_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL UNIQUE REFERENCES public.interviews(id) ON DELETE CASCADE,
  clinical_record_id uuid REFERENCES public.clinical_records(id) ON DELETE SET NULL,
  priority public.triage_priority,
  model_available boolean NOT NULL DEFAULT false,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  red_flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  model_name text,
  model_version text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.triage_assessments TO authenticated;
GRANT ALL ON public.triage_assessments TO service_role;
ALTER TABLE public.triage_assessments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.doctor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision public.doctor_decision NOT NULL,
  ai_priority public.triage_priority,
  doctor_priority public.triage_priority,
  reason text,
  requested_information text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.doctor_reviews TO authenticated;
GRANT ALL ON public.doctor_reviews TO service_role;
ALTER TABLE public.doctor_reviews ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_patient_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.patients WHERE profile_id = auth.uid()
$$;

CREATE POLICY "profiles_select_own_or_staff" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "user_roles_select_own_or_admin" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "patients_select" ON public.patients FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "patients_insert_own" ON public.patients FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "patients_update_own" ON public.patients FOR UPDATE TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "interviews_select" ON public.interviews FOR SELECT TO authenticated
  USING (patient_id = public.current_patient_id() OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "interviews_insert_own" ON public.interviews FOR INSERT TO authenticated
  WITH CHECK (patient_id = public.current_patient_id());
CREATE POLICY "interviews_update_own" ON public.interviews FOR UPDATE TO authenticated
  USING (patient_id = public.current_patient_id()) WITH CHECK (patient_id = public.current_patient_id());
CREATE POLICY "interviews_update_staff" ON public.interviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "responses_select" ON public.patient_responses FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.interviews i WHERE i.id = interview_id
    AND (i.patient_id = public.current_patient_id() OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "responses_insert_own" ON public.patient_responses FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.interviews i WHERE i.id = interview_id AND i.patient_id = public.current_patient_id()));

CREATE POLICY "clinical_select" ON public.clinical_records FOR SELECT TO authenticated
  USING (patient_id = public.current_patient_id() OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "clinical_insert_own" ON public.clinical_records FOR INSERT TO authenticated
  WITH CHECK (patient_id = public.current_patient_id());
CREATE POLICY "clinical_update_own" ON public.clinical_records FOR UPDATE TO authenticated
  USING (patient_id = public.current_patient_id()) WITH CHECK (patient_id = public.current_patient_id());

CREATE POLICY "triage_select" ON public.triage_assessments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.interviews i WHERE i.id = interview_id
    AND (i.patient_id = public.current_patient_id() OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "triage_insert_own" ON public.triage_assessments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.interviews i WHERE i.id = interview_id AND i.patient_id = public.current_patient_id()));
CREATE POLICY "triage_update_own" ON public.triage_assessments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.interviews i WHERE i.id = interview_id AND i.patient_id = public.current_patient_id()));

CREATE POLICY "reviews_select" ON public.doctor_reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin')
    OR EXISTS (SELECT 1 FROM public.interviews i WHERE i.id = interview_id AND i.patient_id = public.current_patient_id()));
CREATE POLICY "reviews_insert_doctor" ON public.doctor_reviews FOR INSERT TO authenticated
  WITH CHECK (doctor_id = auth.uid() AND (public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "audit_select_admin" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR actor_id = auth.uid());
CREATE POLICY "audit_insert_self" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_language)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'preferred_language','en'))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'patient'))
  ON CONFLICT DO NOTHING;

  IF COALESCE(NEW.raw_user_meta_data->>'role','patient') = 'patient' THEN
    INSERT INTO public.patients (profile_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER interviews_touch BEFORE UPDATE ON public.interviews
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_interviews_patient ON public.interviews(patient_id);
CREATE INDEX idx_interviews_status ON public.interviews(status);
CREATE INDEX idx_reviews_interview ON public.doctor_reviews(interview_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);

CREATE POLICY "audio_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assessment-audio' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "audio_select_own_or_staff" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'assessment-audio' AND ((storage.foldername(name))[1] = auth.uid()::text
    OR public.has_role(auth.uid(),'doctor') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "audio_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'assessment-audio' AND (storage.foldername(name))[1] = auth.uid()::text);