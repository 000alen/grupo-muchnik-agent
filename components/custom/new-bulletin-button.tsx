"use client";

import { trpc } from "@/lib/trpc-client";

export default function NewBulletinButton() {
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.bulletins.create.useMutation({
    onSuccess: () => {
      utils.bulletins.getAll.invalidate();
    },
  });

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      New Bulletin
    </button>
  );
}
