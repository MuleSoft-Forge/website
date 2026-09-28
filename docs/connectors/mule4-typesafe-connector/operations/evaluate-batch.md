---
title: "[Decide] Evaluate Batch"
description: Evaluate one TypeSafe question set across many JSON states.
---

# [Decide] Evaluate Batch

Applies one question set to many states with bounded concurrency, optional deduplication, cache support, and per-item budget handling.

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

## Output

One result is returned for every original item:

```json
[
  {
    "index": 0,
    "key": "T-1001",
    "status": "OK",
    "cached": false,
    "answers": {
      "urgent": { "type": "noul", "noul": 0.82 }
    }
  },
  {
    "index": 1,
    "key": "T-1002",
    "status": "SKIPPED_BUDGET"
  }
]
```

An item can have status `OK`, `SKIPPED_BUDGET`, or `ERROR`. Batch attributes report total, succeeded, failed, skipped, cached, token usage, and estimated cost.

## Provider calls

The operation makes one decision call per unique, uncached state, up to **Max concurrency** calls in flight. A budget limit skips later items rather than failing the entire batch.

Use a Mule Batch Job when the input can exceed **Max items**.

## XML example

```xml
<typesafe:evaluate-batch
    config-ref="TypeSafe_Config"
    questionSet="ticket-triage.json"
    keyField="id"
    maxConcurrency="4"
    deduplicate="true"
    maxItems="1000">
    <typesafe:items>#[payload]</typesafe:items>
</typesafe:evaluate-batch>
```

## See also

- [Evaluate](./evaluate)
- [Filter](./filter)
