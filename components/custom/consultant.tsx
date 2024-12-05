import { Consultant as ConsultantType } from "@/db/app-schema";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User2, ChevronRight } from "lucide-react";

export default function Consultant({
  consultant,
}: {
  consultant: ConsultantType;
}) {
  return (
    <Card className="card-custom">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{consultant.name}</h3>
            {consultant.email && (
              <p className="text-sm text-muted-foreground">{consultant.email}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Link href={`/dashboard/consultants/${consultant.id}`} className="ml-auto">
          <Button variant="ghost" size="sm" className="button-custom">
            View Profile
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
