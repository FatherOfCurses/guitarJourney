/**
 * Seed carousel data for Firebase Emulator Suite
 * Uses local static assets instead of Storage
 * 
 * Usage:
 * 1. Copy images to src/assets/carousel/
 * 2. Start emulators: firebase emulators:start
 * 3. Run: node seed-carousel-emulator.js
 */

const admin = require('firebase-admin');

// Connect to Firestore Emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

admin.initializeApp({
  projectId: 'guitar-journey-b3295', // Use your Firebase project ID
});

const db = admin.firestore();

/**
 * Sample carousel items using local assets
 * Images should be in: src/assets/carousel/
 */
const carouselItems = [
  {
    position: 1,
    alt: 'Street musician playing black electric guitar',
    image: {
      url: '/assets/carousel/2467308300.jpg',
      width: 3488,
      height: 2616,
    },
    attribution: {
      title: 'Electric Guitar',
      creatorName: 'Gabriel Pollard',
      creatorUrl: 'https://www.flickr.com/photos/nzgabriel/',
      sourceName: 'Openverse',
      sourceUrl: 'https://openverse.org/image/ba9607fc-9faf-406e-ab90-15b707d6643b?q=woman+playing+guitar&p=25',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      changesMade: 'None',
      originalFileUrl: 'https://www.flickr.com/photos/61181002@N00/2467308300',
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    position: 2,
    alt: 'Guitarist in blue',
    image: {
      url: '/assets/carousel/10799727025.jpg',
      width: 2880,
      height: 1920,
    },
    attribution: {
      title: 'Guitar Player',
      creatorName: 'Yuri Samilov',
      creatorUrl: 'https://www.flickr.com/photos/yuri_samoilov/',
      sourceName: 'Openverse',
      sourceUrl: 'https://openverse.org/image/cd00e28a-17cc-4e78-a07f-153525dc06ff?q=guitar+player&p=1',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      changesMade: 'None',
      originalFileUrl: 'https://www.flickr.com/photos/103414654@N05/10799727025'
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    position: 3,
    alt: 'Guitarist on stage facing audience',
    image: {
      url: '/assets/carousel/9255147576.jpg',
      width: 1563,
      height: 2084,
    },
    attribution: {
      title: 'Guitar Player',
      creatorName: 'Bill Oriani',
      creatorUrl: 'https://www.flickr.com/photos/oriani/',
      sourceName: 'Openverse',
      sourceUrl: 'https://openverse.org/image/34f25c9b-2adb-4dc8-bcb6-8b0ec16b0411?q=guitar+player&p=16',
      license: 'CC BY-NC-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/2.0/',
      changesMade: '',
      originalFileUrl: 'https://www.flickr.com/photos/24448461@N03/9255147576',
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seedCarousel() {
  const carouselSlug = 'dashboard-hero';
  
  console.log(`🚀 Seeding carousel to Firestore Emulator: ${carouselSlug}`);
  console.log(`   Connected to: ${process.env.FIRESTORE_EMULATOR_HOST}\n`);
  
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
      console.log(`✅ Added carousel item ${item.position}: "${item.attribution.title}"`);
      console.log(`   ID: ${docRef.id}`);
      console.log(`   Image: ${item.image.url}\n`);
    }
    
    console.log('🎉 Carousel seeding complete!');
    console.log(`   Total items: ${carouselItems.length}`);
    console.log(`\n📍 View in Emulator UI: http://localhost:4000/firestore`);
    
  } catch (error) {
    console.error('❌ Error seeding carousel:', error);
    throw error;
  }
}

// Run the seed function
seedCarousel()
  .then(() => {
    console.log('\n✅ Done! You can now:');
    console.log('   1. View data in Emulator UI: http://localhost:4000');
    console.log('   2. Start your Angular app: npm start');
    console.log('   3. Navigate to /app/dashboard to see carousel\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
