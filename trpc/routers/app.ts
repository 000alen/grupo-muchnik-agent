import { createCallerFactory, procedure, router } from "@/trpc/trpc";
import { createContext } from "@/trpc/context";
import { z } from "zod";
import {
  desc,
  eq,
  and,
  lte,
  gte,
  isNull,
  sql,
  gt,
  cosineDistance,
} from "drizzle-orm";
import { startOfWeek, endOfWeek } from "date-fns";
import { createBulletinContent } from "@/lib/bulletin";
import FirecrawlApp from "@mendable/firecrawl-js";
import { openai } from "@ai-sdk/openai";
import { embedMany, embed, generateText, generateObject } from "ai";
import * as schema from "@/db/schema";

export const appRouter = router({
  consultants: {
    getAll: procedure.query(async ({ ctx }) => {
      return await ctx.db.select().from(schema.Consultants);
    }),

    get: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Consultants)
          .where(eq(schema.Consultants.id, input.id))
          .limit(1)
          .then(([consultant]) => consultant);
      }),

    create: procedure
      .input(
        z.object({ name: z.string(), email: z.string(), expertise: z.string() })
      )
      .mutation(async ({ ctx, input }) => {
        return await ctx.db.insert(schema.Consultants).values({
          name: input.name,
          email: input.email,
          expertise: input.expertise,
        });
      }),

    getRelatedCustomers: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Customers)
          .leftJoin(
            schema.ConsultantsCustomers,
            eq(schema.Customers.id, schema.ConsultantsCustomers.customerId)
          )
          .where(eq(schema.ConsultantsCustomers.consultantId, input.id));
      }),

    getRelatedProspects: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Prospects)
          .leftJoin(
            schema.ConsultantsProspects,
            eq(schema.Prospects.id, schema.ConsultantsProspects.prospectId)
          )
          .where(eq(schema.ConsultantsProspects.consultantId, input.id));
      }),

    getLatestCustomerInteractions: procedure
      .input(
        z.object({
          id: z.string(),
          limit: z.number().default(5).nullish(),
          cursor: z.number().nullish(),
        })
      )
      .query(async ({ ctx, input }) => {
        const limit = input.limit ?? 5;
        const offset = input.cursor ?? 0;

        const items = await ctx.db
          .select()
          .from(schema.CustomersInteractions)
          .where(eq(schema.CustomersInteractions.consultantId, input.id))
          .orderBy(desc(schema.CustomersInteractions.createdAt))
          .limit(limit)
          .offset(offset);

        const nextCursor = offset + limit;

        return {
          items,
          nextCursor,
        };
      }),

    getLatestProspectInteractions: procedure
      .input(
        z.object({
          id: z.string(),
          limit: z.number().default(5),
          cursor: z.number().nullish(),
        })
      )
      .query(async ({ ctx, input }) => {
        const limit = input.limit ?? 5;
        const offset = input.cursor ?? 0;

        const items = await ctx.db
          .select()
          .from(schema.ProspectsInteractions)
          .where(eq(schema.ProspectsInteractions.consultantId, input.id))
          .orderBy(desc(schema.ProspectsInteractions.createdAt))
          .limit(limit)
          .offset(offset);

        const nextCursor = offset + limit;

        return {
          items,
          nextCursor,
        };
      }),
  },

  customers: {
    getAll: procedure.query(async ({ ctx }) => {
      return await ctx.db.select().from(schema.Customers);
    }),

    get: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Customers)
          .where(eq(schema.Customers.id, input.id))
          .limit(1)
          .then(([customer]) => customer);
      }),

    getUnassigned: procedure.query(async ({ ctx }) => {
      return await ctx.db
        .selectDistinct()
        .from(schema.Customers)
        .leftJoin(
          schema.ConsultantsCustomers,
          eq(schema.Customers.id, schema.ConsultantsCustomers.customerId)
        )
        .where(isNull(schema.ConsultantsCustomers.consultantId));
    }),

    assignToConsultant: procedure
      .input(z.object({ customerId: z.string(), consultantId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // First delete any existing assignments for this customer
        await ctx.db
          .delete(schema.ConsultantsCustomers)
          .where(eq(schema.ConsultantsCustomers.customerId, input.customerId));

        // Then create the new assignment
        return await ctx.db.insert(schema.ConsultantsCustomers).values(input);
      }),

    create: procedure
      .input(z.object({ companyName: z.string(), companyIndustry: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.db.insert(schema.Customers).values(input);
      }),

    getContacts: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Contacts)
          .leftJoin(
            schema.CustomerContacts,
            eq(schema.Contacts.id, schema.CustomerContacts.contactId)
          )
          .where(eq(schema.CustomerContacts.customerId, input.id));
      }),

    addContact: procedure
      .input(
        z.object({
          customerId: z.string(),
          name: z.string(),
          email: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const contact = await ctx.db
          .insert(schema.Contacts)
          .values({
            name: input.name,
            email: input.email,
          })
          .returning()
          .then(([contact]) => contact);

        return await ctx.db.insert(schema.CustomerContacts).values({
          customerId: input.customerId,
          contactId: contact.id,
        });
      }),

    getLatestInteractions: procedure
      .input(
        z.object({
          id: z.string(),
          limit: z.number().default(5),
          cursor: z.number().nullish(),
        })
      )
      .query(async ({ ctx, input }) => {
        const limit = input.limit ?? 5;
        const offset = input.cursor ?? 0;

        const items = await ctx.db
          .select()
          .from(schema.CustomersInteractions)
          .where(eq(schema.CustomersInteractions.customerId, input.id))
          .orderBy(desc(schema.CustomersInteractions.createdAt))
          .limit(limit)
          .offset(offset);

        const nextCursor = offset + limit;

        return {
          items,
          nextCursor,
        };
      }),
  },

  prospects: {
    getAll: procedure.query(async ({ ctx }) => {
      return await ctx.db.select().from(schema.Prospects);
    }),

    get: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Prospects)
          .where(eq(schema.Prospects.id, input.id))
          .limit(1)
          .then(([prospect]) => prospect);
      }),

    getUnassigned: procedure.query(async ({ ctx }) => {
      return await ctx.db
        .selectDistinct()
        .from(schema.Prospects)
        .leftJoin(
          schema.ConsultantsProspects,
          eq(schema.Prospects.id, schema.ConsultantsProspects.prospectId)
        )
        .where(isNull(schema.ConsultantsProspects.consultantId));
    }),

    assignToConsultant: procedure
      .input(z.object({ prospectId: z.string(), consultantId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // First delete any existing assignments for this prospect
        await ctx.db
          .delete(schema.ConsultantsProspects)
          .where(eq(schema.ConsultantsProspects.prospectId, input.prospectId));

        return await ctx.db.insert(schema.ConsultantsProspects).values(input);
      }),

    create: procedure
      .input(z.object({ companyName: z.string(), companyIndustry: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.db.insert(schema.Prospects).values(input);
      }),

    getContacts: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Contacts)
          .leftJoin(
            schema.ProspectContacts,
            eq(schema.Contacts.id, schema.ProspectContacts.contactId)
          )
          .where(eq(schema.ProspectContacts.prospectId, input.id));
      }),

    addContact: procedure
      .input(
        z.object({
          prospectId: z.string(),
          name: z.string(),
          email: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const contact = await ctx.db
          .insert(schema.Contacts)
          .values({
            name: input.name,
            email: input.email,
          })
          .returning()
          .then(([contact]) => contact);

        return await ctx.db.insert(schema.ProspectContacts).values({
          prospectId: input.prospectId,
          contactId: contact.id,
        });
      }),

    getLatestInteractions: procedure
      .input(
        z.object({
          id: z.string(),
          limit: z.number().default(5),
          cursor: z.number().nullish(),
        })
      )
      .query(async ({ ctx, input }) => {
        const limit = input.limit ?? 5;
        const offset = input.cursor ?? 0;

        const items = await ctx.db
          .select()
          .from(schema.ProspectsInteractions)
          .where(eq(schema.ProspectsInteractions.prospectId, input.id))
          .orderBy(desc(schema.ProspectsInteractions.createdAt))
          .limit(limit)
          .offset(offset);

        const nextCursor = offset + limit;

        return {
          items,
          nextCursor,
        };
      }),
  },

  bulletins: {
    getAll: procedure.query(async ({ ctx }) => {
      return await ctx.db
        .select()
        .from(schema.Bulletins)
        .orderBy(desc(schema.Bulletins.sentAt));
    }),

    get: procedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.Bulletins)
          .where(eq(schema.Bulletins.id, input.id))
          .limit(1)
          .then(([bulletin]) => bulletin);
      }),

    create: procedure.mutation(async ({ ctx }) => {
      const now = new Date();
      const start = startOfWeek(now);
      const end = endOfWeek(now);

      const prospects = await ctx.db
        .select()
        .from(schema.Prospects)
        .where(
          and(
            gte(schema.Prospects.createdAt, start),
            lte(schema.Prospects.createdAt, end)
          )
        );

      const content = await createBulletinContent(prospects);

      return await ctx.db.insert(schema.Bulletins).values({
        content,
        title: "Weekly Prospect Update",
        sentAt: now,
      });
    }),
  },

  sources: {
    getAll: procedure.query(async ({ ctx }) => {
      return await ctx.db.select().from(schema.ConfigSources);
    }),

    get: procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return await ctx.db
          .select()
          .from(schema.ConfigSources)
          .where(eq(schema.ConfigSources.id, parseInt(input.id)))
          .limit(1)
          .then(([source]) => source);
      }),

    create: procedure
      .input(
        z.object({
          sourceName: z.string(),
          sourceUrl: z.string(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await ctx.db.insert(schema.ConfigSources).values(input);
      }),

    update: procedure
      .input(
        z.object({
          id: z.number(),
          sourceName: z.string(),
          sourceUrl: z.string(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await ctx.db
          .update(schema.ConfigSources)
          .set(data)
          .where(eq(schema.ConfigSources.id, id));
      }),

    delete: procedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.db
          .delete(schema.ConfigSources)
          .where(eq(schema.ConfigSources.id, input.id));
      }),
  },

  ai: {
    scan: procedure.mutation(async ({ ctx }) => {
      // const activeSources = await ctx.db
      //   .select()
      //   .from(schema.ConfigSources)
      //   .where(eq(schema.ConfigSources.isActive, true));
      const activeSources = [
        {
          sourceName: "TechCrunch",
          sourceUrl: "https://techcrunch.com",
        },
        {
          sourceName: "New York Times",
          sourceUrl: "https://nytimes.com",
        },
        // {
        //   sourceName: "La Nacion",
        //   sourceUrl: "https://www.lanacion.com.ar/",
        // },
        // {
        //   sourceName: "Ambito Financiero",
        //   sourceUrl: "https://www.ambito.com/",
        // },
      ];

      const app = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY,
      });

      const model = openai.embedding("text-embedding-3-small");

      const extractSchema = z.object({
        headlines: z
          .object({
            title: z.string().describe("The title of the headline"),
            company: z
              .string()
              .nullable()
              .describe(
                "The company the headline is about. If it's not about a company, make this null."
              ),
            companyAction: z
              .string()
              .nullable()
              .describe(
                'The action the company is taking, like "Launched a new product" or "Hired a new CEO". If it\'s not about a company, make this null.'
              ),
            companyIndustry: z
              .string()
              .nullable()
              .describe(
                "The industry the company is in. If it's not about a company, make this null."
              ),
            description: z
              .string()
              .describe("A short description of the headline"),
          })
          .array(),
      });

      const results = await Promise.all(
        activeSources.map((source) =>
          app.scrapeUrl(source.sourceUrl, {
            formats: ["extract"],
            extract: { schema: extractSchema },
          })
        )
      );

      const headlines = results
        .filter((result) => result.success)
        .filter((result) => !!result.extract)
        .flatMap((result) => result.extract!.headlines)
        .filter(
          (headline) =>
            !!headline.company &&
            !!headline.companyAction &&
            !!headline.companyIndustry
        );

      const { embeddings } = await embedMany({
        model,
        values: headlines.map(
          (headline) => `${headline.company}: ${headline.companyAction}`
        ),
      });

      await Promise.all(
        headlines.map(async (headline, i) => {
          const embedding = embeddings[i];

          const similarity = sql<number>`1 - (${cosineDistance(
            schema.Prospects.embedding,
            embedding
          )})`;

          const similarProspect = await ctx.db
            .select({
              companyName: schema.Prospects.companyName,
              companyIndustry: schema.Prospects.companyIndustry,
              similarity,
            })
            .from(schema.Prospects)
            .where(gt(similarity, 0.8))
            .orderBy((t) => desc(t.similarity))
            .limit(1)
            .then(([prospect]) => prospect);

          if (similarProspect) return;

          return await ctx.db.insert(schema.Prospects).values({
            companyName: headline.company!,
            companyAction: headline.companyAction!,
            companyIndustry: headline.companyIndustry!,
            embedding,
          });
        })
      );

      return headlines;
    }),

    write: procedure
      .input(
        z.object({
          prospectId: z.string(),
          prompt: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const model = openai("gpt-4o");
        const embedding = openai.embedding("text-embedding-3-small");

        const prospect = await ctx.db
          .select()
          .from(schema.Prospects)
          .where(eq(schema.Prospects.id, input.prospectId))
          .then(([prospect]) => prospect);

        const result = await generateText({
          model,

          messages: [
            {
              role: "system",
              content: `You are a sales assistant for a company that sells to customers in the ${prospect.companyIndustry} industry. You are currently working with ${prospect.companyName} who is ${prospect.companyAction}.`,
            },
            {
              role: "user",
              content: input.prompt,
            },
          ],

          maxSteps: 5,
          tools: {
            getSimilarCustomers: {
              description:
                "Get similar customers based on the company name and action. Could be used to mention past successful deals.",
              parameters: z.object({
                companyName: z.string(),
                companyAction: z.string(),
              }),
              async execute({ companyName, companyAction }) {
                const _embedding = await embed({
                  model: embedding,
                  value: `${companyName}: ${companyAction}`,
                }).then((e) => e.embedding);

                const similarity = sql<number>`1 - (${cosineDistance(
                  schema.Customers.embedding,
                  _embedding
                )})`;

                const similarCustomers = await ctx.db
                  .select({
                    companyName: schema.Customers.companyName,
                    companyIndustry: schema.Customers.companyIndustry,
                    similarity,
                  })
                  .from(schema.Customers)
                  .where(gt(similarity, 0.6))
                  .orderBy(desc(similarity))
                  .limit(3);

                return similarCustomers;
              },
            },
          },
        });

        const { object } = await generateObject({
          model,

          messages: [
            {
              role: "system",
              content: `You are a sales assistant for a company that sells to customers in the ${prospect.companyIndustry} industry. You are currently working with ${prospect.companyName} who is ${prospect.companyAction}.`,
            },
            {
              role: "user",
              content: input.prompt,
            },
            {
              role: "assistant",
              content: result.text,
            },
          ],

          schema: z.object({
            title: z.string().describe("The title of the interaction"),
            content: z
              .string()
              .describe(
                "The content of the interaction. Don't include the assistant's thinking process."
              ),
          }),
        });

        return await ctx.db.insert(schema.ProspectsInteractions).values({
          prospectId: input.prospectId,
          title: object.title,
          notes: object.content,
        });
      }),
  },
});

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
