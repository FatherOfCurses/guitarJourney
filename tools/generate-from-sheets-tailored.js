/**
 * Generate carousel seed script from your Google Sheets
 * Tailored to your exact column structure
 * 
 * Sheet columns: filename, width, height, photourl, attribution, license, 
 *                licenseURL, alt, title, creatorname, creatorURL, originalFileURL
 * 
 * USAGE:
 * 1. Make sheet public: Share → Anyone with link can view
 * 2. Run: node generate-from-sheets-tailored.js
 */

const https = require('https');
const fs = require('fs');

const SHEET_ID = '184LBXUps-8BIL8TxfzhNuW4qr_KpxUrm1jNGu6N_Qo4';
const SHEET_NAME = 'Sheet1';

/**
 * Fetch spreadsheet as CSV
 */
function fetchSheetAsCSV() {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
    
    console.log('📥 Fetching from Google Sheets...');
    
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} - Is the sheet public?`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Parse CSV with proper quote handling
 */
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  // Parse header
  const headerLine = lines[0];
  const headers = [];
  let current = '';
  let inQuotes = false;
  
  for (let char of headerLine) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      headers.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  headers.push(current.trim());
  
  console.log('📋 Columns:', headers.join(', '), '\n');
  
  // Parse data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    current = '';
    inQuotes = false;
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    
    // Map to object
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').trim();
    });
    
    // Only include rows with filename
    if (row.filename) {
      rows.push(row);
    }
  }
  
  return rows;
}

/**
 * Convert spreadsheet rows to carousel items
 */
function rowsToCarouselItems(rows) {
  return rows.map((row, index) => {
    const position = index + 1;
    
    return {
      position,
      alt: row.alt || row.title || 'Guitar player',
      image: {
        url: row.filename,  // Already has /assets/carousel/ path
        width: parseInt(row.width) || 1200,
        height: parseInt(row.height) || 675,
      },
      attribution: {
        title: row.title || 'Untitled',
        creatorName: row.creatorname || 'Unknown',
        creatorUrl: row.creatorURL || undefined,
        sourceName: 'Openverse',
        sourceUrl: row.photourl || '',
        license: row.license || 'CC BY 4.0',
        licenseUrl: row.licenseURL || 'https://creativecommons.org/licenses/by/4.0/',
        changesMade: '', // Not in your spreadsheet
        originalFileUrl: row.originalFileURL || '',
      },
    };
  });
}

/**
 * Generate the complete seed script
 */
function generateSeedScript(items) {
  // Clean up undefined values
  const cleanItems = items.map(item => {
    const cleaned = { ...item };
    
    // Remove undefined creatorUrl
    if (cleaned.attribution.creatorUrl === undefined) {
      delete cleaned.attribution.creatorUrl;
    }
    
    // Remove empty changesMade
    if (cleaned.attribution.changesMade === '') {
      delete cleaned.attribution.changesMade;
    }
    
    return cleaned;
  });
  
  return `/**
 * Auto-generated carousel seed script
 * Generated from: Carousel Photos Google Sheet
 * Date: ${new Date().toISOString()}
 * Total items: ${items.length}
 */

const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

admin.initializeApp({
  projectId: 'guitar-journey-b3295',
});

const db = admin.firestore();

const carouselItems = ${JSON.stringify(cleanItems, null, 2)};

// Add Firestore timestamps
carouselItems.forEach(item => {
  item.createdAt = admin.firestore.FieldValue.serverTimestamp();
  item.updatedAt = admin.firestore.FieldValue.serverTimestamp();
});

async function seedCarousel() {
  const carouselSlug = 'dashboard-hero';
  
  console.log(\`🚀 Seeding carousel: \${carouselSlug}\`);
  console.log(\`   Total items: \${carouselItems.length}\\n\`);
  
  try {
    // Create carousel parent document
    await db.collection('carousels').doc(carouselSlug).set({
      name: 'Dashboard Hero Carousel',
      slug: carouselSlug,
      rotateMs: 6000,
      aspectRatio: '16/9',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Created carousel parent document');
    
    // Add carousel items
    const itemsRef = db.collection('carousels').doc(carouselSlug).collection('items');
    
    for (const item of carouselItems) {
      const docRef = await itemsRef.add(item);
      console.log(\`✅ Item \${item.position}: "\${item.attribution.title}"\`);
      console.log(\`   ID: \${docRef.id}\`);
      console.log(\`   File: \${item.image.url}\\n\`);
    }
    
    console.log('🎉 Carousel seeding complete!');
    console.log(\`   Total items: \${carouselItems.length}\`);
    console.log('\\n📍 View in Emulator UI: http://localhost:4000/firestore\\n');
    
  } catch (error) {
    console.error('❌ Error seeding carousel:', error);
    throw error;
  }
}

// Run the seed function
seedCarousel()
  .then(() => {
    console.log('✅ Done!');
    console.log('   Start your app: npm start');
    console.log('   Navigate to: /app/dashboard\\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;
}

// Main execution
async function main() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Carousel Photos → Seed Script Generator');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Fetch from Google Sheets
    const csvText = await fetchSheetAsCSV();
    
    // Parse CSV
    const rows = parseCSV(csvText);
    console.log(`✅ Found ${rows.length} carousel items\n`);
    
    // Convert to carousel items
    const items = rowsToCarouselItems(rows);
    
    // Generate seed script
    const script = generateSeedScript(items);
    
    // Write to file
    const outputFile = 'seed-carousel-generated.js';
    fs.writeFileSync(outputFile, script);
    
    // Display summary
    console.log('📄 Carousel Items Generated:\n');
    items.forEach(item => {
      console.log(`   ${item.position}. ${item.attribution.title}`);
      console.log(`      Creator: ${item.attribution.creatorName}`);
      console.log(`      License: ${item.attribution.license}`);
      console.log(`      File: ${item.image.url}`);
      console.log(`      Size: ${item.image.width}x${item.image.height}\n`);
    });
    
    console.log(`✅ Generated: ${outputFile}`);
    console.log('\n📋 Next Steps:');
    console.log('   1. Review: cat seed-carousel-generated.js');
    console.log('   2. Verify images in: src/assets/carousel/');
    console.log('   3. Start emulators: firebase emulators:start');
    console.log('   4. Run seed: node seed-carousel-generated.js\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('403') || error.message.includes('401')) {
      console.error('\n💡 Sheet must be public:');
      console.error('   1. Open sheet in browser');
      console.error('   2. Click "Share" (top right)');
      console.error('   3. Change to "Anyone with the link"');
      console.error('   4. Role: Viewer');
      console.error('   5. Click "Done"');
      console.error('   6. Re-run this script\n');
    }
    
    process.exit(1);
  }
}

main();
