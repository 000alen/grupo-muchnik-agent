import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { fetchHeadlines } from "@/lib/tools/fetch-headlines";
import { createClientProfile } from "@/lib/tools/create-client-profile";
import { draftColdEmail } from "@/lib/tools/draft-cold-email";
import { search } from "@/lib/tools/search";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return new Response("NOT AUTHORIZED", {
      status: 401,
    });

  const { messages } = await request.json();

  const stream = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
    maxSteps: 10,

    system: `\
      - you are a helpful marketing research assistant
      - you work at a marketing research company
      - you research potential clients for the company
      - your responses are concise
      - you do not ever use lists, tables, or bullet points; instead, you provide a single response
    `,
    tools: {
      fetchHeadlines,
      createClientProfile,
      draftColdEmail,
      search,
    },
  });

  return stream.toDataStreamResponse();
}
