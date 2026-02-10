import { useEffect } from "react";
import useNotificationStore from "~/hooks/use-notification-store";
import NotificationsPopover from "./notifications-popover";
import useRouterStore from "~/hooks/use-router-store";

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    remove
  } = useNotificationStore();

  const { lang } = useRouterStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationsPopover
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onRemove={remove}
    />
  );
}
