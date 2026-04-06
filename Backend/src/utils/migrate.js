const db = require('../config/db');

const migrate = async () => {
  try {
    console.log('--- MIGRATION START ---');
    
    // Check current column type
    const [rows] = await db.execute("DESCRIBE bookings");
    const qrCodeColumn = rows.find(r => r.Field === 'qr_code');
    console.log('Current qr_code column definition:', qrCodeColumn);

    // Alter table to LONGTEXT
    console.log('Altering bookings table to change qr_code to LONGTEXT...');
    await db.execute("ALTER TABLE bookings MODIFY COLUMN qr_code LONGTEXT;");
    
    console.log('Altering events table to change banner_image to TEXT (for long cloudinary URLs)...');
    await db.execute("ALTER TABLE events MODIFY COLUMN banner_image TEXT;");
    await db.execute("ALTER TABLE events MODIFY COLUMN image_url TEXT;");

    console.log('✅ Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
};

migrate();
