# Intentional violations

These components deliberately break conventions. They are fixtures for the
analyzer and the reviewer, not oversights. Each entry is the expected output of
a correct check — this file doubles as the seed for the eval golden set.

| Component | Rule | Violation                        | Detected by |
| --------- | ---- | -------------------------------- | ----------- |
| Badge     | N-03 | uses `kind` instead of `variant` | analyzer    |
| Badge     | P-05 | takes a `label` string prop      | reviewer    |
| Input     | N-02 | uses `isDisabled` and `hasError` | analyzer    |
| Input     | P-01 | two mutually exclusive booleans  | reviewer    |
| Input     | S-02 | arbitrary value `min-h-[38px]`   | analyzer    |
| Input     | D-02 | props undocumented               | analyzer    |

Button is the reference implementation and violates nothing.
