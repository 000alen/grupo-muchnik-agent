import { ProspectInteraction as ProspectInteractionType } from "@/db/app-schema";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export default function ProspectInteraction({
  interaction,
}: {
  interaction: ProspectInteractionType;
}) {
  const date = new Date(interaction.createdAt);
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
      {interaction.description && (
        <CardContent className="text-sm text-muted-foreground">
          {interaction.description}
        </CardContent>
      )}
    </Card>
  );
}
