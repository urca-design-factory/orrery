import ts from "typescript";
import { getLocation, normalizePath } from "../program.js";
import type { ComponentRecord } from "../types.js";
import type { Finding } from "./types.js";

export function walk(node: ts.Node, visit: (n: ts.Node) => void): void {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

export function finding(
  rule: string,
  message: string,
  node: ts.Node,
  root: string,
  severity: Finding["severity"] = "error",
): Finding {
  return { rule, severity, message, location: getLocation(node, root) };
}

export function isStringLike(
  node: ts.Node,
): node is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

const ARBITRARY = /(^|:)[a-z-]+-\[[^\]]+\]/;
const ARBITRARY_GLOBAL = /(^|\s)[a-z-]+-\[[^\]]+\]/g;
const RAW_COLOR_GLOBAL =
  /#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g;
const MARGIN = /^-?m[trblxy]?-/;

export function arbitraryClasses(className: string): string[] {
  return className.split(/\s+/).filter((c) => ARBITRARY.test(c));
}

/**
 * Raw color literals, excluding those already inside a Tailwind arbitrary
 * value — those are reported by S-02, and reporting both is noise.
 */
export function rawColors(text: string): string[] {
  const stripped = text.replace(ARBITRARY_GLOBAL, " ");
  return [...stripped.matchAll(RAW_COLOR_GLOBAL)].map((m) => m[0]);
}

export function marginClasses(className: string): string[] {
  return className
    .split(/\s+/)
    .filter((c) => MARGIN.test(c.replace(/^.*:/, "")));
}

/** Components whose declaration lives in this exact source file. */
export function componentsIn(
  sourceFile: ts.SourceFile,
  components: ComponentRecord[],
  root: string,
): ComponentRecord[] {
  const rel = normalizePath(sourceFile.fileName).replace(root + "/", "");
  return components.filter((c) => c.location.file === rel);
}

/** A JSX attribute's value when it is a statically known string. */
export function stringAttribute(
  element: ts.JsxOpeningLikeElement,
  name: string,
): { value: string; node: ts.Node } | null {
  for (const attr of element.attributes.properties) {
    if (!ts.isJsxAttribute(attr)) continue;
    if (attr.name.getText() !== name) continue;

    const init = attr.initializer;
    if (!init) return null;

    if (ts.isStringLiteral(init)) return { value: init.text, node: init };

    if (ts.isJsxExpression(init) && init.expression) {
      const inner = init.expression;
      if (isStringLike(inner)) return { value: inner.text, node: inner };
    }
    return null;
  }
  return null;
}
