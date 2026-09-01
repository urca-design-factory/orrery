import ts from "typescript";
import { normalizePath } from "./program.js";

export interface ResolvedComponent {
  name: string;
  declarationFile: string;
  isDesignSystem: boolean;
}

const DS_MARKER = "/packages/ui/src/";

function unalias(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
  const seen = new Set<ts.Symbol>();
  let current = symbol;
  while (current.flags & ts.SymbolFlags.Alias) {
    if (seen.has(current)) break;
    seen.add(current);
    const next = checker.getAliasedSymbol(current);
    if (next === current) break;
    current = next;
  }
  return current;
}

/** True when the symbol is part of its own module's public exports. */
function isModuleExport(symbol: ts.Symbol, checker: ts.TypeChecker): boolean {
  const declaration = symbol.declarations?.[0];
  if (!declaration) return false;

  const moduleSymbol = checker.getSymbolAtLocation(declaration.getSourceFile());
  if (!moduleSymbol) return false;

  return checker
    .getExportsOfModule(moduleSymbol)
    .some((exported) => unalias(exported, checker) === symbol);
}

/**
 * Resolves a JSX tag to the symbol it actually refers to, following import
 * aliases and re-exports. Returns null for host elements and for locals that
 * merely happen to live in a design system file.
 */
export function resolveJsxTag(
  tagName: ts.JsxTagNameExpression,
  checker: ts.TypeChecker,
): ResolvedComponent | null {
  if (ts.isIdentifier(tagName)) {
    const text = tagName.text;
    if (text[0] === text[0]?.toLowerCase()) return null;
  }

  const initial = checker.getSymbolAtLocation(tagName);
  if (!initial) return null;

  const symbol = unalias(initial, checker);
  const declaration = symbol.declarations?.[0];
  if (!declaration) return null;

  const declarationFile = normalizePath(declaration.getSourceFile().fileName);
  const inDsPackage = declarationFile.includes(DS_MARKER);

  return {
    name: symbol.getName(),
    declarationFile,
    isDesignSystem: inDsPackage && isModuleExport(symbol, checker),
  };
}
