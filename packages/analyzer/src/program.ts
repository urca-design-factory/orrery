import ts from "typescript";
import { dirname, resolve } from "node:path";

/** Normalizes a path so `/` is the separator on every platform. */
export function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

export interface AnalyzerProgram {
  program: ts.Program;
  checker: ts.TypeChecker;
  workspaceRoot: string;
}

export function createAnalyzerProgram(tsconfigPath: string): AnalyzerProgram {
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"),
    );
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    dirname(tsconfigPath),
  );

  if (parsed.errors.length > 0) {
    throw new Error(
      parsed.errors
        .map((e) => ts.flattenDiagnosticMessageText(e.messageText, "\n"))
        .join("\n"),
    );
  }

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  });

  return {
    program,
    checker: program.getTypeChecker(),
    workspaceRoot: normalizePath(resolve(dirname(tsconfigPath), "../..")),
  };
}

/** Source files worth walking: excludes declarations and dependencies. */
export function getProjectSourceFiles(program: ts.Program): ts.SourceFile[] {
  return program
    .getSourceFiles()
    .filter(
      (f) =>
        !f.isDeclarationFile &&
        !normalizePath(f.fileName).includes("/node_modules/"),
    );
}

export function getLocation(
  node: ts.Node,
  root: string,
): {
  file: string;
  line: number;
  column: number;
} {
  const sf = node.getSourceFile();
  const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart());
  const abs = normalizePath(sf.fileName);
  return {
    file: abs.startsWith(root + "/") ? abs.slice(root.length + 1) : abs,
    line: line + 1,
    column: character + 1,
  };
}

export type FileScope = "producer" | "consumer" | "external";

export function classifyFile(fileName: string, root: string): FileScope {
  const rel = normalizePath(fileName).replace(root + "/", "");
  if (rel.startsWith("packages/ui/src/")) return "producer";
  if (rel.startsWith("apps/")) return "consumer";
  return "external";
}
