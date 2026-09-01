import ts from "typescript";
import type {
  ComponentRecord,
  PropDefinition,
  VariantDefinition,
} from "../types.js";
import { getLocation, classifyFile, normalizePath } from "../program.js";
import { extractCvaVariants, isCvaCall } from "../cva.js";
import { makeId } from "../id.js";

const DS_MARKER = "/packages/ui/src/";

function isPascalCase(name: string): boolean {
  return /^[A-Z]/.test(name);
}

function docCommentOf(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
): string | null {
  const parts = symbol.getDocumentationComment(checker);
  const text = ts.displayPartsToString(parts).trim();
  return text.length > 0 ? text : null;
}

function deprecationOf(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
): string | null {
  const tag = symbol.getJsDocTags(checker).find((t) => t.name === "deprecated");
  if (!tag) return null;
  return ts.displayPartsToString(tag.text ?? []).trim() || "deprecated";
}

/** Props declared by the component itself, excluding inherited React props. */
function ownProps(
  componentSymbol: ts.Symbol,
  checker: ts.TypeChecker,
  declarationNode: ts.Node,
): PropDefinition[] {
  const type = checker.getTypeOfSymbolAtLocation(
    componentSymbol,
    declarationNode,
  );
  const signature =
    checker.getSignaturesOfType(
      type,
      ts.SyntaxKind.CallSignature as never,
    )[0] ?? checker.getSignaturesOfType(type, 0)[0];
  if (!signature) return [];

  const propsParam = signature.parameters[0];
  if (!propsParam) return [];

  const propsType = checker.getTypeOfSymbolAtLocation(
    propsParam,
    declarationNode,
  );

  return propsType
    .getProperties()
    .filter((prop) => {
      const decl = prop.declarations?.[0];
      if (!decl) return false;
      return normalizePath(decl.getSourceFile().fileName).includes(DS_MARKER);
    })
    .map((prop) => {
      const decl = prop.declarations![0]!;
      const propType = checker.getTypeOfSymbolAtLocation(prop, decl);
      return {
        name: prop.getName(),
        type: checker.typeToString(propType),
        optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
        docComment: docCommentOf(prop, checker),
        deprecated: deprecationOf(prop, checker),
      };
    });
}

function forwardsRef(declaration: ts.Declaration): boolean {
  if (!ts.isVariableDeclaration(declaration) || !declaration.initializer)
    return false;
  const init = declaration.initializer;
  if (!ts.isCallExpression(init)) return false;
  const callee = init.expression;
  const name = ts.isPropertyAccessExpression(callee)
    ? callee.name.text
    : ts.isIdentifier(callee)
      ? callee.text
      : "";
  return name === "forwardRef";
}

/** Maps each `const x = cva(...)` variable name to its variant matrix. */
function collectCvaByVariable(
  sourceFile: ts.SourceFile,
): Map<string, VariantDefinition[]> {
  const byVariable = new Map<string, VariantDefinition[]>();

  const visit = (node: ts.Node): void => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      isCvaCall(node.initializer)
    ) {
      byVariable.set(node.name.text, extractCvaVariants(node.initializer));
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return byVariable;
}

/** Finds which cva variable a component's implementation actually calls. */
function variantsForComponent(
  declaration: ts.Declaration,
  cvaByVariable: Map<string, VariantDefinition[]>,
): VariantDefinition[] {
  const found: VariantDefinition[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const matched = cvaByVariable.get(node.expression.text);
      if (matched) found.push(...matched);
    }
    ts.forEachChild(node, visit);
  };

  visit(declaration);
  return found;
}

export function runProducerPass(
  program: ts.Program,
  checker: ts.TypeChecker,
  root: string,
  sourceFiles: ts.SourceFile[],
): ComponentRecord[] {
  const components: ComponentRecord[] = [];

  for (const sf of sourceFiles) {
    if (classifyFile(sf.fileName, root) !== "producer") continue;

    const moduleSymbol = checker.getSymbolAtLocation(sf);
    if (!moduleSymbol) continue;

    const cvaByVariable = collectCvaByVariable(sf);

    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
      const symbol =
        exported.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(exported)
          : exported;

      const declaration = symbol.declarations?.[0];
      if (!declaration) continue;

      // Only record a component in the file that actually declares it.
      // Re-exports from a barrel resolve here too, and would otherwise duplicate.
      if (declaration.getSourceFile() !== sf) continue;

      if (!isPascalCase(symbol.getName())) continue;
      if (symbol.flags & ts.SymbolFlags.Interface) continue;
      if (symbol.flags & ts.SymbolFlags.TypeAlias) continue;

      const props = ownProps(symbol, checker, declaration);
      const refForwarded = forwardsRef(declaration);
      if (props.length === 0 && !refForwarded) continue;

      const location = getLocation(declaration, root);

      components.push({
        id: makeId("cmp", location.file, symbol.getName()),
        name: symbol.getName(),
        location,
        docComment: docCommentOf(symbol, checker),
        props,
        variants: variantsForComponent(declaration, cvaByVariable),
        forwardsRef: refForwarded,
      });
    }
  }

  return components;
}
