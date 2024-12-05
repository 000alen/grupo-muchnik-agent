import NewConsultantForm from "@/components/custom/new-consultant-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewConsultantPage() {
  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/consultants">
          <Button variant="ghost" size="icon" className="button-custom">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">New Consultant</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <NewConsultantForm />
      </div>
    </div>
  );
}