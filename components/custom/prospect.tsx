"use client";

import { Prospect as ProspectType } from "@/db/app-schema";
import Link from "next/link";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ChevronRight, X, Check } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { toast } from "sonner";
import { useState } from "react";

export default function Prospect({ prospect }: { prospect: ProspectType }) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const utils = trpc.useUtils();

  const handleReject = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setIsRejecting(true);
    try {
      // Add your reject logic here
      toast.error("Prospect rejected!");
      await utils.prospects.getAll.invalidate();
    } catch (error) {
      toast.error("Failed to reject prospect");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setIsApproving(true);
    try {
      // Add your approve logic here
      toast.success("Prospect approved!");
      await utils.prospects.getAll.invalidate();
    } catch (error) {
      toast.error("Failed to approve prospect");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Card className="card-custom group relative">
      {/* Quick action buttons */}
      <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleReject}
          disabled={isRejecting}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-8 w-8 rounded-full bg-green-600 hover:bg-green-700"
          onClick={handleApprove}
          disabled={isApproving}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>

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
