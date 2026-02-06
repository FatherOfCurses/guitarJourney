/**
 * Seed script for carousel test data
 * 
 * Usage:
 * 1. Make sure you have Firebase Admin SDK initialized
 * 2. Update the image URLs and attribution info below
 * 3. Run: node seed-carousel.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (adjust path to your service account key)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // OR use a service account key file:
  // credential: admin.credential.cert(require('./path-to-serviceAccountKey.json')),
});

const db = admin.firestore();

/**
 * Sample carousel items - UPDATE THESE with your actual Openverse images
 */
const carouselItems = [
  {
    position: 1,
    alt: 'Street musician playing black electric guitar',
    image: {
      url: 'https://your-firebase-storage-url.com/images/guitar-1.jpg',
      // Later you can add variants:
      // variants: {
      //   webpMd: 'https://...',
      //   md: 'https://...',
      // },
      width: 3488,
      height: 2616,
    },
    attribution: {
      title: 'Guitar Player',
      creatorName: 'John Doe',
      creatorUrl: 'https://openverse.org/creator-profile',
      sourceName: 'Openverse',
      sourceUrl: 'https://openverse.org/image/abc123',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      changesMade: 'Cropped and resized',
      originalFileUrl: 'https://www.flickr.com/photos/61181002@N00/2467308300',
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    position: 2,
    alt: 'Close-up of guitar strings',
    image: {
      url: 'https://your-firebase-storage-url.com/images/guitar-2.jpg',
      width: 1200,
      height: 675,
    },
    attribution: {
      title: 'Guitar Strings Detail',
      creatorName: 'Jane Smith',
      creatorUrl: 'https://openverse.org/creator-profile-2',
      sourceName: 'Openverse',
      sourceUrl: 'https://openverse.org/image/def456',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      changesMade: 'Resized',
      originalFileUrl: 'https://original-source.com/image2.jpg',
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    position: 3,
    alt: 'Guitarist performing on stage',
    image: {
      url: 'https://your-firebase-storage-url.com/images/guitar-3.jpg',
      width: 1200,
      height: 675,
    },
    attribution: {
      title: 'Stage Performance',
      creatorName: 'Bob Johnson',
      creatorUrl: 'https://openverse.org/creator-profile-3',
      sourceName: 'Openverse',
      sourceUrl: 'https://openverse.org/image/ghi789',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      originalFileUrl: 'https://original-source.com/image3.jpg',
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seedCarousel() {
  const carouselSlug = 'dashboard-hero';
  
  console.log(`Seeding carousel: ${carouselSlug}`);
  
  try {
    // Create carousel parent document (optional but recommended)
    await db.collection('carousels').doc(carouselSlug).set({
      name: 'Dashboard Hero Carousel',
      slug: carouselSlug,
      rotateMs: 6000,
      aspectRatio: '16/9',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('Created carousel parent document');
    
    // Add carousel items
    const itemsRef = db.collection('carousels').doc(carouselSlug).collection('items');
    
    for (const item of carouselItems) {
      const docRef = await itemsRef.add(item);
      console.log(`Added carousel item ${item.position} with ID: ${docRef.id}`);
    }
    
    console.log('✅ Carousel seeding complete!');
    console.log(`Total items added: ${carouselItems.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding carousel:', error);
  }
}

// Run the seed function
seedCarousel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });