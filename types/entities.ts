// src/types/entities.ts
import { ID, Timestamp } from "./common";

export interface User {
  id: ID;
  name: string;
  email: string;
  role: "admin" | "restaurant" | "customer";
  createdAt: Timestamp;
}

export interface SnapshotPosition {
  positionId: string;
  companyName: string;
  quantity: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnL: number;
}




export interface Restaurant {
  id: ID;
  name: string;
  description: string;
  address: string;
  coverImage: string;
  createdAt: Timestamp;
}

export interface MenuItem {
  id: ID;
  restaurantId: ID;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt: Timestamp;
}

export interface Order {
  id: ID;
  userId: ID;
  restaurantId: ID;
  items: Array<{
    id: ID;
    quantity: number;
  }>;
  totalAmount: number;
  status: "pending" | "accepted" | "preparing" | "delivering" | "completed" | "canceled";
  createdAt: Timestamp;
}
