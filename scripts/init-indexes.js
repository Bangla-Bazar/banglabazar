const admin = require('firebase-admin');
const serviceAccount = require('../firebase/serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createIndexes() {
  try {
    // Create products index
    await db.collection('products').doc('_indexes').set({
      indexes: [
        {
          collectionGroup: 'products',
          queryScope: 'COLLECTION',
          fields: [
            { fieldPath: 'isHotProduct', order: 'ASCENDING' },
            { fieldPath: 'createdAt', order: 'DESCENDING' }
          ]
        }
      ]
    });

    // Create banners index
    await db.collection('banners').doc('_indexes').set({
      indexes: [
        {
          collectionGroup: 'banners',
          queryScope: 'COLLECTION',
          fields: [
            { fieldPath: 'createdAt', order: 'DESCENDING' }
          ]
        }
      ]
    });

    console.log('Indexes created successfully!');
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    // Clean up
    await admin.app().delete();
  }
}

createIndexes(); 