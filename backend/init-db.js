const db = require('./db/client');

async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Create UUID extension
    await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create shops table
    await db.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        language TEXT DEFAULT 'hindi',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create bills table
    await db.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        shop_id UUID REFERENCES shops(id),
        customer_name TEXT,
        items JSONB NOT NULL,
        total_amount NUMERIC NOT NULL,
        voice_transcript TEXT,
        payment_link TEXT,
        razorpay_payment_link_id TEXT,
        payment_status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Insert test shop
    const result = await db.query(`
      INSERT INTO shops (name, phone, language)
      VALUES ('Raju Kirana Store', '9999999999', 'hindi')
      ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `);
    
    const shopId = result.rows[0].id;
    console.log('✅ Database initialized!');
    console.log('🏪 Test Shop ID:', shopId);
    console.log('📝 Save this Shop ID for frontend configuration');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }
}

initDatabase();
