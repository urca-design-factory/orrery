import type { Rule, Finding } from "./types.js";
import {
  finding,
  walk,
  isStringLike,
  arbitraryClasses,
  rawColors,
  componentsIn,
} from "./util.js";

const BOOLEAN_PREFIX = /^(is|has|should|can)[A-Z]/;
const VARIANT_ALIASES = new Set(["kind", "appearance", "look", "theme"]);

/** N-02: boolean props take no prefix. */
export const n02: Rule = {
  id: "N-02",
  severity: "error",
  scope: "producer",
  check(sf, ctx) {
    const out: Finding[] = [];
    for (const component of componentsIn(sf, ctx.components, ctx.root)) {
      for (const prop of component.props) {
        if (!BOOLEAN_PREFIX.test(prop.name)) continue;
        if (!prop.type.includes("boolean")) continue;
        out.push({
          rule: "N-02",
          severity: "error",
          message: `Boolean prop "${prop.name}" on ${component.name} should not carry a prefix.`,
          location: component.location,
        });
      }
    }
    return out;
  },
};

/** N-03: the visual variation prop is named `variant`. */
export const n03: Rule = {
  id: "N-03",
  severity: "error",
  scope: "producer",
  check(sf, ctx) {
    const out: Finding[] = [];
    for (const component of componentsIn(sf, ctx.components, ctx.root)) {
      for (const variant of component.variants) {
        if (!VARIANT_ALIASES.has(variant.prop)) continue;
        out.push({
          rule: "N-03",
          severity: "error",
          message: `${component.name} uses "${variant.prop}" for visual variation; use "variant".`,
          location: component.location,
        });
      }
    }
    return out;
  },
};

/** D-02: every public prop carries a TSDoc line. */
export const d02: Rule = {
  id: "D-02",
  severity: "warning",
  scope: "producer",
  check(sf, ctx) {
    const out: Finding[] = [];
    for (const component of componentsIn(sf, ctx.components, ctx.root)) {
      for (const prop of component.props) {
        if (prop.docComment !== null) continue;
        if (component.variants.some((v) => v.prop === prop.name)) continue;
        out.push({
          rule: "D-02",
          severity: "warning",
          message: `Prop "${prop.name}" on ${component.name} is undocumented.`,
          location: component.location,
        });
      }
    }
    return out;
  },
};

/** S-01: no raw color values. */
export const s01: Rule = {
  id: "S-01",
  severity: "error",
  scope: "producer",
  check(sf, ctx) {
    const out: Finding[] = [];
    walk(sf, (node) => {
      if (!isStringLike(node)) return;
      for (const color of rawColors(node.text)) {
        out.push(
          finding(
            "S-01",
            `Raw color value "${color}" — use a semantic token.`,
            node,
            ctx.root,
          ),
        );
      }
    });
    return out;
  },
};

/** S-02: no Tailwind arbitrary values. */
export const s02: Rule = {
  id: "S-02",
  severity: "error",
  scope: "producer",
  check(sf, ctx) {
    const out: Finding[] = [];
    walk(sf, (node) => {
      if (!isStringLike(node)) return;
      for (const cls of arbitraryClasses(node.text)) {
        out.push(
          finding(
            "S-02",
            `Arbitrary value "${cls}" escapes the token scale.`,
            node,
            ctx.root,
          ),
        );
      }
    });
    return out;
  },
};

export const producerRules: Rule[] = [n02, n03, d02, s01, s02];
