-- Initialize PostgreSQL database
-- This script runs automatically when the container is first created

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'gen_random_uuid'
    ) THEN
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    END IF;
END $$;
