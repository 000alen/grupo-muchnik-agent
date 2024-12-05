import { db } from "@/db";

export const createContext = async () => {
  const ctx = {
    db,
  };

  return ctx;
};

export type Context = typeof createContext;
