const { initializeApp } = require('firebase/app');
const {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} = require('firebase/auth');
const { getFirestore, setDoc, doc } = require('firebase/firestore');

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
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    // Create admin user
    const email = 'admin@banglabazar.com';
    const password = 'admin123'; // Change this to a secure password

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Add admin role to user
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      role: 'admin',
      createdAt: new Date(),
    });

    console.log('Admin user created successfully');
    console.log('Email:', email);
    console.log('Password:', password);

    // Sign out
    await signOut(auth);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the script
createAdminUser(); 