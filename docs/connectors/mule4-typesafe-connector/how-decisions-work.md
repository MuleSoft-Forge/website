---
title: How Decisions Work
description: What the TypeSafe connector returns, how policy and filter bands work, and what to expect in a Mule flow.
---

# How Decisions Work

You do not need deep Jev knowledge to use this connector. Jev turns JSON **state** and typed **questions** into numbers and labels. The connector and your flow own the if: thresholds, routes, and side effects.

## Two layers

| Layer | What it does | Runs where |
| --- | --- | --- |
| **Decide / Select** | Call the model and return typed answers (`noul`, `choice`, `score`, …). | Provider (or mock) |
| **Policy / Filter bands** | Turn those answers into keep/drop/route actions your flow can branch on. | Inside Mule — no extra HTTP call |

A typical governance flow is: **Evaluate** (or a shortcut) → **Apply Policy** → Mule **Choice** on `action` / `routeKey`. Filtering many items is a separate path: **Filter** returns `kept` / `uncertain` / `dropped` in one operation.

## What an answer looks like

| Question type | Payload shape (simplified) | How the flow usually uses it |
| --- | --- | --- |
| **Noul** (yes/no) | `noul` = probability of “yes” (`0`–`1`) | Compare to a threshold, or three bands (yes / no / middle) |
| **Choice** | `choice`, option probabilities, optional confidence | Route on the label; demand higher certainty for riskier options |
| **Score** | `score`, level, level distribution | Accept or review named levels |

[Evaluate](./operations/evaluate) returns named answers under `payload.answers.<id>`. Shortcuts (`ask-noul`, `choose`, `score`) return a **single** answer shaped as question id `result`. A question-set policy keyed by real ids will not see that shortcut answer — see [fails closed](#policy-fails-closed) below.

## Policy: ACCEPT, REVIEW, REJECT

[Apply Policy](./operations/apply-policy) reads answers plus local thresholds and returns:

```json
{ "action": "ACCEPT|REVIEW|REJECT", "routeKey": "…", "reasons": [], "perQuestion": {} }
```

Across questions, the most cautious action wins: `REJECT` > `REVIEW` > `ACCEPT`.

### Prefer three-band Noul

For yes/no questions, prefer:

```json
"urgent": {
  "yesAbove": 0.7,
  "noBelow": 0.3,
  "onYes": "ACCEPT",
  "onNo": "ACCEPT",
  "onUncertain": "REVIEW"
}
```

A clear “no” is usually still fine for the rest of the decision (`onNo: ACCEPT`). Legacy `rejectBelow` turns a clear “no” into `REJECT` for the **whole** decision — Validate Question Set warns about that.

### Per-option Choice

Riskier Choice options can demand more certainty:

```json
"team": {
  "minProbability": 0.7,
  "onNoMatch": "REVIEW",
  "options": {
    "other": { "action": "REVIEW", "minConfidence": 0.7 }
  }
}
```

### Stable `routeKey`

Set `policy.routeQuestion` to the Choice id that should supply `routeKey` (for example `"routeQuestion": "team"`). If you omit it, the connector uses the first Choice answer in the decision — reordering questions can change routing.

### Policy fails closed

Since **1.0.2**, Apply Policy returns **`REVIEW`**, never a silent **`ACCEPT`**, when it has nothing trustworthy to judge:

| Situation | Expect |
| --- | --- |
| Empty or wrong decision payload | `REVIEW` — `decision has no answers to judge` |
| Policy rule whose question has no answer (common: shortcut `result` vs question-set ids) | `REVIEW` — `<id>: no answer to judge` |
| Rule keys that do not fit the answer type | `REVIEW` — `rule does not fit a '…' answer` |

Invalid policies raise **`TYPESAFE:INVALID_QUESTION_SET`** before evaluation (misspelt keys, wrong question type, inverted bands, and so on). Run [Validate Question Set](./operations/validate-question-set) on the file first — it checks the same `policy` block.

### Raise on review / reject

When **Raise on review** or **Raise on reject** is enabled, Apply Policy raises typed `TYPESAFE:BELOW_THRESHOLD` or `TYPESAFE:REJECTED`. Error handlers for those types match. Before 1.0.2 those raises were rewritten to `MULE:UNKNOWN`.

## Filter: kept, uncertain, dropped

[Filter](./operations/filter) asks one Noul per item and partitions the array:

| Band | Rule |
| --- | --- |
| `kept` | `noul >= threshold` |
| `dropped` | `noul < dropBelow` |
| `uncertain` | in between, when `dropBelow` &lt; `threshold` |

If you leave **Drop below** equal to **Threshold** (the default), there is no middle band — every item is kept or dropped.

Items are sent in `state.items` and each question refers to `items[i]`. Item text is **not** pasted into the instructions (TypeSafe packing). Attributes `succeeded` means **kept count** on this operation.

## Drift on Noul-only traffic

[On Drift Detected](./sources#on-drift-detected) watches no-match rate, mean confidence, and answer distribution. Noul answers have no provider confidence field, so the connector uses certainty `|noul − 0.5| × 2` and buckets answers as `yes` / `no` / `uncertain`. Noul-only question sets still drive drift the same way Choice/Score do.

## What not to expect

- Policy and validation do **not** call the provider.
- Apply Policy does **not** invent answers — wire Evaluate (or the matching shortcut shape) first.
- Filter does **not** apply a question-set `policy` block; use Apply Policy after Evaluate for full governance.
- Official Jev docs describe the model and API; this connector’s thresholds, fail-closed rules, and band behavior are documented here and on the operation pages.

## See also

- [Apply Policy](./operations/apply-policy) — actions, fail-closed, validation, `routeQuestion`
- [Filter](./operations/filter) — packing and three bands
- [Validate Question Set](./operations/validate-question-set) — questions and `policy` checks
- [Sources](./sources) — drift, budget, failover
- [Set Up](./set-up) — install and first question set
- [Jev introduction](https://docs.typesafe.ai/introduction) — optional deeper reading on System One
