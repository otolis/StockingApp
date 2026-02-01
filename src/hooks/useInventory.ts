import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InventoryItem } from "@/types";

export const useInventory = () => {
    const addItem = async (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
        try {
            await addDoc(collection(db, "inventoryItems"), {
                ...item,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error adding item:", error);
            throw error;
        }
    };

    const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
        try {
            const itemRef = doc(db, "inventoryItems", id);
            await updateDoc(itemRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating item:", error);
            throw error;
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const itemRef = doc(db, "inventoryItems", id);
            await deleteDoc(itemRef);
        } catch (error) {
            console.error("Error deleting item:", error);
            throw error;
        }
    };

    return { addItem, updateItem, deleteItem };
};
