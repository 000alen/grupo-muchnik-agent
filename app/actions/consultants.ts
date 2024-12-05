"use server";

import { createAsyncCaller } from "@/trpc/routers/app";
import { z } from "zod";

const formDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  expertise: z.string(),
});

interface CreateConsultantState {
  success: boolean;
  error: string | null;
}

export const createConsultant = async (
  state: CreateConsultantState,
  formData: FormData
) => {
  "use server";

  const trpc = await createAsyncCaller();

  try {
    const data = formDataSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      expertise: formData.get("expertise"),
    });

    await trpc.consultants.create(data);

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
