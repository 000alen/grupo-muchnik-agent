"use server";

import { createAsyncCaller } from "@/trpc/routers/app";
import { z } from "zod";

const formDataSchema = z.object({
  sourceName: z.string(),
  sourceUrl: z.string(),
  isActive: z.boolean().optional(),
});

interface SourceState {
  success: boolean;
  error: string | null;
}

export const createSource = async (
  state: SourceState,
  formData: FormData
) => {
  const trpc = await createAsyncCaller();

  try {
    const data = formDataSchema.parse({
      sourceName: formData.get("sourceName"),
      sourceUrl: formData.get("sourceUrl"),
      isActive: formData.get("isActive") === "true",
    });

    await trpc.sources.create(data);

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }
};

export const updateSource = async (
  state: SourceState,
  formData: FormData
) => {
  const trpc = await createAsyncCaller();

  try {
    const id = parseInt(formData.get("id") as string);
    const data = formDataSchema.parse({
      sourceName: formData.get("sourceName"),
      sourceUrl: formData.get("sourceUrl"),
      isActive: formData.get("isActive") === "true",
    });

    await trpc.sources.update({ id, ...data });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }
}; 