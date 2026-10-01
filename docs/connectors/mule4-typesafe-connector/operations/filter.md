---
title: "[Select] Filter"
description: Retain JSON items whose TypeSafe Noul probability meets a threshold.
---

# [Select] Filter

Asks one yes/no question about every item and keeps the items whose Noul probability reaches the configured threshold. Call the operation once per connection when you want to compare routes side by side.

## Inputs

| Parameter | Required | Default | Description |
| --- | :---: | --- | --- |
| Items | Yes | — | JSON array to evaluate. |
| Question | Yes | — | Yes/no question asked of each item. |
| Threshold | No | `0.5` | Keep items whose probability of “yes” is at least this. |
| Drop below | No | Same as Threshold | Drop items below this. Set lower than Threshold to leave a middle **uncertain** band. |
| Chunk size | No | `20` | Items packed into one provider call, clamped to 1–100. |
| Text field | No | Entire item | Field placed in `state.items[i]` instead of the full item. |
| Max concurrency | No | `4` | Concurrent chunks, clamped to 1–32. |
| Request options | No | — | Shared model, response, cache, and trace settings. |

Incoming message attributes are explicit null metadata and are not read.

Items are packed in `state.items`; each Noul only references `items[i]` (TypeSafe’s packing pattern). Item text is not concatenated into the instructions.

## Output

The payload partitions the original items into `kept`, `dropped`, and `uncertain`, and lists a `scores` row per input index (`index`, `noul`, `band`, `kept`). Batch attributes report `total` (input size), `succeeded` (**kept count** on this operation), `failed`, `skippedBudget`, `cached`, token usage, and estimated cost.

The examples below use two tickets — an outage (`T-1001`) and a routine password request (`T-1002`) — with `question="Is this ticket urgent?"`, `threshold=0.7`, and `textField="body"`.

### TypeSafe

Payload:

```json
{
  "kept": [
    {
      "id": "T-1001",
      "subject": "Production checkout outage",
      "body": "Customers cannot pay and revenue is being lost. Please respond immediately."
    }
  ],
  "dropped": [
    {
      "id": "T-1002",
      "subject": "How do I change my password?",
      "body": "I forgot my password and would like a reset link when you have a moment."
    }
  ],
  "uncertain": [],
  "scores": [
    { "index": 0, "noul": 0.88, "band": "kept", "kept": true },
    { "index": 1, "noul": 0.21, "band": "dropped", "kept": false }
  ]
}
```

Attributes:

```json
{
  "total": 2,
  "succeeded": 1,
  "failed": 0,
  "skippedBudget": 0,
  "cached": 0,
  "usage": {
    "inputTokens": 318,
    "outputTokens": 38
  },
  "estimatedCostUsd": 0.000013356
}
```

### OpenRouter

Payload:

```json
{
  "kept": [
    {
      "id": "T-1001",
      "subject": "Production checkout outage",
      "body": "Customers cannot pay and revenue is being lost. Please respond immediately."
    }
  ],
  "dropped": [
    {
      "id": "T-1002",
      "subject": "How do I change my password?",
      "body": "I forgot my password and would like a reset link when you have a moment."
    }
  ],
  "uncertain": [],
  "scores": [
    { "index": 0, "noul": 0.9, "band": "kept", "kept": true },
    { "index": 1, "noul": 0.21, "band": "dropped", "kept": false }
  ]
}
```

Attributes matched TypeSafe on this run (`total` 2, `succeeded` 1, same usage). Noul floats can differ slightly between routes; the keep/drop decision agreed.

## HTTP call

`POST /{apiVersion}/systemone` once per chunk (up to **Chunk size** items per call, **Max concurrency** chunks in flight). The API version comes from the connection configuration and defaults to `v1`. Any chunk failure fails the operation. A budget refusal during filtering raises `TYPESAFE:BUDGET_EXCEEDED`.

See the [TypeSafe API](https://docs.typesafe.ai/api).

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
- [Set Up](../set-up)
