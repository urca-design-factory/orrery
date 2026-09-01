import ts from "typescript";
import { createHash } from "node:crypto";
import type { SourceLocation } from "./types.js";
import { getLocation } from "./program.js";
import { stringAttribute } from "./rules/util.js";

export interface ClusterMember {
  location: SourceLocation;
  depth: number;
  file: string;
  start: number;
  end: number;
}

export interface ClusterRecord {
  id: string;
  signature: string;
  shape: string;
  occurrences: number;
  members: ClusterMember[];
}

/** Depth of a JSX subtree, counting element nodes only. */
function subtreeSize(node: ts.JsxElement | ts.JsxSelfClosingElement): number {
  let count = 0;
  const visit = (n: ts.Node): void => {
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) count++;
    ts.forEachChild(n, visit);
  };
  visit(node);
  return count;
}

function tagOf(node: ts.JsxElement | ts.JsxSelfClosingElement): string {
  return ts.isJsxElement(node)
    ? node.openingElement.tagName.getText()
    : node.tagName.getText();
}

function openingOf(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
): ts.JsxOpeningLikeElement {
  return ts.isJsxElement(node) ? node.openingElement : node;
}

/**
 * A structural fingerprint: tag names plus sorted class lists, with text
 * content and dynamic values excluded. Two blocks that differ only in their
 * copy produce the same signature.
 */
function signatureOf(node: ts.JsxElement | ts.JsxSelfClosingElement): string {
  const parts: string[] = [];

  const visit = (n: ts.Node): void => {
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
      const tag = tagOf(n);
      const className = stringAttribute(openingOf(n), "className");
      const classes = className
        ? className.value.split(/\s+/).filter(Boolean).sort().join(".")
        : "";
      parts.push(`${tag}[${classes}]`);
    }
    ts.forEachChild(n, visit);
  };

  visit(node);
  return parts.join(">");
}

function isHostElement(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
): boolean {
  const tag = tagOf(node);
  return tag[0] === tag[0]?.toLowerCase();
}

const MIN_SUBTREE_SIZE = 3;
const MIN_OCCURRENCES = 3;

/** True when every member of `inner` sits inside some member of `outer`. */
function isContainedBy(
  inner: ClusterMember[],
  outer: ClusterMember[],
): boolean {
  return inner.every((i) =>
    outer.some(
      (o) =>
        o.file === i.file &&
        o.start <= i.start &&
        o.end >= i.end &&
        o.start !== i.start,
    ),
  );
}

export function findClusters(
  sourceFiles: ts.SourceFile[],
  root: string,
  isConsumer: (fileName: string) => boolean,
): ClusterRecord[] {
  const bySignature = new Map<
    string,
    { shape: string; members: ClusterMember[] }
  >();

  for (const sf of sourceFiles) {
    if (!isConsumer(sf.fileName)) continue;

    const visit = (node: ts.Node): void => {
      if (ts.isJsxElement(node)) {
        const size = subtreeSize(node);

        if (size >= MIN_SUBTREE_SIZE && isHostElement(node)) {
          const signature = signatureOf(node);
          const entry = bySignature.get(signature) ?? {
            shape: `${tagOf(node)} (${size} elements)`,
            members: [],
          };
          entry.members.push({
            location: getLocation(node, root),
            depth: size,
            file: sf.fileName,
            start: node.getStart(),
            end: node.getEnd(),
          });
          bySignature.set(signature, entry);
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(sf);
  }

  const candidates = [...bySignature.entries()]
    .filter(([, e]) => e.members.length >= MIN_OCCURRENCES)
    .sort((a, b) => b[1].members[0]!.depth - a[1].members[0]!.depth);

  // Keep only maximal clusters: a repeated block nested inside a larger
  // repeated block is part of that block, not a separate candidate.
  const kept: typeof candidates = [];
  for (const candidate of candidates) {
    const nested = kept.some(([, outer]) =>
      isContainedBy(candidate[1].members, outer.members),
    );
    if (!nested) kept.push(candidate);
  }

  return kept
    .map(([signature, entry]) => ({
      id: `clu_${createHash("sha256").update(signature).digest("hex").slice(0, 10)}`,
      signature,
      shape: entry.shape,
      occurrences: entry.members.length,
      members: entry.members,
    }))
    .sort((a, b) => b.occurrences - a.occurrences);
}
