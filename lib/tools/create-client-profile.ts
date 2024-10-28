import { openai } from "@ai-sdk/openai";
import { CoreTool, generateObject } from "ai";
import { z } from "zod";
import { Profile } from "@/lib/types";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  headline as headlineTable,
  profile as profileTable,
} from "@/db/schema";
import { createId } from "@/lib/utils";

export const createClientProfile: CoreTool = {
  description: "given a headline, create the client profile",
  parameters: z.object({
    headlineId: z.string(),
  }),
  execute: async function ({ headlineId }) {
    const [headline] = await db
      .select()
      .from(headlineTable)
      .where(eq(headlineTable.id, headlineId));

    if (!headline) return `There is no headline with the id ${headlineId}.`;

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      mode: "json",
      schemaName: "ClientProfile",
      schema: Profile,

      system: `\
          - you are a helpful marketing research assistant
          - you work at a marketing research company
          - you research potential clients for the company
          - you task is to generate a client profile based on a news headline
        `,
      prompt: JSON.stringify(headline),
    });

    const profile = {
      id: createId(),
      ...result.object,
    };

    await db.insert(profileTable).values(profile);

    return profile;
  },
};
