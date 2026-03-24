CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    github_username VARCHAR(100),
    linkedin_username VARCHAR(100),
    skills TEXT[],  
    missing_skills TEXT[],
    role TEXT,        
    is_verified BOOLEAN DEFAULT FALSE,
    is_syncing BOOLEAN DEFAULT FALSE
);

CREATE TABLE otp_verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,        
  role TEXT,                    
  title TEXT NOT NULL,
  company_name TEXT,
  description TEXT,         
  url TEXT,
  location TEXT,
  normalized_location TEXT, -- AI-categorized location
  experience_level TEXT,
  contract_type TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_roadmap (
    id SERIAL PRIMARY KEY,

    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,

    stage_name VARCHAR(100) NOT NULL,
    stage_order INT NOT NULL,

    skill_name VARCHAR(150) NOT NULL,

    status VARCHAR(20) DEFAULT 'not_started'
        CHECK (status IN ('not_started', 'in_progress', 'completed')),

    is_unlocked BOOLEAN DEFAULT FALSE,
    quiz_passed BOOLEAN DEFAULT FALSE,

    is_project BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);