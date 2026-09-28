---
title: "[Decide] Evaluate Batch"
description: Evaluate one TypeSafe question set across many JSON states.
---

# [Decide] Evaluate Batch

Applies one question set to many states with bounded concurrency, optional deduplication, cache support, and per-item budget handling. Call the operation once per connection when you want to compare routes side by side.

## Inputs

| Parameter | Required | Default | Description |
| --- | :---: | --- | --- |
| Items | Yes | — | JSON array of states. |
| Questions / Question set | Yes | — | Exactly one inline question object or classpath file. |
| Question set ID / version | No | — | Audit identifiers for inline questions. |
| Key field | No | — | Item field copied into each result's `key`. |
| Max concurrency | No | `4` | Concurrent provider calls, clamped to 1–32. |
| Deduplicate | No | `true` | Evaluate identical states only once. |
| Max items | No | `1000` | Reject a larger input with `TYPESAFE:BATCH_TOO_LARGE`. |
| Fail fast | No | `false` | Stop the batch on the first item failure. |
| Request options | No | — | Shared model, response, cache, and trace settings. |

Incoming message attributes are explicit null metadata and are not read.

## Output

One result is returned for every original item. An item can have status `OK`, `SKIPPED_BUDGET`, or `ERROR`. Batch attributes report `total`, `succeeded`, `failed`, `skippedBudget`, `cached`, token usage, and estimated cost.

`Deduplicate` and `cached` are different: dedupe evaluates identical states once and copies the answers onto every matching item (those items still show `cached: false`). `cached: true` only appears when the decision cache is enabled and hits.

The examples below use `support-ticket-triage.json` with three items: outage ticket `T-1001`, routine password ticket `T-1002`, and a duplicate of `T-1001`.

### TypeSafe

Attributes:

```json
{
  "total": 3,
  "succeeded": 3,
  "failed": 0,
  "skippedBudget": 0,
  "cached": 0,
  "usage": {
    "inputTokens": 873,
    "outputTokens": 110
  },
  "estimatedCostUsd": 0.000036666
}
```

Payload (abridged — full answers on every `OK` item):

```json
[
  {
    "index": 0,
    "key": "T-1001",
    "status": "OK",
    "cached": false,
    "answers": {
      "team": {
        "type": "choice",
        "choice": "billing",
        "confidence": 0.84,
        "probabilities": { "billing": 0.89, "other": 0, "technical": 0.11 },
        "derived": { "margin": 0.78, "runnerUp": "technical", "isNoMatch": false }
      },
      "urgent": { "type": "noul", "noul": 0.98 }
    }
  },
  {
    "index": 1,
    "key": "T-1002",
    "status": "OK",
    "cached": false,
    "answers": {
      "team": {
        "type": "choice",
        "choice": "technical",
        "confidence": 0.36,
        "probabilities": { "technical": 0.57, "billing": 0, "other": 0.43 },
        "derived": { "margin": 0.14, "runnerUp": "other", "isNoMatch": false }
      },
      "urgent": { "type": "noul", "noul": 0.14 }
    }
  },
  {
    "index": 2,
    "key": "T-1001",
    "status": "OK",
    "cached": false,
    "answers": {
      "team": {
        "type": "choice",
        "choice": "billing",
        "confidence": 0.84,
        "probabilities": { "billing": 0.89, "other": 0, "technical": 0.11 },
        "derived": { "margin": 0.78, "runnerUp": "technical", "isNoMatch": false }
      },
      "urgent": { "type": "noul", "noul": 0.98 }
    }
  }
]
```

Token usage (~2× a single Evaluate) shows the duplicate was evaluated once. Index 0 and 2 share the same answers.

### OpenRouter

Same shape and discrete outcomes (`T-1001` → billing/urgent 0.98; `T-1002` → technical/low urgency). Attributes matched TypeSafe on this run (`total` 3, `succeeded` 3, `cached` 0, same usage totals). Probability floats can differ slightly between routes.

## HTTP call

`POST /{apiVersion}/systemone` once per unique, uncached state, up to **Max concurrency** in flight. The API version comes from the connection configuration and defaults to `v1`. A budget limit skips later items (`SKIPPED_BUDGET`) rather than failing the batch.

Use a Mule Batch Job when the input can exceed **Max items**.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:evaluate-batch
    config-ref="TypeSafe_Config"
    questionSet="support-ticket-triage.json"
    keyField="id"
    maxConcurrency="4"
    deduplicate="true"
    maxItems="1000">
    <typesafe:items>#[payload]</typesafe:items>
</typesafe:evaluate-batch>
```

Use an application-specific question-set file name. Connector `1.0.1` ships a bundled `ticket-triage.json` that can shadow an app file with the same path ([issue 15](https://github.com/MuleSoft-Forge/mule4-typesafe-connector/issues/15)).

## See also

- [Evaluate](./evaluate)
- [Filter](./filter)
- [Set Up](../set-up)
