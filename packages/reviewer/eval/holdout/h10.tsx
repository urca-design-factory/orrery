// @expect P-05 P-06
import { forwardRef } from "react";

export interface NotificationProps extends React.ComponentPropsWithoutRef<"div"> {
  title: string;
  description: string;
  unread?: boolean;
  pinned?: boolean;
  compact?: boolean;
  bordered?: boolean;
  dismissible?: boolean;
  icon?: React.ReactNode;
}

/** A single entry in the notification centre. */
export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ title, description, icon, className, ...props }, ref) => (
    <div
      ref={ref}
      className={["flex gap-3 p-3", className].filter(Boolean).join(" ")}
      {...props}
    >
      {icon}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-fg-primary">{title}</p>
        <p className="text-sm text-fg-secondary">{description}</p>
      </div>
    </div>
  ),
);
Notification.displayName = "Notification";
