import { Block, NotionLike } from "@/components/notion-like";
import { db } from "@/db";
import { headline as headlineTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params: { headlineId },
}: {
  params: {
    headlineId: string;
  };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/auth");

  const [headline] = await db
    .select()
    .from(headlineTable)
    .where(eq(headlineTable.id, headlineId));

  if (!headline) return "Not found";

  const blocks: Block[] = [
    {
      id: "1",
      type: "title",
      content: headline.title,
    },
    {
      id: "2",
      type: "paragraph",
      content: headline.date.toISOString(),
    },
    {
      id: "3",
      type: "toggle",
      title: "Content",
      content: <p>{headline.content}</p>,
      isExpanded: true,
    },
  ];

  return <NotionLike blocks={blocks} />;
}
