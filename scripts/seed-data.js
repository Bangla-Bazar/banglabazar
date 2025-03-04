const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data
const products = [
  {
    name: 'Basmati Rice',
    description: 'Premium long-grain basmati rice from India',
    price: 19.99,
    imageUrl: 'https://example.com/basmati-rice.jpg',
    tags: ['Rice', 'Indian', 'Essential'],
    isHotProduct: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Red Lentils (Masoor Dal)',
    description: 'High-quality red lentils perfect for dal and soups',
    price: 5.99,
    imageUrl: 'https://example.com/red-lentils.jpg',
    tags: ['Lentils', 'Indian', 'Bangladeshi', 'Essential'],
    isHotProduct: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Mango Pickle',
    description: 'Spicy and tangy mango pickle made with traditional recipe',
    price: 4.99,
    imageUrl: 'https://example.com/mango-pickle.jpg',
    tags: ['Pickle', 'Indian', 'Condiments'],
    isHotProduct: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more products as needed
];

// Sample banners data
const banners = [
  {
    title: 'Diwali Special Sale',
    description: 'Get up to 20% off on all Indian sweets and snacks',
    imageUrl: 'https://example.com/diwali-sale.jpg',
    link: '/products?tag=Sweets',
    createdAt: new Date(),
  },
  {
    title: 'Fresh Vegetables',
    description: 'Fresh Bengali vegetables available every weekend',
    imageUrl: 'https://example.com/fresh-vegetables.jpg',
    link: '/products?tag=Vegetables',
    createdAt: new Date(),
  },
  // Add more banners as needed
];

async function seedData() {
  try {
    // Add products
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
      console.log('Added product:', product.name);
    }

    // Add banners
    for (const banner of banners) {
      await addDoc(collection(db, 'banners'), banner);
      console.log('Added banner:', banner.title);
    }

    console.log('Data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the script
seedData(); 