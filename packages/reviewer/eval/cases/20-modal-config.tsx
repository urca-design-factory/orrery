// @expect C-01 P-05 P-06
export interface ModalProps {
  open: boolean;
  titleText: string;
  descriptionText?: string;
  bodyContent: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  showCloseButton?: boolean;
  showFooterDivider?: boolean;
  width?: "sm" | "md" | "lg";
  centered?: boolean;
  onConfirm?: () => void;
}

/** A dialog that interrupts the current task. */
export function Modal({ open, titleText, bodyContent }: ModalProps) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="rounded-lg bg-bg-surface p-6"
    >
      <h2 className="text-lg font-medium text-fg-primary">{titleText}</h2>
      {bodyContent}
    </div>
  );
}
