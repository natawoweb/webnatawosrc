
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface AttendanceListProps {
  eventId: string;
  participants: any[];
  isLoading: boolean;
}

export function AttendanceList({ participants, isLoading }: AttendanceListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Registration Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.length > 0 ? (
            participants.map((participant) => (
              <TableRow key={participant.registration_id}>
                <TableCell className="font-medium">
                  {participant.full_name}
                </TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{participant.level}</Badge>
                </TableCell>
                <TableCell>
                  {format(
                    new Date(participant.registration_date),
                    "MMM d, yyyy HH:mm"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                No participants registered for this event
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
