
import { useToast } from "@/hooks/use-toast";

export function useEventShare() {
  const { toast } = useToast();

  const handleShare = async (title: string, description: string, eventId: string) => {
    const shareData = {
      title,
      text: description,
      url: window.location.origin + `/events/${eventId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Event link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return handleShare;
}
