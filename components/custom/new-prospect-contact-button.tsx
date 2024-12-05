import NewProspectContactForm from "./new-prospect-contact-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function NewProspectContactButton({
  prospectId,
}: {
  prospectId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="button-custom">
          <UserPlus className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new contact</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new contact to this prospect. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <NewProspectContactForm prospectId={prospectId} />
      </DialogContent>
    </Dialog>
  );
}
