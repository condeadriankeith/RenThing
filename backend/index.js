require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Make Stripe optional
let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const stripeModule = require('stripe');
    stripe = stripeModule(process.env.STRIPE_SECRET_KEY);
  } else {
    console.log('Stripe not configured - payments will be disabled');
    stripe = null;
  }
} catch (error) {
  console.log('Stripe initialization failed - payments will be disabled');
  stripe = null;
}

// Database setup
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./renthing.db', (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  }
});

// Multer setup for image uploads
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) 
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Middleware for JWT auth
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Initialize database
function initDB() {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        user_type TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        location TEXT,
        trust_score REAL DEFAULT 0.0
      )
    `);

    // Create listings table
    db.run(`
      CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        price_per_day REAL,
        availability TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        images TEXT,
        tags TEXT,
        location TEXT
      )
    `);

    // Create bookings table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER REFERENCES listings(id),
        renter_id INTEGER REFERENCES users(id),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'Pending',
        created_at TEXT DEFAULT (datetime('now')),
        total_price NUMERIC(10, 2),
        payment_status VARCHAR(20) DEFAULT 'Pending'
      )
    `);

    // Create chat_messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER REFERENCES bookings(id),
        sender_id INTEGER REFERENCES users(id),
        message TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reviews table
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER REFERENCES bookings(id),
        reviewer_id INTEGER REFERENCES users(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Insert sample data if not exists
    db.get("SELECT * FROM users WHERE email = 'sample@user.com'", (err, row) => {
      if (err) {
        console.error('Error checking for sample user:', err);
        return;
      }
      if (!row) {
        bcrypt.hash('password', 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return;
          }
          db.run(
            "INSERT INTO users (username, email, password_hash, user_type) VALUES (?, ?, ?, ?)",
            ['sampleuser', 'sample@user.com', hashedPassword, 'Individual'],
            function(err) {
              if (err) {
                console.error('Error inserting sample user:', err);
                return;
              }
              const userId = this.lastID;
              db.run(
                "INSERT INTO listings (owner_id, title, description, category, price_per_day, availability, images, tags, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [userId, 'Sample Bike', 'A nice bike for rent', 'Vehicles', 10.00, JSON.stringify({from: '2023-01-01', to: '2023-12-31'}), JSON.stringify(['bike.jpg']), 'bike,transport', '40.7128,-74.0060'],
                (err) => {
                  if (err) {
                    console.error('Error inserting sample listing:', err);
                  } else {
                    console.log('Database initialized with sample data');
                  }
                }
              );
            }
          );
        });
      } else {
        console.log('Sample data already exists');
      }
    });
  });
}

// User registration
app.post('/api/users/register', (req, res) => {
  const { username, email, password, user_type } = req.body;
  if (!username || !email || !password || !user_type) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });
    db.run(
      'INSERT INTO users (username, email, password_hash, user_type) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, user_type],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Internal server error' });
        }
        db.get('SELECT id, username, email, user_type FROM users WHERE id = ?', [this.lastID], (err, row) => {
          if (err) return res.status(500).json({ error: 'Internal server error' });
          res.status(201).json({ user: row });
        });
      }
    );
  });
});

// User login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    bcrypt.compare(password, user.password_hash, (err, match) => {
      if (err || !match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          user_type: user.user_type 
        } 
      });
    });
  });
});

// Get current user
app.get('/api/users/me', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, user_type, trust_score FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  });
});

// Get all listings
app.get('/api/listings', (req, res) => {
  db.all('SELECT * FROM listings', (err, rows) => {
    if (err) {
      console.error('Error fetching listings:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ listings: rows });
  });
});
// Get featured listings (e.g., top 4 by rating or random)
app.get('/api/listings/featured', (req, res) => {
  db.all('SELECT * FROM listings ORDER BY RANDOM() LIMIT 4', (err, rows) => {
    if (err) {
      console.error('Error fetching featured listings:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ listings: rows });
  });
});

// Get recommended listings (e.g., by popularity or user history)
app.get('/api/listings/recommended', (req, res) => {
  db.all('SELECT * FROM listings ORDER BY RANDOM() LIMIT 4', (err, rows) => {
    if (err) {
      console.error('Error fetching recommended listings:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ listings: rows });
  });
});

// Get nearby listings (by user location, fallback to all if not logged in)
app.get('/api/listings/nearby', authenticateToken, (req, res) => {
  db.get('SELECT location FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user || !user.location) {
      // fallback: return random listings
      db.all('SELECT * FROM listings ORDER BY RANDOM() LIMIT 4', (err, rows) => {
        if (err) {
          console.error('Error fetching nearby listings:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ listings: rows });
      });
      return;
    }
    // Find listings with location nearby (simple string match for demo)
    db.all('SELECT * FROM listings WHERE location = ? OR location IS NULL ORDER BY RANDOM() LIMIT 4', [user.location], (err, rows) => {
      if (err) {
        console.error('Error fetching nearby listings:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ listings: rows });
    });
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM listings WHERE category IS NOT NULL', (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ categories: rows.map(r => r.category) });
  });
});

// Get promo banner (static for now)
app.get('/api/promo', (req, res) => {
  res.json({ banner: { title: 'Summer Special!', description: 'Get 20% off on all outdoor equipment', cta: 'Rent Now' } });
});

// Create listing
app.post('/api/listings', authenticateToken, (req, res) => {
  const { title, description, category, price_per_day, availability, images, tags, location } = req.body;
  db.run(
    'INSERT INTO listings (owner_id, title, description, category, price_per_day, availability, images, tags, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, title, description, category, price_per_day, JSON.stringify(availability), JSON.stringify(images), tags, location],
    function(err) {
      if (err) {
        console.error('Error creating listing:', err);
        return res.status(500).json({ error: 'Error creating listing' });
      }
      db.get('SELECT * FROM listings WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching created listing:', err);
          return res.status(500).json({ error: 'Error fetching created listing' });
        }
        res.status(201).json({ listing: row });
      });
    }
  );
});

// Image upload
app.post('/api/listings/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Create booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { listing_id, start_date, end_date } = req.body;
  if (!listing_id || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    'INSERT INTO bookings (listing_id, renter_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
    [listing_id, req.user.id, start_date, end_date, 'Pending'],
    function(err) {
      if (err) {
        console.error('Error creating booking:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      db.get(
        `SELECT b.*, l.title as listing_title, u.username as owner_username 
         FROM bookings b 
         JOIN listings l ON b.listing_id = l.id 
         JOIN users u ON l.owner_id = u.id 
         WHERE b.id = ?`,
        [this.lastID],
        (err, row) => {
          if (err) {
            console.error('Error fetching created booking:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
          res.status(201).json({ booking: row });
        }
      );
    }
  );
});

// Get bookings for a user
app.get('/api/bookings/user/me', authenticateToken, (req, res) => {
  db.all(
    `SELECT b.*, l.title as listing_title, u.username as owner_username 
     FROM bookings b 
     JOIN listings l ON b.listing_id = l.id 
     JOIN users u ON l.owner_id = u.id 
     WHERE b.renter_id = ? OR l.owner_id = ? 
     ORDER BY b.created_at DESC`,
    [req.user.id, req.user.id],
    (err, rows) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ bookings: rows });
    }
  );
});

// Update booking status
app.put('/api/bookings/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  db.run(
    'UPDATE bookings SET status = ? WHERE id = ?',
    [status, req.params.id],
    function(err) {
      if (err) {
        console.error('Error updating booking status:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
          console.error('Error fetching updated booking:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ booking: row });
      });
    }
  );
});

// Chat messages for a booking
app.get('/api/chat/:bookingId', authenticateToken, (req, res) => {
  db.all(
    `SELECT cm.*, u.username as sender_name 
     FROM chat_messages cm
     JOIN users u ON cm.sender_id = u.id
     WHERE cm.booking_id = ?
     ORDER BY cm.sent_at ASC`,
    [req.params.bookingId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching chat messages:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ messages: rows });
    }
  );
});

// Send chat message
app.post('/api/chat', authenticateToken, (req, res) => {
  const { booking_id, message } = req.body;
  if (!booking_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    'INSERT INTO chat_messages (booking_id, sender_id, message) VALUES (?, ?, ?)',
    [booking_id, req.user.id, message],
    function(err) {
      if (err) {
        console.error('Error sending chat message:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      db.get(
        `SELECT cm.*, u.username as sender_name 
         FROM chat_messages cm
         JOIN users u ON cm.sender_id = u.id
         WHERE cm.id = ?`,
        [this.lastID],
        (err, row) => {
          if (err) {
            console.error('Error fetching created message:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
          res.status(201).json({ message: row });
        }
      );
    }
  );
});

// Payment with Stripe
app.post('/api/payments/create', authenticateToken, async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Payment system not configured' });
  }
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment error' });
  }
});

const port = process.env.PORT || 5000;

// Initialize database and start server
initDB();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
