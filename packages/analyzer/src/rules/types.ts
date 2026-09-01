import type ts from "typescript";
import type {
  ComponentRecord,
  FindingRecord,
  FindingSeverity,
  UsageRecord,
} from "../types.js";

export interface RuleContext {
  checker: ts.TypeChecker;
  root: string;
  components: ComponentRecord[];
  usages: UsageRecord[];
}

export type Finding = Omit<FindingRecord, "id">;

export interface Rule {
  id: string;
  severity: FindingSeverity;
  scope: "producer" | "consumer";
  check(sourceFile: ts.SourceFile, ctx: RuleContext): Finding[];
}