
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function NotificationsDropdown() {
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const markAsRead = async (id: string) => {
    await supabase
      .from("event_notifications")
      .update({ read: true })
      .eq("id", id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications?.length === 0 ? (
          <DropdownMenuItem className="text-muted-foreground">
            No notifications
          </DropdownMenuItem>
        ) : (
          notifications?.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 p-4"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium flex-grow">{notification.message}</span>
                {!notification.read && (
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(notification.created_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
