export type UserRole = 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  organizationId: string;
  lastLogin: Date | any;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: Date | any;
  updatedAt: Date | any;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minThreshold: number;
  imageUrl?: string;
  organizationId: string;
  createdAt: Date | any;
  updatedAt: Date | any;
}

export interface StockHistory {
  id: string;
  itemId: string;
  type: 'adjustment' | 'sale' | 'purchase';
  previousQuantity: number;
  newQuantity: number;
  changedBy: string;
  timestamp: Date | any;
}

export interface UiConfig {
  categories: string[];
  roles: string[];
  alertThresholdDefault: number;
}
