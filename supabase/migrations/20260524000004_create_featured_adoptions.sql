-- Tracks which pet is featured on the homepage and for what date range.
-- end_date is nullable; a null value means the feature is open-ended.

CREATE TABLE public.featured_adoptions (
    id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id      UUID  NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    start_date  DATE  NOT NULL,
    end_date    DATE,

    CONSTRAINT chk_end_after_start CHECK (end_date IS NULL OR end_date > start_date)
);

CREATE INDEX idx_featured_adoptions_pet_id     ON public.featured_adoptions(pet_id);
CREATE INDEX idx_featured_adoptions_start_date ON public.featured_adoptions(start_date);

-- Row-level security
ALTER TABLE public.featured_adoptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "featured_adoptions: public read" ON public.featured_adoptions FOR SELECT USING (true);
CREATE POLICY "featured_adoptions: auth insert" ON public.featured_adoptions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "featured_adoptions: auth update" ON public.featured_adoptions FOR UPDATE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "featured_adoptions: auth delete" ON public.featured_adoptions FOR DELETE USING     (auth.uid() IS NOT NULL);
