"use server";

import { createAsyncCaller } from "@/trpc/routers/app";
import { z } from "zod";

const formDataSchema = z.object({
  companyName: z.string(),
  industry: z.string(),
});

interface CreateProspectState {
  success: boolean;
  error: string | null;
}

export const createProspect = async (
  state: CreateProspectState,
  formData: FormData
) => {
  const trpc = await createAsyncCaller();

  try {
    const data = formDataSchema.parse({
      companyName: formData.get("companyName"),
      industry: formData.get("industry"),
    });

    await trpc.prospects.create(data);

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
