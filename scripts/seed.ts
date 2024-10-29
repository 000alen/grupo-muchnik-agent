import "dotenv/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { headline as headlineTable } from "@/db/schema";

export const HEADLINES: (typeof headlineTable.$inferInsert)[] = [
  {
    id: "412093",
    title: "Amazon is entering the healthcare industry in Argentina!",
    content:
      "Amazon's marketing spokesperson Wisdom O. said that the company is planning to enter the healthcare industry in Argentina. The company is planning to launch a new healthcare service in the country, which will be available to all residents. The service will be available to all residents, regardless of their income level. The company is planning to launch the service in the next few months.",
    date: new Date("2024-10-25"),
    source: "The Buenos Aires Post",
  },
  {
    id: "387473",
    title: "Google is launching a new AI research lab in Tokyo!",
    content:
      "Google's CEO Sundar Pichai announced that the company is launching a new AI research lab in Tokyo. The lab will be focused on developing new AI technologies for the company's products and services. The lab will be led by Google's Chief AI Scientist, Dr. Andrew Ng. The lab is expected to open in the next few months.",
    date: new Date("2024-10-25"),
    source: "The Tokyo Times",
  },
];

async function main() {
  const db = drizzle();

  for (const h of HEADLINES) {
    await db.insert(headlineTable).values(h);
  }
}

main().catch(console.error);
