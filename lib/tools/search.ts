import { CoreTool } from "ai";
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

export const search: CoreTool = {
  description: "search in Google for any query",
  parameters: z.object({
    query: z.string(),
  }),
  execute: async function ({ query }) {
    const content = await getPageInfo(query);
    return content;
  },
};
