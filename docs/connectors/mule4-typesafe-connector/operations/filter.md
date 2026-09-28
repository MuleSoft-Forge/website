---
title: "[Select] Filter"
description: Retain JSON items whose TypeSafe Noul probability meets a threshold.
---

# [Select] Filter

Asks one yes/no question about every item and keeps the items whose Noul probability reaches the configured threshold.

## Inputs

| Parameter | Required | Default | Description |
| --- | :---: | --- | --- |
| Items | Yes | — | JSON array to evaluate. |
| Question | Yes | — | Yes/no question asked of each item. |
| Threshold | No | `0.5` | Minimum probability of “yes” required to keep an item. |
| Chunk size | No | `20` | Items packed into one provider call, clamped to 1–100. |
| Text field | No | Entire item | Field shown to the model instead of the full item. |
| Max concurrency | No | `4` | Concurrent chunks, clamped to 1–32. |
| Request options | No | — | Shared model, response, cache, and trace settings. |

## Output

```json
{
  "kept": [
    { "id": "T-1001", "priority": "high" }
  ],
  "dropped": [
    { "id": "T-1002", "priority": "low" }
  ],
  "scores": [
    { "index": 0, "noul": 0.91, "kept": true },
    { "index": 1, "noul": 0.24, "kept": false }
  ]
}
```

Batch attributes report totals, token usage, and estimated cost.

## Provider calls

Each chunk becomes one decision request containing one Noul question per item. Any chunk failure fails the operation. A budget refusal during filtering raises `TYPESAFE:BUDGET_EXCEEDED`.

## XML example

```xml
<typesafe:filter
    config-ref="TypeSafe_Config"
    question="Is this ticket urgent?"
    threshold="0.7"
    chunkSize="20"
    textField="body"
    maxConcurrency="4">
    <typesafe:items>#[payload]</typesafe:items>
</typesafe:filter>
```

## See also

- [Ask Yes/No](./ask-noul)
- [Evaluate Batch](./evaluate-batch)
