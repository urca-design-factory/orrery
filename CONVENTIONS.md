# Orrery component conventions

This document defines the rules every component in `@orrery/ui` must follow.
It is the source of truth for both human reviewers and the automated reviewer
(`@orrery/reviewer`).

Every rule has a permanent id (`N-01`, `P-02`, ...). Ids are never reused; if a
rule is removed, its number is retired.

Each rule carries one of three tags:

- `[auto]` — checked deterministically via lint/AST. The model never touches these.
- `[llm]` — requires judgement; checked by the model.
- `[manual]` — human review only.

---

## N — Naming

**N-01** `[auto]` Component names are PascalCase, and the file name matches the component name exactly (`Button.tsx` → `Button`).
**N-02** `[auto]` Boolean props take no prefix. Use `disabled`, `loading`, `required` — not `isDisabled` or `hasError`.
**N-03** `[auto]` The prop controlling visual variation is named `variant`. Do not use `kind`, `type`, `appearance`, or `style`.
**N-04** `[auto]` The prop controlling scale is named `size`, and its values come from `sm | md | lg`.
**N-05** `[auto]` Event handler props are `on` + PascalCase event name (`onSelect`, `onOpenChange`). `handleSelect` is not a prop name.
**N-06** `[llm]` `variant` values describe intent, not appearance: `primary`, `secondary`, `danger` — not `blue`, `big`, or `outlined-rounded`.

---

## P — Prop design

**P-01** `[auto]` No distinction that could grow past two states is modelled as a boolean. Two mutually exclusive booleans must be a single enum.
**P-02** `[auto]` Every component extends the native props of its root element (`extends React.ComponentPropsWithoutRef<"button">`).
**P-03** `[auto]` Every component forwards `ref` to its root DOM element.
**P-04** `[auto]` Defaults for `variant` and `size` are declared in the CVA config via `defaultVariants`, not in JSX.
**P-05** `[llm]` Content is passed as `children`, not through props. Avoid string props like `label`, `text`, or `content`.
**P-06** `[llm]` A component carrying more than five visual variation props should be split into composable parts.
**P-07** `[auto]` The `className` prop is accepted and merged via `cn()`; it is never ignored or assigned directly.

---

## S — Styling

**S-01** `[auto]` No raw color values. Hex, `rgb()`, and `hsl()` are forbidden.
**S-02** `[auto]` No Tailwind arbitrary values (`p-[13px]`, `text-[#3b82f6]`). Needing to escape the scale signals a missing token.
**S-03** `[auto]` Primitive color tokens are not used in components. Only the semantic layer (`bg-accent-default`, `text-fg-muted`).
**S-04** `[auto]` The `style` attribute is not used. The only exception is position or size values computed at runtime.
**S-05** `[auto]` A component never defines its own outer spacing. `margin` utilities are forbidden on a component root; spacing is the caller's responsibility.

---

## A — Accessibility

**A-01** `[auto]` Interactive components are built on Radix primitives. Do not hand-roll focus management, keyboard navigation, or portals.
**A-02** `[auto]` Icon-only interactive elements require `aria-label`, enforced at the type level.
**A-03** `[auto]` Focus indicators are never removed. `outline-none` appears only alongside `focus-visible:ring-*`.
**A-04** `[llm]` Color alone never carries meaning; state is also conveyed through text or an icon.

---

## C — Composition
**C-01** `[llm]` A component requiring more than three levels of nested configuration is split into subcomponents (`Card` / `CardHeader` / `CardBody`).
**C-02** `[auto]` Subcomponents are defined in the parent component's file and their names start with the parent's name.
**C-03** `[llm]` Before adding a new component, evaluate whether an existing one could solve the problem with an added prop.
**C-04** `[manual]` A component is not promoted into `@orrery/ui` until it has appeared in three separate places in the same form.

---

## D — Documentation
**D-01** `[auto]` Every exported component carries a TSDoc description.
**D-02** `[auto]` Every public prop carries a TSDoc line.
**D-03** `[auto]` Deprecated props are marked with `@deprecated` and state what replaces them.