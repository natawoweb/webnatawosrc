
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BlogErrorStateProps {
  error?: Error;
  notFound?: boolean;
}

export const BlogErrorState = ({ error, notFound }: BlogErrorStateProps) => {
  return (
    <div className="container mx-auto py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{notFound ? "Not Found" : "Error"}</AlertTitle>
        <AlertDescription>
          {notFound
            ? "The requested blog could not be found."
            : "Failed to load blog. Please try again later."}
        </AlertDescription>
      </Alert>
    </div>
  );
};
