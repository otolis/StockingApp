import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = ["Electronics", "Furniture", "Office Supplies", "Accessories", "Maintenance"];
const prefixes = ["NEX", "STK", "INV", "PRD"];

const generateItem = (id: number) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const qty = Math.floor(Math.random() * 50);
    const threshold = 10;

    return {
        name: `${category} Item #${id}`,
        sku: `${prefix}-${id.toString().padStart(3, '0')}`,
        category,
        quantity: qty,
        minThreshold: threshold,
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + (id * 10000)}?w=400&auto=format&fit=crop&q=60`,
        organizationId: "default"
    };
};

const seedData = Array.from({ length: 40 }, (_, i) => generateItem(i + 1));

async function seed() {
    console.log(`🚀 Starting database seeding with ${seedData.length} items...`);

    try {
        const colRef = collection(db, "inventoryItems");

        for (const item of seedData) {
            console.log(`Adding: ${item.name}...`);
            await addDoc(colRef, {
                ...item,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        console.log("✅ Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
