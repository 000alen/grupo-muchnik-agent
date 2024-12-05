import { createAsyncCaller } from "@/trpc/routers/app";
import { Kanban } from "@/components/kanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const trpc = await createAsyncCaller();

  const consultants = await trpc.consultants.getAll();
  const [
    prospectsPerConsultant,
    customersPerConsultant,
    unassignedProspects,
    unassignedCustomers,
  ] = await Promise.all([
    Promise.all(
      consultants.map((consultant) =>
        trpc.consultants
          .getRelatedProspects({ id: consultant.id })
          .then((r) => r.map((r) => r.prospects))
      )
    ),
    Promise.all(
      consultants.map((consultant) =>
        trpc.consultants
          .getRelatedCustomers({ id: consultant.id })
          .then((r) => r.map((r) => r.customers))
      )
    ),
    trpc.prospects.getUnassigned().then((r) => r.map((r) => r.prospects)),
    trpc.customers.getUnassigned().then((r) => r.map((r) => r.customers)),
  ]);

  const prospectColumns = [];
  const customerColumns = [];

  prospectColumns.push({
    id: "unassigned",
    title: "Unassigned",
    cards: unassignedProspects.map((prospect) => ({
      id: prospect.id,
      title: prospect.companyName || "Unnamed Prospect",
      content: prospect.industry || "No industry specified",
    })),
  });

  prospectColumns.push(
    ...consultants.map((consultant, index) => ({
      id: consultant.id,
      title: consultant.name || "Unnamed Consultant",
      cards: prospectsPerConsultant[index].map((prospect) => ({
        id: prospect.id,
        title: prospect.companyName || "Unnamed Prospect",
        content: prospect.industry || "No industry specified",
      })),
    }))
  );

  customerColumns.push({
    id: "unassigned",
    title: "Unassigned",
    cards: unassignedCustomers.map((customer) => ({
      id: customer.id,
      title: customer.companyName || "Unnamed Customer",
      content: customer.industry || "No industry specified",
    })),
  });

  customerColumns.push(
    ...consultants.map((consultant, index) => ({
      id: consultant.id,
      title: consultant.name || "Unnamed Consultant",
      cards: customersPerConsultant[index].map((customer) => ({
        id: customer.id,
        title: customer.companyName || "Unnamed Customer",
        content: customer.industry || "No industry specified",
      })),
    }))
  );

  return (
    <div className="container-custom py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your prospects and customers across consultants.
        </p>
      </div>

      <Tabs defaultValue="prospects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects" className="space-y-4">
          <Card className="p-0">
            <Kanban initialColumns={prospectColumns} type="prospects" />
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card className="p-0">
            <Kanban initialColumns={customerColumns} type="customers" />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
