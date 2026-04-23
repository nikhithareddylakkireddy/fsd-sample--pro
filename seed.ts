import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

const HOTELS = [
  {
    name: "The Oberoi Grand",
    description: "Classic luxury in the heart of the city.",
    city: "Kolkata",
    state: "West Bengal",
    price: 12500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym"]
  },
  {
    name: "Taj Mahal Palace",
    description: "Iconic landmark overlooking the Gateway of India.",
    city: "Mumbai",
    state: "Maharashtra",
    price: 35000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    amenities: ["Free WiFi", "Infinity Pool", "Butler Service", "Heritage Site"]
  },
  {
    name: "ITC Grand Chola",
    description: "A tribute to the architectural splendor of the Chola dynasty.",
    city: "Chennai",
    state: "Tamil Nadu",
    price: 18000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
    amenities: ["Free WiFi", "10 Dining Options", "Golf Green", "Spa"]
  }
];

const RESTAURANTS = [
  {
    name: "Bukhara",
    city: "New Delhi",
    cuisine: "North Indian",
    rating: 4.9,
    costForTwo: 7000,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Indian Accent",
    city: "New Delhi",
    cuisine: "Modern Indian",
    rating: 4.8,
    costForTwo: 10000,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "The Table",
    city: "Mumbai",
    cuisine: "European",
    rating: 4.7,
    costForTwo: 5000,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800"
  }
];

async function seed() {
  console.log('Seeding hotels and restaurants...');
  try {
    for (const hotel of HOTELS) {
      await addDoc(collection(db, 'hotels'), hotel);
      console.log(`Added Hotel: ${hotel.name}`);
    }
    for (const rest of RESTAURANTS) {
      await addDoc(collection(db, 'restaurants'), rest);
      console.log(`Added Restaurant: ${rest.name}`);
    }
    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seed failed:', err);
  }
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
