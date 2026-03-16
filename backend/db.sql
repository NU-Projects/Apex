CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    github_username VARCHAR(100),
    linkedin_username VARCHAR(100),
    skills TEXT[],  
    role TEXT,        
    is_verified BOOLEAN DEFAULT FALSE
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
  experience_level TEXT,
  contract_type TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);