// netlify/functions/utils/firebase.js
const admin = require('firebase-admin');

// Розкодовуємо наш секретний ключ з Base64
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8'));

// Ініціалізуємо додаток Firebase, тільки якщо він ще не був ініціалізований
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Експортуємо готовий до використання об'єкт бази даних
const db = admin.firestore();
module.exports = { db };