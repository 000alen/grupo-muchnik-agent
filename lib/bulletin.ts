import { Prospect } from "@/db/app-schema";

export async function createBulletinContent(
  prospects: Prospect[]
): Promise<string> {
  return `We have ${prospects.length} new prospects this week: ${prospects
    .map((prospect) => prospect.companyName)
    .join(", ")}`;
}
