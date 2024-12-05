"use client";

import { createConsultant } from "@/app/actions/consultants";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function NewConsultantForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [state, formAction] = useFormState(createConsultant, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [onSuccess, state.error, state.success]);

  return (
    <form action={formAction}>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <input type="text" name="expertise" />
      <button type="submit">Create</button>
    </form>
  );
}
