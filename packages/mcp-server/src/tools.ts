import type {
  ComponentRecord,
  IndexStore,
  UsageRecord,
} from "./index-store.js";

function describeProp(prop: ComponentRecord["props"][number]): string {
  const optional = prop.optional ? "?" : "";
  const doc = prop.docComment ? `  — ${prop.docComment}` : "";
  const deprecated = prop.deprecated
    ? `  [deprecated: ${prop.deprecated}]`
    : "";
  return `  ${prop.name}${optional}: ${prop.type}${doc}${deprecated}`;
}

export function renderComponent(component: ComponentRecord): string {
  const lines: string[] = [`# ${component.name}`];

  if (component.docComment) lines.push("", component.docComment);

  lines.push("", `Defined in ${component.location.file}`);

  if (component.variants.length > 0) {
    lines.push("", "## Variants");
    for (const variant of component.variants) {
      const values = variant.values.join(" | ");
      const fallback = variant.defaultValue
        ? ` (default: ${variant.defaultValue})`
        : "";
      lines.push(`  ${variant.prop}: ${values}${fallback}`);
    }
  }

  if (component.props.length > 0) {
    lines.push("", "## Props");
    lines.push(...component.props.map(describeProp));
  }

  lines.push(
    "",
    component.forwardsRef
      ? "Forwards ref to its root element."
      : "Does not forward ref.",
  );

  return lines.join("\n");
}

export function renderUsage(usage: UsageRecord): string {
  const props = usage.props
    .map((p) =>
      p.kind === "literal" ? `${p.name}="${p.value}"` : `${p.name}={…}`,
    )
    .join(" ");

  const spread = usage.propsComplete ? "" : " {…spread}";
  const location = `${usage.location.file}:${usage.location.line}`;

  return `  <${usage.componentName} ${props}${spread} />   — ${location}`;
}

export function renderComponentList(store: IndexStore): string {
  const lines = [
    `${store.index.components.length} components in @orrery/ui:`,
    "",
  ];

  for (const component of store.index.components) {
    const usageCount = store.usagesOf(component.name).length;
    const summary = component.docComment?.split("\n")[0] ?? "";
    lines.push(`  ${component.name} — ${summary} (${usageCount} usages)`);
  }

  return lines.join("\n");
}
