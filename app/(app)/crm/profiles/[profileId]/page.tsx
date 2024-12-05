import { Block, NotionLike } from "@/components/notion-like";
import { db } from "@/db";
import { profile as profileTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params: { profileId },
}: {
  params: { profileId: string };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/auth");

  const [profile] = await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.id, profileId));

  if (!profile) return "Not found";

  const blocks: Block[] = [
    {
      id: "1",
      type: "title",
      content: profile.company,
    },
    {
      id: "2",
      type: "paragraph",
      content: profile.industry,
    },
    {
      id: "3",
      type: "paragraph",
      content: profile.action,
    },
    {
      id: "4",
      type: "toggle",
      title: "Contact",
      content: profile.contact,
      isExpanded: true,
    },
  ];

  return <NotionLike blocks={blocks} />;
}
