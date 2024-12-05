import { createAsyncCaller } from "@/trpc/routers/app";
import { Kanban } from "@/components/kanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const trpc = await createAsyncCaller();
  
  // Fetch all consultants, prospects, and customers
  const [consultants, prospects, customers] = await Promise.all([
    trpc.consultants.getAll(),
    trpc.prospects.getAll(),
    trpc.customers.getAll(),
  ]);

  // Create columns for prospects (one per consultant + unassigned)
  const prospectColumns = [
    {
      id: "unassigned",
      title: "Unassigned",
      cards: prospects
        .filter(prospect => !prospect.consultantId)
        .map(prospect => ({
          id: prospect.id,
          title: prospect.companyName || "Unnamed Prospect",
          content: prospect.industry || "No industry specified",
        })),
    },
    ...consultants.map(consultant => ({
      id: consultant.id,
      title: consultant.name || "Unnamed Consultant",
      cards: prospects
        .filter(prospect => prospect.consultantId === consultant.id)
        .map(prospect => ({
          id: prospect.id,
          title: prospect.companyName || "Unnamed Prospect",
          content: prospect.industry || "No industry specified",
        })),
    })),
  ];

  // Create columns for customers (one per consultant + unassigned)
  const customerColumns = [
    {
      id: "unassigned",
      title: "Unassigned",
      cards: customers
        .filter(customer => !customer.consultantId)
        .map(customer => ({
          id: customer.id,
          title: customer.companyName || "Unnamed Customer",
          content: customer.industry || "No industry specified",
        })),
    },
    ...consultants.map(consultant => ({
      id: consultant.id,
      title: consultant.name || "Unnamed Consultant",
      cards: customers
        .filter(customer => customer.consultantId === consultant.id)
        .map(customer => ({
          id: customer.id,
          title: customer.companyName || "Unnamed Customer",
          content: customer.industry || "No industry specified",
        })),
    })),
  ];

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