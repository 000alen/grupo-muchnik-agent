"use server";

import { createAsyncCaller } from "@/trpc/routers/app";
import { z } from "zod";

const formDataSchema = z.object({
  companyName: z.string(),
  companyIndustry: z.string(),
});

interface CreateCustomerState {
  success: boolean;
  error: string | null;
}

export const createCustomer = async (
  state: CreateCustomerState,
  formData: FormData
) => {
  const trpc = await createAsyncCaller();

  try {
    const data = formDataSchema.parse({
      companyName: formData.get("companyName"),
      companyIndustry: formData.get("industry"),
    });

    await trpc.customers.create(data);

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
