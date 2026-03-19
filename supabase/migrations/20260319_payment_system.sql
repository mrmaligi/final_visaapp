-- =====================================================
-- PAYMENT SYSTEM DATABASE MIGRATION
-- Run this in Supabase SQL Editor to ensure all tables exist
-- =====================================================

-- 1. PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('visa_unlock', 'consultation', 'refund')),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
    stripe_payment_intent_id VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Payments RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage payments" ON payments;
CREATE POLICY "Service role can manage payments"
    ON payments FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. LAWYER_EARNINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lawyer_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lawyer_id UUID NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    net_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Lawyer earnings RLS
ALTER TABLE lawyer_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lawyers can view own earnings" ON lawyer_earnings;
CREATE POLICY "Lawyers can view own earnings"
    ON lawyer_earnings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM lawyers WHERE lawyers.id = lawyer_earnings.lawyer_id AND lawyers.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Service role can manage earnings" ON lawyer_earnings;
CREATE POLICY "Service role can manage earnings"
    ON lawyer_earnings FOR ALL
    USING (true)
    WITH CHECK (true);

-- 3. LAWYER_PRICING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lawyer_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lawyer_id UUID NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
    visa_type VARCHAR(100) NOT NULL,
    duration_30_price DECIMAL(10, 2) NOT NULL DEFAULT 150,
    duration_60_price DECIMAL(10, 2) NOT NULL DEFAULT 250,
    duration_90_price DECIMAL(10, 2) NOT NULL DEFAULT 350,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(lawyer_id, visa_type)
);

-- Lawyer pricing RLS
ALTER TABLE lawyer_pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lawyers can manage own pricing" ON lawyer_pricing;
CREATE POLICY "Lawyers can manage own pricing"
    ON lawyer_pricing FOR ALL
    USING (EXISTS (
        SELECT 1 FROM lawyers WHERE lawyers.id = lawyer_pricing.lawyer_id AND lawyers.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Public can view lawyer pricing" ON lawyer_pricing;
CREATE POLICY "Public can view lawyer pricing"
    ON lawyer_pricing FOR SELECT
    USING (is_active = true);

-- 4. CONSULTATIONS TABLE (Add columns if missing)
-- =====================================================
DO $$
BEGIN
    -- Add stripe_payment_intent_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consultations' AND column_name = 'stripe_payment_intent_id'
    ) THEN
        ALTER TABLE consultations ADD COLUMN stripe_payment_intent_id VARCHAR(255);
    END IF;

    -- Add client_notes if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consultations' AND column_name = 'client_notes'
    ) THEN
        ALTER TABLE consultations ADD COLUMN client_notes TEXT;
    END IF;

    -- Add meeting_link if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consultations' AND column_name = 'meeting_link'
    ) THEN
        ALTER TABLE consultations ADD COLUMN meeting_link VARCHAR(500);
    END IF;
END $$;

-- 5. VISA_PURCHASES TABLE (Ensure it exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS visa_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    visa_id UUID NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    amount_paid DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    access_status VARCHAR(50) DEFAULT 'active' CHECK (access_status IN ('active', 'expired', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, visa_id)
);

-- Visa purchases RLS
ALTER TABLE visa_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON visa_purchases;
CREATE POLICY "Users can view own purchases"
    ON visa_purchases FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage purchases" ON visa_purchases;
CREATE POLICY "Service role can manage purchases"
    ON visa_purchases FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lawyer_earnings_lawyer_id ON lawyer_earnings(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_earnings_status ON lawyer_earnings(status);

CREATE INDEX IF NOT EXISTS idx_lawyer_pricing_lawyer_id ON lawyer_pricing(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_pricing_visa_type ON lawyer_pricing(visa_type);

CREATE INDEX IF NOT EXISTS idx_consultations_client_id ON consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON consultations(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_at ON consultations(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

CREATE INDEX IF NOT EXISTS idx_visa_purchases_user_id ON visa_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_visa_purchases_visa_id ON visa_purchases(visa_id);

-- 7. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    -- Payments trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at'
    ) THEN
        CREATE TRIGGER update_payments_updated_at
            BEFORE UPDATE ON payments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Lawyer earnings trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_lawyer_earnings_updated_at'
    ) THEN
        CREATE TRIGGER update_lawyer_earnings_updated_at
            BEFORE UPDATE ON lawyer_earnings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Lawyer pricing trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_lawyer_pricing_updated_at'
    ) THEN
        CREATE TRIGGER update_lawyer_pricing_updated_at
            BEFORE UPDATE ON lawyer_pricing
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 8. SEED DEFAULT PLATFORM SETTINGS
-- =====================================================
INSERT INTO platform_settings (setting_key, setting_value, description)
VALUES 
    ('platform_commission', '"0.15"', 'Platform commission percentage on consultations (15%)'),
    ('default_consultation_duration', '60', 'Default consultation duration in minutes'),
    ('min_consultation_duration', '30', 'Minimum consultation duration in minutes'),
    ('max_consultation_duration', '120', 'Maximum consultation duration in minutes'),
    ('enable_payments', 'true', 'Enable/disable payment processing')
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
SELECT 'Migration complete!' as status;
