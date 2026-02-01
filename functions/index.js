const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();
const db = getFirestore();

exports.onItemUpdate = onDocumentUpdated("inventoryItems/{itemId}", async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    // Only log if quantity changed
    if (beforeData.quantity === afterData.quantity) {
        return null;
    }

    const historyEntry = {
        itemId: event.params.itemId,
        previousQuantity: beforeData.quantity,
        newQuantity: afterData.quantity,
        type: afterData.quantity > beforeData.quantity ? "purchase" : "sale",
        changedBy: "system", // In a real app, you might pass the user ID in the update
        timestamp: FieldValue.serverTimestamp(),
    };

    try {
        await db.collection("stockHistory").add(historyEntry);
        console.log(`Stock history logged for item ${event.params.itemId}`);
    } catch (error) {
        console.error("Error logging stock history:", error);
    }

    return null;
});
