import {
  pgTable,
  serial,
  text,
  uuid,
  boolean,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";
import { ConfigSources } from "./config-schema";

export const Contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
});

export type Contact = typeof Contacts.$inferSelect;

export const Prospects = pgTable("prospects", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: text("company_name").notNull(),
  industry: text("industry"),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ProspectContacts = pgTable("prospects_contacts", {
  id: serial("id").primaryKey(),
  prospectId: uuid("prospect_id").references(() => Prospects.id),
  contactId: serial("contact_id").references(() => Contacts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ProspectContact = typeof ProspectContacts.$inferSelect;

export type Prospect = typeof Prospects.$inferSelect;

export const Customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: text("company_name"),
  industry: text("industry"),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const CustomerContacts = pgTable("customers_contacts", {
  id: serial("id").primaryKey(),
  customerId: uuid("customer_id").references(() => Customers.id),
  contactId: serial("contact_id").references(() => Contacts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type CustomerContact = typeof CustomerContacts.$inferSelect;

export type Customer = typeof Customers.$inferSelect;

export const Consultants = pgTable("consultants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  expertise: text("expertise"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Consultant = typeof Consultants.$inferSelect;

export const ConsultantsProspects = pgTable("consultants_prospects", {
  id: serial("id").primaryKey(),
  consultantId: uuid("consultant_id").references(() => Consultants.id),
  prospectId: uuid("prospect_id").references(() => Prospects.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ConsultantsProspects = typeof ConsultantsProspects.$inferSelect;

export const ConsultantsCustomers = pgTable("consultants_customers", {
  id: serial("id").primaryKey(),
  consultantId: uuid("consultant_id").references(() => Consultants.id),
  customerId: uuid("customer_id").references(() => Customers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ConsultantsCustomers = typeof ConsultantsCustomers.$inferSelect;

export const Bulletins = pgTable("bulletins", {
  id: serial("id").primaryKey(),
  content: text("content").default("").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Bulletin = typeof Bulletins.$inferSelect;

// Linking Tables
export const ProspectsInteractions = pgTable("prospects_interactions", {
  id: serial("id").primaryKey(),
  prospectId: uuid("prospect_id").references(() => Prospects.id),
  consultantId: uuid("consultant_id").references(() => Consultants.id),
  title: text("title"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ProspectInteraction = typeof ProspectsInteractions.$inferSelect;

export const ProspectsSources = pgTable("prospects_sources", {
  id: serial("id").primaryKey(),
  prospectId: uuid("prospect_id").references(() => Prospects.id),
  sourceId: serial("source_id").references(() => ConfigSources.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ProspectsSources = typeof ProspectsSources.$inferSelect;

export const CustomersInteractions = pgTable("customers_interactions", {
  id: serial("id").primaryKey(),
  customerId: uuid("customer_id").references(() => Customers.id),
  consultantId: uuid("consultant_id").references(() => Consultants.id),
  title: text("title"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type CustomerInteraction = typeof CustomersInteractions.$inferSelect;
