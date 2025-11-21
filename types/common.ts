// src/types/common.ts

export type ID = string;
export type Timestamp = string; // ISO string from backend

export interface ApiError {
  message: string;
  code?: number;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
