/**
 * Site-wide configuration.
 *
 * Replace WHATSAPP_CHANNEL_URL below with your real WhatsApp Channel invite
 * link (e.g. https://whatsapp.com/channel/XXXXXXXXXXXXXXX).
 * This is the only place the link needs to be changed.
 */
export const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbCwS6kJP20xr7tM5q2e";

export const WHATSAPP_CHANNEL_CONFIGURED =
  WHATSAPP_CHANNEL_URL.startsWith("http") && !WHATSAPP_CHANNEL_URL.includes("WHATSAPP_CHANNEL_URL");

export const CREDITS = [
  { role: "Idea", name: "Pran Mohan" },
  { role: "Developed by", name: "Ghanshyam Roy" },
  { role: "Owned by", name: "Ayush Kumar" },
] as const;
