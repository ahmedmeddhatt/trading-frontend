// src/types/api.ts
import { User, Restaurant, MenuItem, Order } from "./entities";
import { ApiError } from "./common";

// ---------- Auth ----------
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ---------- Restaurants ----------
export interface CreateRestaurantRequest {
  name: string;
  description: string;
  address: string;
}

export interface CreateRestaurantResponse {
  restaurant: Restaurant;
}

// ---------- Menu Items ----------
export interface CreateMenuItemRequest {
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: File;
  category: string;
}

export interface CreateMenuItemResponse {
  item: MenuItem;
}

// ---------- Orders ----------
export interface CreateOrderRequest {
  restaurantId: string;
  items: Array<{ id: string; quantity: number }>;
}

export interface CreateOrderResponse {
  order: Order;
}

// Generic API response wrapper
export type ApiResult<T> = {
  success: boolean;
  data: T | null;
  error?: ApiError;
};
