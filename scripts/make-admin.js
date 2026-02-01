// Run this script with: node scripts/make-admin.js YOUR_EMAIL
// Example: node scripts/make-admin.js otolis@example.com

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// For local development, we'll use the Firebase client SDK approach
// This script needs to be run from the browser console instead

console.log(`
=== Make User Admin ===

Since we're using client-side Firebase, you have two options:

OPTION 1: Firebase Console (Recommended)
1. Go to: https://console.firebase.google.com/project/nexus-stock-a2dba/firestore
2. Navigate to: users collection
3. Find your user document (search by email or user ID)
4. Click on the document
5. Change the "role" field from "viewer" to "admin"
6. Click "Update"
7. Log out and log back in to your app

OPTION 2: Browser Console
1. Open your app at http://localhost:3000
2. Open Developer Tools (F12) → Console tab
3. Paste and run this code:

---
// Paste this in browser console when logged in:
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "./src/lib/firebase";

const user = auth.currentUser;
if (user) {
    await updateDoc(doc(db, "users", user.uid), { role: "admin" });
    console.log("Role updated to admin! Please refresh the page.");
} else {
    console.log("Not logged in");
}
---

After updating, log out and log back in to be redirected to /admin
`);
