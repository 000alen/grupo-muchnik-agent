import { CoreTool } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { headline } from "@/db/schema";

export const fetchHeadlines: CoreTool = {
  description: "fetches all the relevant headlines",
  parameters: z.object({}),
  execute: async function ({}) {
    const headlines = await db.select().from(headline);

    return headlines;
  },
};
