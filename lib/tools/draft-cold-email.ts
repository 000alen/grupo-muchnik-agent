import { openai } from "@ai-sdk/openai";
import { CoreTool, generateObject } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { profile as profileTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const draftColdEmail: CoreTool = {
  description: "draft a cold email for a potential client",
  parameters: z.object({
    clientProfileId: z.string(),
  }),
  execute: async function ({ clientProfileId }) {
    const [profile] = await db
      .select()
      .from(profileTable)
      .where(eq(profileTable.id, clientProfileId));

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      mode: "json",
      schemaName: "ColdEmail",
      schema: z.object({
        subject: z.string().describe("The subject of the email"),
        body: z.string().describe("The body of the email"),
      }),

      system: `\
          - you are a helpful marketing research assistant
          - you work at a marketing research company
          - you research potential clients for the company
          - you task is to draft a cold email for a potential client
        `,
      prompt: JSON.stringify(profile),
    });

    return result.object;
  },
};
