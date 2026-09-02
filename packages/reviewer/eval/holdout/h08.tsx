// @expect N-06
import { useCallback, useEffect, useRef, useState } from "react";
import { cva } from "class-variance-authority";

type Position = { top: number; left: number };

function clampToViewport(
  position: Position,
  width: number,
  height: number,
): Position {
  const maxLeft = window.innerWidth - width - 8;
  const maxTop = window.innerHeight - height - 8;
  return {
    top: Math.min(Math.max(8, position.top), Math.max(8, maxTop)),
    left: Math.min(Math.max(8, position.left), Math.max(8, maxLeft)),
  };
}

function useAnchoredPosition(anchor: HTMLElement | null) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const elementRef = useRef<HTMLDivElement | null>(null);

  const update = useCallback(() => {
    if (!anchor || !elementRef.current) return;
    const rect = anchor.getBoundingClientRect();
    const box = elementRef.current.getBoundingClientRect();
    setPosition(
      clampToViewport(
        { top: rect.bottom + 4, left: rect.left },
        box.width,
        box.height,
      ),
    );
  }, [anchor]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [update]);

  return { position, elementRef };
}

const menu = cva(
  "min-w-40 rounded-md border border-border-default bg-bg-surface py-1 shadow-none",
  {
    variants: {
      variant: {
        default: "text-sm",
        compact: "py-0.5 text-xs",
        wide: "min-w-64",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface DropdownProps {
  /** Element the menu is positioned against. */
  anchor: HTMLElement | null;
  /** Whether the menu is currently open. */
  open: boolean;
  /** Called when the menu should close. */
  onClose: () => void;
  children: React.ReactNode;
}

/** A menu anchored to a trigger element. */
export function Dropdown({ anchor, open, onClose, children }: DropdownProps) {
  const { position, elementRef } = useAnchoredPosition(anchor);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={elementRef}
      role="menu"
      className={menu({ variant: "default" })}
      style={{ position: "fixed", top: position.top, left: position.left }}
    >
      {children}
    </div>
  );
}
