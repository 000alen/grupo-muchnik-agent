"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function NewSourceButton() {
  return (
    <Link href="/dashboard/sources/new">
      <Button className="button-custom" variant="outline">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Source
      </Button>
    </Link>
  );
} 