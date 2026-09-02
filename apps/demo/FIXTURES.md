# Intentional consumer-side violations

Fixtures for the analyzer's consumer pass. Each is the expected output of a
correct check.

| File          | Rule | Violation                                          |
| ------------- | ---- | -------------------------------------------------- |
| Settings  | S-01 | raw hex in `style` attribute                       |
| Settings  | S-04 | `style` attribute used for static values           |
| Settings  | S-02 | arbitrary values `gap-[13px]`, `text-[#6b63d6]`    |
| Dashboard | S-03 | overrides `Button` colors via `className`          |
| Dashboard | S-05 | applies `mb-4` margin to a DS component            |
| Dashboard | —    | repeated card markup, 3× (promotion candidate)     |
| Reports   | —    | aliased import (`Button as Btn`) — resolution test |
| Reports   | —    | spread props — incomplete-record test              |
