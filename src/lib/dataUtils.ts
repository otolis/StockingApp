import { InventoryItem } from "@/types";

/**
 * Normalizes Firestore inventory item data.
 * Firestore keys sometimes have trailing spaces (e.g., "name ") which this utility cleans up.
 */
export function normalizeInventoryItem(docId: string, rawData: any): InventoryItem {
    const cleanKey = (key: string) => rawData[key] ?? rawData[`${key} `] ?? rawData[`${key}  `];

    return {
        id: docId,
        name: cleanKey("name") || "",
        sku: cleanKey("sku") || "",
        category: cleanKey("category") || "",
        quantity: cleanKey("quantity") ?? 0,
        minThreshold: cleanKey("minThreshold") ?? 0,
        imageUrl: cleanKey("imageUrl") || "",
        organizationId: cleanKey("organizationId") || "",
        createdAt: cleanKey("createdAt"),
        updatedAt: cleanKey("updatedAt"),
    };
}
