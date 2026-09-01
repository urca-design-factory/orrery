import type { ClusterRecord } from "./cluster.js";

export interface SourceLocation {
  file: string;
  line: number;
  column: number;
}

export interface PropDefinition {
  name: string;
  type: string;
  optional: boolean;
  docComment: string | null;
  deprecated: string | null;
}

export interface VariantDefinition {
  prop: string;
  values: string[];
  defaultValue: string | null;
}

export interface ComponentRecord {
  id: string;
  name: string;
  location: SourceLocation;
  docComment: string | null;
  props: PropDefinition[];
  variants: VariantDefinition[];
  forwardsRef: boolean;
}

export interface PropUsage {
  name: string;
  kind: "literal" | "dynamic" | "shorthand";
  value: string | null;
}

export interface UsageRecord {
  id: string;
  componentName: string;
  componentId: string | null;
  location: SourceLocation;
  props: PropUsage[];
  propsComplete: boolean;
  classNameLiteral: string | null;
}

export type FindingSeverity = "error" | "warning" | "info";

export interface FindingRecord {
  id: string;
  rule: string;
  severity: FindingSeverity;
  message: string;
  location: SourceLocation;
}

export interface OrreryIndex {
  version: 1;
  generatedAt: string;
  components: ComponentRecord[];
  usages: UsageRecord[];
  findings: FindingRecord[];
}

export interface OrreryIndex {
  version: 1;
  generatedAt: string;
  components: ComponentRecord[];
  usages: UsageRecord[];
  findings: FindingRecord[];
  clusters: ClusterRecord[];
}
