// @expect C-01 P-05 P-06
export interface PanelProps {
  headerTitle: string;
  headerSubtitle?: string;
  headerAction?: React.ReactNode;
  bodyContent: React.ReactNode;
  bodyPadding?: "none" | "sm" | "md";
  footerPrimaryLabel?: string;
  footerSecondaryLabel?: string;
  footerAlign?: "left" | "right";
  bordered?: boolean;
  elevated?: boolean;
}

export function Panel(props: PanelProps) {
  return <div className="rounded-lg bg-bg-surface">{props.bodyContent}</div>;
}
