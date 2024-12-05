"use server";

import { createAsyncCaller } from "@/trpc/routers/app";
import { z } from "zod";

interface CreateCustomerContactState {
  success: boolean;
  error: string | null;
}

interface CreateProspectContactState {
  success: boolean;
  error: string | null;
}

const customerFormDataSchema = z.object({
  customerId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

const prospectFormDataSchema = z.object({
  prospectId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export const createCustomerContact = async (
  state: CreateCustomerContactState,
  formData: FormData
) => {
  "use server";

  const trpc = await createAsyncCaller();

  try {
    const data = customerFormDataSchema.parse({
      customerId: formData.get("customerId"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    });

    await trpc.customers.addContact(data);

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

export const createProspectContact = async (
  state: CreateProspectContactState,
  formData: FormData
) => {
  const trpc = await createAsyncCaller();

  try {
    const data = prospectFormDataSchema.parse({
      prospectId: formData.get("prospectId"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    });

    await trpc.prospects.addContact(data);

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
