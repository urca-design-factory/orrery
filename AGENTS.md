# Working in this repository

This project has a design system at `packages/ui` and an index of it exposed
through the `orrery` MCP server.

Before writing or modifying any UI code:

1. Call `list_components` to see what already exists. Do not write a new
   component if one is already available.
2. Call `get_component` for the exact prop names, types and variant values.
   Do not guess prop names — several components in this system deviate from
   the conventions on purpose.
3. Call `get_conventions` before adding a new component to `packages/ui`.

Product code lives in `apps/*`. The design system is consumed from
`@orrery/ui`; never import from its internal paths.

Styling uses Tailwind v4 with semantic tokens. Do not write raw hex values,
arbitrary values (`p-[13px]`), or override a design system component's colors
through `className`.
