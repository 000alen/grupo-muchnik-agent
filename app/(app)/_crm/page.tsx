import React from "react";
import { Kanban } from "@/components/kanban";
import { Column } from "@/components/droppable-column";
import { db } from "@/db";
import { profile as profileTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/auth");

  const profiles = await db.select().from(profileTable);

  const columns: Column[] = [
    {
      id: "unassigned",
      title: "Unassigned",
      cards: profiles.map((profile) => ({
        id: profile.id,
        title: profile.company,
        content: profile.action,
      })),
    },
  ];

  return <Kanban initialColumns={columns} />;
}
