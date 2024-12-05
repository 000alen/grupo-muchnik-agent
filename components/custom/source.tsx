"use client";

import { type ConfigSources } from "@/db/config-schema";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Props {
  source: typeof ConfigSources.$inferSelect;
}

export default function Source({ source }: Props) {
  return (
    <Link href={`/dashboard/sources/${source.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="card-custom">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{source.sourceName}</h3>
            <Badge variant={source.isActive ? "default" : "secondary"}>
              {source.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-muted-foreground">
            <ExternalLink className="mr-2 h-4 w-4" />
            <p className="text-sm truncate">{source.sourceUrl}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 