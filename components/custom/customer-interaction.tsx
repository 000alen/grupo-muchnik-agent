import { CustomerInteraction as CustomerInteractionType } from "@/db/app-schema";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export default function CustomerInteraction({
  interaction,
}: {
  interaction: CustomerInteractionType;
}) {
  const date = new Date(interaction.createdAt ?? new Date());
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="card-custom">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{interaction.title}</h4>
          <Badge variant="outline" className="text-xs">
            <CalendarDays className="mr-1 h-3 w-3" />
            {formattedDate}
          </Badge>
        </div>
      </CardHeader>
      {interaction.notes && (
        <CardContent className="text-sm text-muted-foreground">
          {interaction.notes}
        </CardContent>
      )}
    </Card>
  );
}
