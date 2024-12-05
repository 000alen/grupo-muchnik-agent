import { SourceForm } from "@/components/custom/source-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewSourcePage() {
  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/sources">
            <Button variant="ghost" size="icon" className="button-custom">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">New Source</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <SourceForm />
      </div>
    </div>
  );
} 