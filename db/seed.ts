import "dotenv/config";
import * as schema from "./app-schema";
import * as configSchema from "./config-schema";
import { db } from ".";

async function main() {
  // Config data
  const countries = [
    { countryName: "Argentina", countryCode: "AR" },
    { countryName: "Brazil", countryCode: "BR" },
    { countryName: "Chile", countryCode: "CL" },
    { countryName: "Uruguay", countryCode: "UY" },
    { countryName: "Paraguay", countryCode: "PY" },
  ];

  const sources = [
    {
      sourceName: "LinkedIn",
      sourceUrl: "https://linkedin.com",
      isActive: true,
    },
    {
      sourceName: "Referral Network",
      sourceUrl: "https://referrals.com",
      isActive: true,
    },
    {
      sourceName: "Industry Conference",
      sourceUrl: "https://conferences.com",
      isActive: true,
    },
    {
      sourceName: "Direct Contact",
      sourceUrl: "https://direct.com",
      isActive: true,
    },
  ];

  // Insert config data
  const insertedCountries = await db
    .insert(configSchema.ConfigCountries)
    .values(countries)
    .returning();

  const insertedSources = await db
    .insert(configSchema.ConfigSources)
    .values(sources)
    .returning();

  // Contacts data
  const contacts = [
    {
      name: "Juan Pérez",
      email: "juan.perez@empresa.com.ar",
      phone: "+54 11 4567-8901",
    },
    {
      name: "María González",
      email: "maria.gonzalez@corporacion.com.br",
      phone: "+55 11 98765-4321",
    },
    {
      name: "Carlos Silva",
      email: "carlos.silva@negocio.com.uy",
      phone: "+598 99 123 456",
    },
    {
      name: "Ana Rodríguez",
      email: "ana.rodriguez@compania.com.py",
      phone: "+595 991 234567",
    },
    {
      name: "Luis Martinez",
      email: "luis.martinez@empresa.cl",
      phone: "+56 9 8765 4321",
    },
  ];

  const insertedContacts = await db
    .insert(schema.Contacts)
    .values(contacts)
    .returning();

  // Consultants data
  const consultants = [
    {
      name: "Dr. Roberto Fernández",
      email: "roberto.fernandez@muchnik.com",
      expertise: "Digital Transformation",
      isActive: true,
    },
    {
      name: "Lic. Patricia Mendoza",
      email: "patricia.mendoza@muchnik.com",
      expertise: "Business Strategy",
      isActive: true,
    },
    {
      name: "Ing. Diego Morales",
      email: "diego.morales@muchnik.com",
      expertise: "Technology Implementation",
      isActive: true,
    },
  ];

  const insertedConsultants = await db
    .insert(schema.Consultants)
    .values(consultants)
    .returning();

  // Prospects data
  const prospects = [
    {
      companyName: "TechnoLatam SA",
      industry: "Technology",
    },
    {
      companyName: "Industrias del Sur",
      industry: "Manufacturing",
    },
    {
      companyName: "Banco Regional",
      industry: "Finance",
    },
    {
      companyName: "Salud Integral",
      industry: "Healthcare",
    },
  ];

  const insertedProspects = await db
    .insert(schema.Prospects)
    .values(prospects)
    .returning();

  // Customers data
  const customers = [
    {
      companyName: "Grupo Constructor ABC",
      industry: "Construction",
    },
    {
      companyName: "Retail Solutions SA",
      industry: "Retail",
    },
    {
      companyName: "EduTech Latam",
      industry: "Education",
    },
  ];

  const insertedCustomers = await db
    .insert(schema.Customers)
    .values(customers)
    .returning();

  // Link prospects with contacts
  const prospectContacts = insertedProspects.flatMap((prospect) =>
    insertedContacts.slice(0, 2).map((contact) => ({
      prospectId: prospect.id,
      contactId: contact.id,
    }))
  );

  await db.insert(schema.ProspectContacts).values(prospectContacts);

  // Link customers with contacts
  const customerContacts = insertedCustomers.flatMap((customer) =>
    insertedContacts.slice(2, 4).map((contact) => ({
      customerId: customer.id,
      contactId: contact.id,
    }))
  );

  await db.insert(schema.CustomerContacts).values(customerContacts);

  // Create prospect interactions
  const prospectInteractions = insertedProspects.flatMap((prospect) =>
    insertedConsultants.map((consultant) => ({
      prospectId: prospect.id,
      consultantId: consultant.id,
      title: "Initial Contact Meeting",
      notes:
        "Discussed potential areas of collaboration and main pain points. Client showed interest in our services.",
    }))
  );

  await db.insert(schema.ProspectsInteractions).values(prospectInteractions);

  // Create customer interactions
  const customerInteractions = insertedCustomers.flatMap((customer) =>
    insertedConsultants.map((consultant) => ({
      customerId: customer.id,
      consultantId: consultant.id,
      title: "Quarterly Review Meeting",
      notes:
        "Reviewed project progress and discussed next steps. Client is satisfied with current results.",
    }))
  );

  await db.insert(schema.CustomersInteractions).values(customerInteractions);

  // Create bulletins
  const bulletins = [
    {
      title: "Market Update Q1",
      content:
        "Our analysis shows growing opportunities in the technology sector across Latin America. Key markets include Brazil and Argentina.",
      sentAt: new Date("2024-01-15"),
      createdAt: new Date("2024-01-15"),
    },
    {
      title: "New Service Launch",
      content:
        "We're excited to announce our new digital transformation consulting service, specifically designed for medium-sized enterprises.",
      sentAt: new Date("2024-02-01"),
      createdAt: new Date("2024-02-01"),
    },
    {
      title: "Industry Insights",
      content:
        "Recent trends in manufacturing sector show increasing adoption of Industry 4.0 technologies in the Southern Cone region.",
      sentAt: new Date("2024-03-01"),
      createdAt: new Date("2024-03-01"),
    },
  ];

  await db.insert(schema.Bulletins).values(bulletins);

  console.log("Seeding completed successfully");
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
