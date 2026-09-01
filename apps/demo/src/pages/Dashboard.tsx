import { Badge, Button } from "@orrery/ui";

export function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium text-fg-primary mb-4">Dashboard</h1>

      <Button className="bg-green-500 text-white mb-4">Refresh</Button>

      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg-secondary">Active users</span>
            <Badge kind="success" label="+12%" />
          </div>
          <p className="mt-2 text-2xl font-medium text-fg-primary">1,284</p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg-secondary">Sessions</span>
            <Badge kind="info" label="stable" />
          </div>
          <p className="mt-2 text-2xl font-medium text-fg-primary">8,921</p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg-secondary">Error rate</span>
            <Badge kind="danger" label="+3%" />
          </div>
          <p className="mt-2 text-2xl font-medium text-fg-primary">0.42%</p>
        </div>
      </div>
    </div>
  );
}
