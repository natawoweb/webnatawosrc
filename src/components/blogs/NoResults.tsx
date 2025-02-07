
import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NoResultsProps {
  hasActiveSearch: boolean;
}

export const NoResults = ({ hasActiveSearch }: NoResultsProps) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No Blogs Found</AlertTitle>
      <AlertDescription>
        {hasActiveSearch 
          ? `No blogs found matching your search criteria. Try different search terms.`
          : "There are currently no approved blogs to display. Please check back later!"}
      </AlertDescription>
    </Alert>
  );
};
