import ts from "typescript";
import type { VariantDefinition } from "./types.js";

function objectLiteralOf(node: ts.Node): ts.ObjectLiteralExpression | null {
  return ts.isObjectLiteralExpression(node) ? node : null;
}

function propertyNamed(
  obj: ts.ObjectLiteralExpression,
  name: string,
): ts.Expression | null {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && prop.name.getText() === name) {
      return prop.initializer;
    }
  }
  return null;
}

/** Reads the variant matrix out of a `cva(base, config)` call. */
export function extractCvaVariants(
  call: ts.CallExpression,
): VariantDefinition[] {
  const config = call.arguments[1];
  if (!config) return [];

  const configObject = objectLiteralOf(config);
  if (!configObject) return [];

  const variantsNode = propertyNamed(configObject, "variants");
  const variantsObject = variantsNode ? objectLiteralOf(variantsNode) : null;
  if (!variantsObject) return [];

  const defaultsNode = propertyNamed(configObject, "defaultVariants");
  const defaultsObject = defaultsNode ? objectLiteralOf(defaultsNode) : null;

  const definitions: VariantDefinition[] = [];

  for (const entry of variantsObject.properties) {
    if (!ts.isPropertyAssignment(entry)) continue;

    const valuesObject = objectLiteralOf(entry.initializer);
    if (!valuesObject) continue;

    const prop = entry.name.getText();
    const values = valuesObject.properties
      .filter(ts.isPropertyAssignment)
      .map((p) => p.name.getText().replace(/^["']|["']$/g, ""));

    let defaultValue: string | null = null;
    if (defaultsObject) {
      const raw = propertyNamed(defaultsObject, prop);
      if (
        raw &&
        (ts.isStringLiteral(raw) || ts.isNoSubstitutionTemplateLiteral(raw))
      ) {
        defaultValue = raw.text;
      }
    }

    definitions.push({ prop, values, defaultValue });
  }

  return definitions;
}

export function isCvaCall(node: ts.Node): node is ts.CallExpression {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "cva"
  );
}
