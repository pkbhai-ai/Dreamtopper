import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WHATSAPP_CHANNEL_CONFIGURED, WHATSAPP_CHANNEL_URL } from "@/lib/site";

export function WhatsAppButton({
  className,
  label = "Join WhatsApp Channel",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={WHATSAPP_CHANNEL_CONFIGURED ? WHATSAPP_CHANNEL_URL : "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!WHATSAPP_CHANNEL_CONFIGURED) {
          e.preventDefault();
          toast.info("WhatsApp Channel link is not configured yet.");
        }
      }}
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-bold text-whatsapp-foreground shadow-soft transition-opacity hover:opacity-90",
        className,
      )}
    >
      <MessageCircle className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  );
}
