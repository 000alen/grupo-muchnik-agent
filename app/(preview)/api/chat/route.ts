import { getHeadlines, HEADLINES } from "@/components/data";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, generateObject, streamText } from "ai";
import { z } from "zod";
import { chromium } from "playwright";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

async function createSession() {
  const response = await fetch(`https://www.browserbase.com/v1/sessions`, {
    method: "POST",
    headers: {
      "x-bb-api-key": process.env.BROWSERBASE_API_KEY,
      "Content-Type": "application/json",
    } as any,
    body: JSON.stringify({ projectId: process.env.BROWSERBASE_PROJECT_ID }),
  });
  const { id } = await response.json();
  return id;
}

async function getPageInfo(message: string) {
  const sessionId = await createSession();

  const wsUrl = `wss://connect.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}&sessionId=${sessionId}`;

  const browser = await chromium.connectOverCDP(wsUrl);
  const page = browser.contexts()[0].pages()[0];

  const searchQuery = encodeURIComponent(`${message}?`);
  await page.goto(`https://www.google.com/search?q=${searchQuery}`);

  const content = await page.content();
  const dom = new JSDOM(content);
  const article = new Readability(dom.window.document).parse();
  await browser.close();

  return article?.textContent || "";
}

export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
    maxSteps: 5,

    // CHANGE HERE (BELOW)
    system: `\
      - you are a helpful marketing research assistant
      - you work at a marketing research company
      - you research potential clients for the company
      - your responses are concise
      - you do not ever use lists, tables, or bullet points; instead, you provide a single response
    `,
    tools: {
      fetchHeadlines: {
        description: "fetches all the relevant headlines",
        parameters: z.object({}),
        execute: async function ({}) {
          const orders = getHeadlines();
          return orders;
        },
      },

      createClientProfile: {
        description: "given a headline, create the client profile",
        parameters: z.object({
          headlineId: z.string(),
        }),
        execute: async function ({ headlineId }) {
          const headline = HEADLINES.find((h) => h.id === headlineId);

          if (!headline)
            return `There is no headline with the id ${headlineId}.`;

          const result = await generateObject({
            model: openai("gpt-4o-mini"),
            mode: "json",
            schemaName: "ClientProfile",
            schema: z.object({
              company: z.string().describe("The name of the company"),
              industry: z
                .string()
                .describe("The industry the company operates in"),
              action: z.string().describe("The action the company is taking"),
              contact: z
                .string()
                .describe("The contact person for the company"),
            }),

            system: `\
              - you are a helpful marketing research assistant
              - you work at a marketing research company
              - you research potential clients for the company
              - you task is to generate a client profile based on a news headline
            `,
            prompt: JSON.stringify(headline),
          });

          return result.object;
        },
      },

      draftColdEmail: {
        description: "draft a cold email for a potential client",
        parameters: z.object({
          clientProfile: z.object({
            company: z.string(),
            industry: z.string(),
            action: z.string(),
            contact: z.string(),
          }),
        }),
        execute: async function ({ clientProfile }) {
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
            prompt: JSON.stringify(clientProfile),
          });

          return result.object;
        },
      },

      search: {
        description: "search in Google for any query",
        parameters: z.object({
          query: z.string(),
        }),
        execute: async function ({ query }) {
          const content = await getPageInfo(query);
          return content;
        },
      },

      // viewTrackingInformation: {
      //   description: "view tracking information for a specific order",
      //   parameters: z.object({
      //     orderId: z.string(),
      //   }),
      //   execute: async function ({ orderId }) {
      //     const trackingInformation = getTrackingInformation({ orderId });
      //     await new Promise((resolve) => setTimeout(resolve, 500));
      //     return trackingInformation;
      //   },
      // },
    },

    // CHANGE HERE (ABOVE)
  });

  return stream.toDataStreamResponse();
}
