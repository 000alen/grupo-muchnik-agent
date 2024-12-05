import { createCallerFactory, procedure, router } from "@/trpc/trpc";
import { createContext } from "@/trpc/context";
import { z } from "zod";
import { desc, eq, and, lte, gte } from "drizzle-orm";
import { startOfWeek, endOfWeek } from "date-fns";
import { createBulletinContent } from "@/lib/bulletin";
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

    create: procedure
      .input(z.object({ companyName: z.string(), industry: z.string() }))
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

    create: procedure
      .input(z.object({ companyName: z.string(), industry: z.string() }))
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
});

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
