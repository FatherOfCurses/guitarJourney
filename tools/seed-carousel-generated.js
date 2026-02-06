/**
 * Auto-generated carousel seed script
 * Generated from: Carousel Photos Google Sheet
 * Date: 2026-02-06T15:12:43.514Z
 * Total items: 13
 */

const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

admin.initializeApp({
  projectId: 'guitar-journey-b3295',
});

const db = admin.firestore();

const carouselItems = [
  {
    "position": 1,
    "alt": "Close up of electric guitar being played outdoors",
    "image": {
      "url": "/assets/carousel/2467308300.jpg",
      "width": 3488,
      "height": 2616
    },
    "attribution": {
      "title": "Electric Guitar",
      "creatorName": "Gabriel Pollard",
      "creatorUrl": "https://www.flickr.com/photos/nzgabriel/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/ba9607fc-9faf-406e-ab90-15b707d6643b",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/61181002@N00/2467308300"
    }
  },
  {
    "position": 2,
    "alt": "Female guitar player Eruca Sativa playing onstage at La Trastienda Montevideo",
    "image": {
      "url": "/assets/carousel/25294826140.jpg",
      "width": 4592,
      "height": 3064
    },
    "attribution": {
      "title": "Eruca Sativa @ La Trastienda Montevideo (2016-03-05)",
      "creatorName": "Lula Bertoldi",
      "creatorUrl": "https://www.flickr.com/photos/el_nando/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/8cabcd22-a74b-4f8b-a01c-0e9272461b06",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/49273060@N04/25294826140"
    }
  },
  {
    "position": 3,
    "alt": "Female playing acoustic guitar and busking in 1970s Seattle",
    "image": {
      "url": "/assets/carousel/2655556373.gif",
      "width": 815,
      "height": 1200
    },
    "attribution": {
      "title": "Guitar Player at Corner Market paint-in, 1975",
      "creatorName": "Seattle Municipal Archives",
      "creatorUrl": "https://www.flickr.com/photos/seattlemunicipalarchives/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/d74f1f9a-2267-4e11-aaaf-43a719823813",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/24256351@N04/2655556373"
    }
  },
  {
    "position": 4,
    "alt": "Female 80's guitar player on stage with red guitar",
    "image": {
      "url": "/assets/carousel/3559884142.jpg",
      "width": 1221,
      "height": 2705
    },
    "attribution": {
      "title": "English girl guitar player (probably Ana da Silva of The Raincoats) Market St. Theater, 1981, San Francisco",
      "creatorName": "Steve Harlow",
      "creatorUrl": "https://www.flickr.com/photos/p0ps/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/54f1653a-b096-4146-b2db-50042b71b114",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/23642817@N00/3559884142"
    }
  },
  {
    "position": 5,
    "alt": "Male guitar player playing acoustic guitar with capo",
    "image": {
      "url": "/assets/carousel/4773159075.jpg",
      "width": 2387,
      "height": 2592
    },
    "attribution": {
      "title": "Guitar Player (Matthew Lennox)",
      "creatorName": "Al-Janabi",
      "creatorUrl": "https://www.flickr.com/photos/aljanabi/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/a1f77602-a1cb-4a54-9ae2-0030721443ae",
      "license": "CC BY-NC-ND 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-nc-nd/2.0/?ref=openverse",
      "originalFileUrl": "https://www.flickr.com/photos/51374494@N08/4773159075"
    }
  },
  {
    "position": 6,
    "alt": "Close-up of very worn electric guitar neck being played outdoors",
    "image": {
      "url": "/assets/carousel/5788179259.jpg",
      "width": 1280,
      "height": 960
    },
    "attribution": {
      "title": "_5210958 Guitar Player",
      "creatorName": "Archie Gleason",
      "creatorUrl": "https://www.flickr.com/photos/11286337@N04/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/8cabcd22-a74b-4f8b-a01c-0e9272461b06",
      "license": "CC BY-ND 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-nd/2.0/",
      "originalFileUrl": "https://www.flickr.com/photos/11286337@N04/5788179259"
    }
  },
  {
    "position": 7,
    "alt": "Close up of electric guitar being played",
    "image": {
      "url": "/assets/carousel/6059241719.jpg",
      "width": 1024,
      "height": 683
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "nehad1",
      "creatorUrl": "https://www.flickr.com/photos/nehad1/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/daccd3ab-0be5-469e-8706-51e3cfad5cdd",
      "license": "CC BY-NC 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-nc/2.0/",
      "originalFileUrl": "https://www.flickr.com/photos/42275226@N04/6059241719"
    }
  },
  {
    "position": 8,
    "alt": "Shot from behind of female guitar player on stage at indoor club concert",
    "image": {
      "url": "/assets/carousel/9255147576.jpg",
      "width": 1563,
      "height": 2084
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "Bill Oriani",
      "creatorUrl": "https://www.flickr.com/photos/oriani/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/34f25c9b-2adb-4dc8-bcb6-8b0ec16b0411",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/24448461@N03/9255147576"
    }
  },
  {
    "position": 9,
    "alt": "Male guitar player in blue light on stage",
    "image": {
      "url": "/assets/carousel/10799727025.jpg",
      "width": 2880,
      "height": 1920
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "Yari Samoilov",
      "creatorUrl": "https://www.flickr.com/photos/yuri_samoilov/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/cd00e28a-17cc-4e78-a07f-153525dc06ff",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/103414654@N05/10799727025"
    }
  },
  {
    "position": 10,
    "alt": "Close up of neck of electric guitar being played",
    "image": {
      "url": "/assets/carousel/16768286129.jpg",
      "width": 2048,
      "height": 1367
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "Jorg Schreier",
      "creatorUrl": "https://www.flickr.com/photos/schreierjo/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/e8f05e0d-1b6d-41c9-9921-a81f095d05c2",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/84060207@N08/16768286129"
    }
  },
  {
    "position": 11,
    "alt": "Older African American Blues guitar player seated at club wall playing guitar",
    "image": {
      "url": "/assets/carousel/19082972614.jpg",
      "width": 1024,
      "height": 768
    },
    "attribution": {
      "title": "rooster - sooc",
      "creatorName": "BPPrice",
      "creatorUrl": "https://www.flickr.com/photos/bpprice/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/56eeb25f-c9b4-4a88-a8b3-1fbd5f0801f7",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/73082817@N03/19082972614"
    }
  },
  {
    "position": 12,
    "alt": "Male guitar player with sunglasses and acoustic guitar striking a pose in a studio",
    "image": {
      "url": "/assets/carousel/20124097821.jpg",
      "width": 4425,
      "height": 7154
    },
    "attribution": {
      "title": "Gary, the Guitar Player",
      "creatorName": "Geoff Livingston",
      "creatorUrl": "https://www.flickr.com/photos/geoliv/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/d126cf01-4c22-4d68-8a3c-723a0853895e",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/9397412@N06/20124097821"
    }
  },
  {
    "position": 13,
    "alt": "Female guitar player playing acoustic guitar and busking outdoors",
    "image": {
      "url": "/assets/carousel/25244389315.jpg",
      "width": 1115,
      "height": 1597
    },
    "attribution": {
      "title": "City Songstress - Manchester",
      "creatorName": "SimplSam",
      "creatorUrl": "https://www.flickr.com/photos/simplsam/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/b921578b-db62-4ac3-8623-8f2089305abb",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/134000856@N06/25244389315"
    }
  }
];

// Add Firestore timestamps
carouselItems.forEach(item => {
  item.createdAt = admin.firestore.FieldValue.serverTimestamp();
  item.updatedAt = admin.firestore.FieldValue.serverTimestamp();
});

async function seedCarousel() {
  const carouselSlug = 'dashboard-hero';
  
  console.log(`🚀 Seeding carousel: ${carouselSlug}`);
  console.log(`   Total items: ${carouselItems.length}\n`);
  
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
      console.log(`✅ Item ${item.position}: "${item.attribution.title}"`);
      console.log(`   ID: ${docRef.id}`);
      console.log(`   File: ${item.image.url}\n`);
    }
    
    console.log('🎉 Carousel seeding complete!');
    console.log(`   Total items: ${carouselItems.length}`);
    console.log('\n📍 View in Emulator UI: http://localhost:4000/firestore\n');
    
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
    console.log('   Navigate to: /app/dashboard\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
