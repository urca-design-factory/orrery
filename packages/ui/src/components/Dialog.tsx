import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const content = cva(
  "fixed left-1/2 top-1/2 z-50 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/** A modal dialog that interrupts the current task. */
export const Dialog = DialogPrimitive.Root;

/** The element that opens the dialog. */
export const DialogTrigger = DialogPrimitive.Trigger;

/** The element that closes the dialog. */
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof content> {}

/** The dialog's panel. Renders in a portal above a dimming overlay. */
export const DialogContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, size, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-fg-primary opacity-40" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(content({ size }), className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

/** The heading area of a Dialog. */
export const DialogHeader = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
));
DialogHeader.displayName = "DialogHeader";

/** The dialog's accessible name. Required for screen readers. */
export const DialogTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-medium text-fg-primary", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/** A short explanation shown below the title. */
export const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-fg-secondary", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/** The action row at the bottom of a Dialog. */
export const DialogFooter = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex justify-end gap-2", className)}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";
