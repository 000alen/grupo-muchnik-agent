import { pgTable, serial, timestamp, text, boolean } from "drizzle-orm/pg-core";

export const ConfigCountries = pgTable("config_countries", {
  id: serial("id").primaryKey(),
  countryName: text("country_name").notNull(),
  countryCode: text("country_code").notNull(),
});

export const ConfigSources = pgTable("config_sources", {
  id: serial("id").primaryKey(),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ConfigSourcesCountries = pgTable("sources_countries", {
  id: serial("id").primaryKey(),
  sourceId: serial("source_id").references(() => ConfigSources.id),
  countryId: serial("country_id").references(() => ConfigCountries.id),
});
