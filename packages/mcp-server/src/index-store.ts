import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface StoreOptions {
  indexPath: string;
  conventionsPath: string;
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
  location: { file: string; line: number; column: number };
  docComment: string | null;
  props: PropDefinition[];
  variants: VariantDefinition[];
  forwardsRef: boolean;
}

export interface UsageRecord {
  id: string;
  componentName: string;
  componentId: string | null;
  location: { file: string; line: number; column: number };
  props: { name: string; kind: string; value: string | null }[];
  propsComplete: boolean;
  classNameLiteral: string | null;
}

export interface OrreryIndex {
  version: 1;
  generatedAt: string;
  components: ComponentRecord[];
  usages: UsageRecord[];
  findings: unknown[];
  clusters: unknown[];
}

export class IndexStore {
  private constructor(
    readonly index: OrreryIndex,
    readonly conventions: string,
  ) {}

  static load(options: StoreOptions): IndexStore {
    const index = JSON.parse(
      readFileSync(resolve(options.indexPath), "utf8"),
    ) as OrreryIndex;
    if (index.version !== 1) {
      throw new Error(`Unsupported index version: ${index.version}`);
    }
    const conventions = readFileSync(resolve(options.conventionsPath), "utf8");
    return new IndexStore(index, conventions);
  }

  findComponent(name: string): ComponentRecord | null {
    const lower = name.toLowerCase();
    return (
      this.index.components.find((c) => c.name.toLowerCase() === lower) ?? null
    );
  }

  usagesOf(name: string): UsageRecord[] {
    const lower = name.toLowerCase();
    return this.index.usages.filter(
      (u) => u.componentName.toLowerCase() === lower,
    );
  }
}
