import { Bulletin as BulletinType } from "@/db/app-schema";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronRight } from "lucide-react";

export default function Bulletin({
  bulletin,
  showContent = false,
}: {
  bulletin: BulletinType;
  showContent?: boolean;
}) {
  const date = new Date(bulletin.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="card-custom">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold">{bulletin.title}</h3>
            <Badge variant="outline" className="text-xs">
              <CalendarDays className="mr-1 h-3 w-3" />
              {formattedDate}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {showContent && (
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap">{bulletin.content}</div>
        </CardContent>
      )}

      <CardFooter className="pt-4">
        <Link href={`/dashboard/bulletins/${bulletin.id}`} className="ml-auto">
          <Button variant="ghost" size="sm" className="button-custom">
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
