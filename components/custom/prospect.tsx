import { Prospect as ProspectType } from "@/db/app-schema";
import Link from "next/link";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ChevronRight } from "lucide-react";

export default function Prospect({ prospect }: { prospect: ProspectType }) {
  return (
    <Card className="card-custom">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{prospect.companyName}</h3>
            {prospect.companyIndustry && (
              <p className="text-sm text-muted-foreground">
                {prospect.companyIndustry}
              </p>
            )}

            {prospect.companyAction && (
              <p className="text-sm text-muted-foreground">
                {prospect.companyAction}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Link href={`/dashboard/prospects/${prospect.id}`} className="ml-auto">
          <Button variant="ghost" size="sm" className="button-custom">
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
