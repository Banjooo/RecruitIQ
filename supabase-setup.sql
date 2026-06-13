-- ============================================
-- RECRUITIQ SUPABASE DATABASE SETUP
-- Copy and paste this entire file into Supabase SQL Editor
-- https://app.supabase.com/project/[YOUR-PROJECT]/sql
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Tenants (Organizations/Companies)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  logo_url TEXT,
  website VARCHAR(255),
  billing_plan VARCHAR(50) DEFAULT 'standard',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs (Job Postings)
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  description TEXT,
  requirements TEXT,
  salary_min DECIMAL,
  salary_max DECIMAL,
  status VARCHAR(50) DEFAULT 'active',
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates (Job Applicants)
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  cv_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'applied',
  score DECIMAL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics (Events & Metrics)
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type VARCHAR(100),
  event_name VARCHAR(100),
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices (Billing)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  mpesa_receipt VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_active ON public.tenants(active);
CREATE INDEX idx_jobs_tenant_id ON public.jobs(tenant_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_candidates_tenant_id ON public.candidates(tenant_id);
CREATE INDEX idx_candidates_job_id ON public.candidates(job_id);
CREATE INDEX idx_candidates_status ON public.candidates(status);
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_analytics_tenant_id ON public.analytics(tenant_id);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX idx_invoices_tenant_id ON public.invoices(tenant_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES (Public Read/Write)
-- ============================================
-- Note: Tighten these policies for production!

-- Tenants policies
CREATE POLICY "Allow public read on tenants" 
  ON public.tenants FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on tenants" 
  ON public.tenants FOR INSERT 
  WITH CHECK (true);

-- Jobs policies
CREATE POLICY "Allow public read on jobs" 
  ON public.jobs FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on jobs" 
  ON public.jobs FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update on jobs" 
  ON public.jobs FOR UPDATE 
  USING (true);

-- Candidates policies
CREATE POLICY "Allow public read on candidates" 
  ON public.candidates FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on candidates" 
  ON public.candidates FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update on candidates" 
  ON public.candidates FOR UPDATE 
  USING (true);

-- Analytics policies
CREATE POLICY "Allow public insert on analytics" 
  ON public.analytics FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read on analytics" 
  ON public.analytics FOR SELECT 
  USING (true);

-- Invoices policies
CREATE POLICY "Allow public read on invoices" 
  ON public.invoices FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on invoices" 
  ON public.invoices FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update on invoices" 
  ON public.invoices FOR UPDATE 
  USING (true);

-- ============================================
-- 5. ENABLE REALTIME SUBSCRIPTIONS
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.tenants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;

-- ============================================
-- 6. INSERT SAMPLE DATA (Optional)
-- ============================================

-- Sample tenant
INSERT INTO public.tenants (name, slug, email, billing_plan)
VALUES 
  ('Morggy Technologies', 'morggy-tech', 'admin@morggy.co.ke', 'standard'),
  ('Tech Solutions Kenya', 'tech-solutions', 'contact@techsol.co.ke', 'premium')
ON CONFLICT (slug) DO NOTHING;

-- Sample jobs
INSERT INTO public.jobs (tenant_id, title, company, description, status)
SELECT id, 'Senior Software Engineer', name, 'We are hiring experienced developers', 'active'
FROM public.tenants WHERE slug = 'morggy-tech'
ON CONFLICT DO NOTHING;

-- Sample candidates
INSERT INTO public.candidates (tenant_id, job_id, name, email, status)
SELECT t.id, j.id, 'John Doe', 'john@example.com', 'applied'
FROM public.tenants t, public.jobs j
WHERE t.slug = 'morggy-tech' AND j.title = 'Senior Software Engineer'
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. CREATE USEFUL FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. CREATE VIEWS FOR ANALYTICS
-- ============================================

-- Job applications summary
CREATE OR REPLACE VIEW public.job_applications_summary AS
SELECT 
  j.id,
  j.title,
  j.company,
  t.name as tenant_name,
  COUNT(c.id) as total_applications,
  COUNT(CASE WHEN c.status = 'shortlisted' THEN 1 END) as shortlisted_count,
  COUNT(CASE WHEN c.status = 'rejected' THEN 1 END) as rejected_count,
  AVG(c.score) as avg_candidate_score
FROM public.jobs j
LEFT JOIN public.candidates c ON j.id = c.job_id
LEFT JOIN public.tenants t ON j.tenant_id = t.id
GROUP BY j.id, j.title, j.company, t.id, t.name;

-- Tenant statistics
CREATE OR REPLACE VIEW public.tenant_statistics AS
SELECT 
  t.id,
  t.name,
  t.slug,
  COUNT(DISTINCT j.id) as total_jobs,
  COUNT(DISTINCT c.id) as total_candidates,
  COUNT(DISTINCT i.id) as total_invoices,
  SUM(CASE WHEN i.status = 'paid' THEN i.amount ELSE 0 END) as revenue
FROM public.tenants t
LEFT JOIN public.jobs j ON t.id = j.tenant_id
LEFT JOIN public.candidates c ON t.id = c.tenant_id
LEFT JOIN public.invoices i ON t.id = i.tenant_id
GROUP BY t.id, t.name, t.slug;

-- ============================================
-- 9. VERIFY SETUP
-- ============================================

-- Count records (should show new tables)
SELECT 
  'tenants' as table_name, COUNT(*) as count FROM public.tenants
UNION ALL
SELECT 'jobs', COUNT(*) FROM public.jobs
UNION ALL
SELECT 'candidates', COUNT(*) FROM public.candidates
UNION ALL
SELECT 'invoices', COUNT(*) FROM public.invoices
UNION ALL
SELECT 'analytics', COUNT(*) FROM public.analytics;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- All tables, indexes, policies, and realtime subscriptions are now ready!
