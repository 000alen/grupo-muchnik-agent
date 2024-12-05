import { Contact as ContactType } from "@/db/app-schema";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

export default function Contact({ contact }: { contact: ContactType }) {
  return (
    <Card className="card-custom">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">{contact.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {contact.email && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{contact.phone}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
