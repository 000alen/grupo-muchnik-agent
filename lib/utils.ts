import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createId(n = 10) {
  let id = "";
  for (let i = 0; i < n; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}
