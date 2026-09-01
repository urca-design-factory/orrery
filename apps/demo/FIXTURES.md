# Intentional consumer-side violations

Fixtures for the analyzer's consumer pass. Each is the expected output of a
correct check.

| File          | Rule | Violation                                          |
| ------------- | ---- | -------------------------------------------------- |
| Settings.tsx  | S-01 | raw hex in `style` attribute                       |
| Settings.tsx  | S-04 | `style` attribute used for static values           |
| Settings.tsx  | S-02 | arbitrary values `gap-[13px]`, `text-[#6b63d6]`    |
| Dashboard.tsx | S-03 | overrides `Button` colors via `className`          |
| Dashboard.tsx | S-05 | applies `mb-4` margin to a DS component            |
| Dashboard.tsx | —    | repeated card markup, 3× (promotion candidate)     |
| Reports.tsx   | —    | aliased import (`Button as Btn`) — resolution test |
| Reports.tsx   | —    | spread props — incomplete-record test              |
