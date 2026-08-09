import { createContext, useContext, useMemo, useState } from "react";

export interface RecipientNotification {
  id: string;
  recipient: string;
  title: string;
  detail: string;
  destination: string;
  kind: "rejection";
  time: string;
  isRead: boolean;
}

interface NotificationContextValue {
  notifications: RecipientNotification[];
  addNotification: (notification: Omit<RecipientNotification, "id" | "time" | "isRead">) => void;
  markAsRead: (id: string) => void;
  clearNotificationsFor: (recipient: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<RecipientNotification[]>([]);

  const value = useMemo<NotificationContextValue>(() => ({
    notifications,
    addNotification(notification) {
      setNotifications(current => [{
        ...notification,
        id: `notification-${Date.now()}`,
        time: "Just now",
        isRead: false,
      }, ...current]);
    },
    markAsRead(id) {
      setNotifications(current => current.map(notification => notification.id === id ? { ...notification, isRead: true } : notification));
    },
    clearNotificationsFor(recipient) {
      setNotifications(current => current.filter(notification => notification.recipient !== recipient));
    },
  }), [notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const value = useContext(NotificationContext);
  if (!value) throw new Error("useNotifications must be used inside NotificationProvider");
  return value;
}
