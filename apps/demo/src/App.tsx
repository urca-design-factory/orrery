import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { Reports } from "./pages/Reports";

export function App() {
  return (
    <main className="min-h-screen bg-bg-canvas">
      <Dashboard />
      <Settings />
      <Reports />
    </main>
  );
}
