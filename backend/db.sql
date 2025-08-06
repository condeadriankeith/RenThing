-- Database schema for RenThing

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL, -- Individual, Business, Service Provider
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price_per_day NUMERIC(10, 2),
  availability JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings(id),
  renter_id INTEGER REFERENCES users(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending', -- Pending, Accepted, In Use, Returned, Cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  sender_id INTEGER REFERENCES users(id),
  message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add location to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS location POINT;

-- Add images and tags to listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS images JSONB;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS tags VARCHAR(255)[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location POINT;

-- Add payment info to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'Pending';

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  reviewer_id INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trust scores (simplified)
ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_score NUMERIC(3,1) DEFAULT 0.0;
