import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
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

const imageMapping: { [key: string]: string } = {
    "Electronics": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    "Furniture": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    "Office Supplies": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    "Accessories": "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&q=80",
    "Maintenance": "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80",
    "General": "https://images.unsplash.com/photo-1553413766-47583c453144?w=800&q=80"
};

async function updateImages() {
    console.log("🚀 Starting image update process...");

    try {
        const colRef = collection(db, "inventoryItems");
        const snapshot = await getDocs(colRef);
        console.log(`Found ${snapshot.size} items to process.`);

        let count = 0;
        for (const document of snapshot.docs) {
            const data = document.data();
            const category = data.category || "General";
            const newImageUrl = imageMapping[category] || imageMapping["General"];

            // Update if no image or if it's an old unsplash-placeholder link
            if (!data.imageUrl || data.imageUrl.includes("images.unsplash.com/photo-") && !Object.values(imageMapping).includes(data.imageUrl)) {
                console.log(`Updating ${data.name} (${category})...`);
                await updateDoc(doc(db, "inventoryItems", document.id), {
                    imageUrl: newImageUrl
                });
                count++;
            }
        }

        console.log(`✅ Update complete! ${count} items updated.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Update failed:", error);
        process.exit(1);
    }
}

updateImages();
