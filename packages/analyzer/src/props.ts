import ts from "typescript";
import type { PropUsage } from "./types.js";

export interface ExtractedProps {
  props: PropUsage[];
  complete: boolean;
  classNameLiteral: string | null;
}

function literalValue(
  initializer: ts.Expression | undefined,
  checker: ts.TypeChecker,
): { kind: PropUsage["kind"]; value: string | null } {
  if (initializer === undefined) {
    return { kind: "shorthand", value: "true" };
  }

  if (ts.isStringLiteral(initializer)) {
    return { kind: "literal", value: initializer.text };
  }

  if (ts.isJsxExpression(initializer)) {
    const inner = initializer.expression;
    if (!inner) return { kind: "dynamic", value: null };

    if (
      ts.isStringLiteral(inner) ||
      ts.isNoSubstitutionTemplateLiteral(inner)
    ) {
      return { kind: "literal", value: inner.text };
    }
    if (ts.isNumericLiteral(inner)) {
      return { kind: "literal", value: inner.text };
    }
    if (inner.kind === ts.SyntaxKind.TrueKeyword) {
      return { kind: "literal", value: "true" };
    }
    if (inner.kind === ts.SyntaxKind.FalseKeyword) {
      return { kind: "literal", value: "false" };
    }

    const type = checker.getTypeAtLocation(inner);
    if (type.isStringLiteral()) {
      return { kind: "literal", value: type.value };
    }

    return { kind: "dynamic", value: checker.typeToString(type) };
  }

  return { kind: "dynamic", value: null };
}

/**
 * Reads the attributes of a JSX element. When a spread is present the prop
 * list is necessarily incomplete, and `complete` reports that honestly.
 */
export function extractProps(
  element: ts.JsxOpeningLikeElement,
  checker: ts.TypeChecker,
): ExtractedProps {
  const props: PropUsage[] = [];
  let complete = true;
  let classNameLiteral: string | null = null;

  for (const attribute of element.attributes.properties) {
    if (ts.isJsxSpreadAttribute(attribute)) {
      complete = false;
      continue;
    }

    const name = attribute.name.getText();
    const { kind, value } = literalValue(attribute.initializer, checker);

    props.push({ name, kind, value });

    if (name === "className" && kind === "literal") {
      classNameLiteral = value;
    }
  }

  return { props, complete, classNameLiteral };
}
