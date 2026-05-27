ALTER TABLE public.pet_audit_log
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_pet_audit_log_user_id ON public.pet_audit_log(user_id);

ALTER TABLE public.pets
  ADD COLUMN age TEXT;
