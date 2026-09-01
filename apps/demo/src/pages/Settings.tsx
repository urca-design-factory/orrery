import { Button, Input } from "@orrery/ui";

export function Settings() {
  return (
    <div className="p-6" style={{ backgroundColor: "#f8f8f7" }}>
      <h1 className="text-2xl font-medium text-fg-primary">Settings</h1>

      <div className="mt-6 flex flex-col gap-[13px]">
        <label className="text-sm text-[#6b63d6]">Display name</label>
        <Input placeholder="Jane Doe" />

        <label className="text-sm text-fg-secondary">Email</label>
        <Input placeholder="jane@example.com" hasError isDisabled />

        <Button variant="primary" style={{ marginTop: 24 }}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
