import ts from "typescript";
import type { UsageRecord } from "../types.js";
import { resolveJsxTag } from "../resolve.js";
import { extractProps } from "../props.js";
import { makeId } from "../id.js";
import { getLocation, classifyFile, normalizePath } from "../program.js";

export function runConsumerPass(
  program: ts.Program,
  checker: ts.TypeChecker,
  root: string,
  sourceFiles: ts.SourceFile[],
): UsageRecord[] {
  const usages: UsageRecord[] = [];

  for (const sf of sourceFiles) {
    if (classifyFile(sf.fileName, root) !== "consumer") continue;

    const visit = (node: ts.Node): void => {
      if (ts.isJsxOpeningLikeElement(node)) {
        const resolved = resolveJsxTag(node.tagName, checker);
        if (resolved?.isDesignSystem) {
          const location = getLocation(node, root);
          const { props, complete, classNameLiteral } = extractProps(
            node,
            checker,
          );

          const relativeDecl = normalizePath(resolved.declarationFile).replace(
            root + "/",
            "",
          );

          usages.push({
            id: makeId("use", location.file, location.line, location.column),
            componentName: resolved.name,
            componentId: makeId("cmp", relativeDecl, resolved.name),
            location,
            props,
            propsComplete: complete,
            classNameLiteral,
          });
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(sf);
  }

  return usages;
}
