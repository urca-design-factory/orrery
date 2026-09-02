// @expect P-05
export interface CalloutProps {
  title: string;
  body: string;
}

export function Callout({ title, body }: CalloutProps) {
  return (
    <div className="rounded-lg border border-border-default p-4">
      <p className="font-medium text-fg-primary">{title}</p>
      <p className="text-sm text-fg-secondary">{body}</p>
    </div>
  );
}
