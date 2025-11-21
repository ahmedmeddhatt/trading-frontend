// src/types/helpers.ts

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type AsyncStatus = "idle" | "loading" | "success" | "error";
