import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAllChatMessagesApi } from "./api-client";

export const LAST_READ_KEY = "medsimplify_last_read_msg_id";

export function getLastReadMsgId(): number {
  if (typeof window !== "undefined" && window.localStorage) {
    const val = localStorage.getItem(LAST_READ_KEY);
    return val ? parseInt(val, 10) : 0;
  }
  return 0;
}

export function setLastReadMsgId(id: number): void {
  if (typeof window !== "undefined" && window.localStorage) {
    const current = getLastReadMsgId();
    if (id > current) {
      localStorage.setItem(LAST_READ_KEY, String(id));
      window.dispatchEvent(new CustomEvent("medsimplify_unread_chat_changed", { detail: 0 }));
    }
  }
}

export function useUnreadChatCount(): number {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let lastNotifiedId = getLastReadMsgId();

    const checkNewMessages = async () => {
      try {
        const msgs = await getAllChatMessagesApi(1);
        if (Array.isArray(msgs) && msgs.length > 0) {
          const lastRead = getLastReadMsgId();
          const doctorMsgs = msgs.filter((m: any) => m.sender === "doctor");
          const unread = doctorMsgs.filter((m: any) => m.id > lastRead);

          setUnreadCount(unread.length);

          // If there's a new doctor message not yet notified
          const newestDoctorMsg = doctorMsgs[doctorMsgs.length - 1];
          if (newestDoctorMsg && newestDoctorMsg.id > lastNotifiedId && newestDoctorMsg.id > lastRead) {
            lastNotifiedId = newestDoctorMsg.id;

            // Only show toast if user is not currently on /chat page
            if (typeof window !== "undefined" && !window.location.pathname.includes("/chat")) {
              toast.info(`💬 Dr. Priya Sharma: "${newestDoctorMsg.message}"`, {
                duration: 6000,
                action: {
                  label: "Reply",
                  onClick: () => {
                    window.location.href = "/chat";
                  },
                },
              });
            }
          }
        }
      } catch (e) {
        // quiet fallback
      }
    };

    checkNewMessages();
    const interval = setInterval(checkNewMessages, 4000);

    const handleEvent = () => {
      checkNewMessages();
    };

    window.addEventListener("medsimplify_unread_chat_changed", handleEvent);
    window.addEventListener("storage", handleEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("medsimplify_unread_chat_changed", handleEvent);
      window.removeEventListener("storage", handleEvent);
    };
  }, []);

  return unreadCount;
}
