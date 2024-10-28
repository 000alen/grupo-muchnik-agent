import { z } from "zod";

export const Headline = z.object({
  id: z.string().describe("The id of the headline"),
  title: z.string().describe("The title of the headline"),
  content: z.string().describe("The content of the headline"),
  date: z.string().describe("The date of the headline"),
  source: z.string().describe("The source of the headline"),
});

export type Headline = z.infer<typeof Headline>;

export const Profile = z.object({
  company: z.string().describe("The name of the company"),
  industry: z.string().describe("The industry the company operates in"),
  action: z.string().describe("The action the company is taking"),
  contact: z.string().describe("The contact person for the company"),
});

export type Profile = z.infer<typeof Profile>;
