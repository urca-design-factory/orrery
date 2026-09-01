import { resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { IndexStore } from "./index-store.js";
import { renderComponent, renderComponentList, renderUsage } from "./tools.js";

const workspaceRoot =
  process.env.ORRERY_ROOT ?? resolve(process.cwd(), "../..");

const store = IndexStore.load({
  indexPath: resolve(workspaceRoot, "packages/analyzer/artifacts/index.json"),
  conventionsPath: resolve(workspaceRoot, "CONVENTIONS.md"),
});

const server = new McpServer({ name: "orrery", version: "0.1.0" });

const text = (value: string) => ({
  content: [{ type: "text" as const, text: value }],
});

server.tool(
  "list_components",
  "List every component available in the design system, with a one-line summary and how often each is used. Call this before writing any UI to check whether a component already exists.",
  {},
  async () => text(renderComponentList(store)),
);

server.tool(
  "get_component",
  "Get the exact API of one component: its props, types, variant values and defaults. Call this before using a component so the props are real rather than guessed.",
  { name: z.string().describe("Component name, e.g. 'Button'") },
  async ({ name }) => {
    const component = store.findComponent(name);
    if (!component) {
      const available = store.index.components.map((c) => c.name).join(", ");
      return text(`No component named "${name}". Available: ${available}`);
    }
    return text(renderComponent(component));
  },
);

server.tool(
  "find_usages",
  "Show how a component is actually used in product code today, with real prop combinations and file locations.",
  { name: z.string().describe("Component name, e.g. 'Button'") },
  async ({ name }) => {
    const usages = store.usagesOf(name);
    if (usages.length === 0) return text(`${name} is not used anywhere yet.`);
    return text(
      [
        `${usages.length} usages of ${name}:`,
        "",
        ...usages.map(renderUsage),
      ].join("\n"),
    );
  },
);

server.tool(
  "get_conventions",
  "Read the design system's component conventions: naming, prop design, styling and accessibility rules that new code must follow.",
  {},
  async () => text(store.conventions),
);

await server.connect(new StdioServerTransport());
