import { useState } from "react";

interface NotificationItem {
  id: number;
  message: string;
  read: boolean;
}

// leave-management-api does not yet expose a REST endpoint for notifications
// (it only has an internal NotificationService used for emails), so this
// page works against local, in-memory sample data for now. Once a
// /api/notifications endpoint exists, swap this seed for an api.get() call
// the same way the other pages do.
const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, message: "Your leave request for Nov 10-12 was approved.", read: false },
  { id: 2, message: "Reminder: 2 pending requests need your approval.", read: false },
  { id: 3, message: "Public holiday added: Dec 25.", read: true },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const visible = showUnreadOnly ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Notifications {unreadCount > 0 && <span className="text-primary-600">({unreadCount})</span>}
        </h1>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
          />
          Unread only
        </label>
      </div>

      <div className="card divide-y divide-gray-200 dark:divide-gray-700">
        {visible.length === 0 && (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Nothing to show.</p>
        )}
        {visible.map((notification) => (
          <div key={notification.id} className="p-4 flex items-center justify-between">
            <span className={notification.read ? "text-gray-500 dark:text-gray-400" : "font-medium text-gray-800 dark:text-gray-100"}>
              {notification.message}
            </span>
            <button type="button" className="btn-secondary" onClick={() => toggleRead(notification.id)}>
              Mark as {notification.read ? "unread" : "read"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
