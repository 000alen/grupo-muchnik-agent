import { Customer as CustomerType } from "@/db/app-schema";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight } from "lucide-react";

export default function Customer({ customer }: { customer: CustomerType }) {
  return (
    <Card className="card-custom">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{customer.companyName}</h3>
            {customer.industry && (
              <p className="text-sm text-muted-foreground">{customer.industry}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Link href={`/dashboard/customers/${customer.id}`} className="ml-auto">
          <Button variant="ghost" size="sm" className="button-custom">
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
