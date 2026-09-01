import { Button as Btn, Badge } from "@orrery/ui";

const badgeProps = { kind: "info" as const, label: "beta" };

export function Reports() {
  const actionProps = { variant: "secondary" as const, size: "sm" as const };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-medium text-fg-primary">Reports</h1>
        <Badge {...badgeProps} />
      </div>

      <div className="mt-6 flex gap-2">
        <Btn {...actionProps}>Export CSV</Btn>
        <Btn variant="ghost" size="sm">
          Schedule
        </Btn>
      </div>
    </div>
  );
}
