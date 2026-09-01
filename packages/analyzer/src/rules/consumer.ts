import ts from "typescript";
import type { Rule, Finding } from "./types.js";
import {
  finding,
  walk,
  isStringLike,
  arbitraryClasses,
  rawColors,
  marginClasses,
  stringAttribute,
} from "./util.js";
import { resolveJsxTag } from "../resolve.js";

const PRIMITIVE_COLOR =
  /^(bg|text|border|ring|fill|stroke)-(neutral|indigo|red|green|amber|slate|gray|zinc|blue|emerald|yellow|white|black)(-\d{2,3})?$/;

/** S-01: no raw color values. */
export const s01c: Rule = {
  id: "S-01",
  severity: "error",
  scope: "consumer",
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
export const s02c: Rule = {
  id: "S-02",
  severity: "error",
  scope: "consumer",
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

/** S-04: the `style` attribute is not used. */
export const s04: Rule = {
  id: "S-04",
  severity: "error",
  scope: "consumer",
  check(sf, ctx) {
    const out: Finding[] = [];
    walk(sf, (node) => {
      if (!ts.isJsxAttribute(node)) return;
      if (node.name.getText() !== "style") return;
      out.push(
        finding(
          "S-04",
          "Inline `style` attribute — use utility classes.",
          node,
          ctx.root,
        ),
      );
    });
    return out;
  },
};

/**
 * S-03 and S-05: className on a design system component must not override its
 * own colors or apply outer spacing.
 */
export const classNameOverride: Rule = {
  id: "S-03",
  severity: "error",
  scope: "consumer",
  check(sf, ctx) {
    const out: Finding[] = [];
    walk(sf, (node) => {
      if (!ts.isJsxOpeningLikeElement(node)) return;

      const resolved = resolveJsxTag(node.tagName, ctx.checker);
      if (!resolved?.isDesignSystem) return;

      const attr = stringAttribute(node, "className");
      if (!attr) return;

      const classes = attr.value.split(/\s+/);

      for (const cls of classes) {
        if (!PRIMITIVE_COLOR.test(cls.replace(/^.*:/, ""))) continue;
        out.push(
          finding(
            "S-03",
            `"${cls}" overrides ${resolved.name}'s own styling — use a variant instead.`,
            attr.node,
            ctx.root,
          ),
        );
      }

      for (const cls of marginClasses(attr.value)) {
        out.push(
          finding(
            "S-05",
            `"${cls}" applies outer spacing to ${resolved.name} — let the parent own spacing.`,
            attr.node,
            ctx.root,
          ),
        );
      }
    });
    return out;
  },
};

export const consumerRules: Rule[] = [s01c, s02c, s04, classNameOverride];
