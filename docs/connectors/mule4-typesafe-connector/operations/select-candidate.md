---
title: "[Select] Candidate"
description: Select and rank the best runtime candidate with a TypeSafe Choice decision.
---

# [Select] Candidate

Turns runtime rows—such as database records, queues, products, or search results—into Choice options and returns the best matching original row. Call the operation once per connection when you want to compare routes side by side.

## Inputs

| Parameter | Required | Default | Description |
| --- | :---: | --- | --- |
| Candidates | Yes | — | JSON array of candidate objects. |
| Query | Yes | — | JSON document describing the request or desired match. |
| ID field | Yes | — | Candidate field containing a stable, unique ID. |
| Label field | Yes | — | Candidate field containing the display label. |
| Description field | No | — | Candidate field containing additional matching context. |
| Instructions | No | Best-match question | Choice instructions sent to the model. |
| Include no match | No | `true` | Allow the model to reject all candidates. |
| Request options | No | — | Model override, raw response, cache use, and trace step. |

The operation accepts at most 254 candidates. IDs must be nonempty and unique. Incoming message attributes are explicit null metadata and are not read.

## Output

The payload names the selected original candidate object, its id, probability, confidence, whether it was a no-match, and a full ranking. When **Include no match** is enabled (the default), ranking also includes the synthetic `__no_match__` option. Output attributes contain the shared decision metadata. Because this is a shortcut, `questionSetId` and `questionSetVersion` are null.

The examples below use three support queues and the query `I was billed twice for my subscription and need a refund.`

### TypeSafe

Payload:

```json
{
  "selected": {
    "id": "billing-queue",
    "name": "Billing",
    "description": "Payments, invoices, refunds and subscription changes."
  },
  "id": "billing-queue",
  "probability": 1,
  "confidence": 1,
  "isNoMatch": false,
  "ranking": [
    { "id": "billing-queue", "probability": 1 },
    { "id": "account-queue", "probability": 0 },
    { "id": "technical-queue", "probability": 0 },
    { "id": "__no_match__", "probability": 0 }
  ]
}
```

Attributes:

```json
{
  "provider": "typesafe",
  "requestedModel": "jev-latest",
  "model": "jev-1.13.0",
  "usage": {
    "inputTokens": 403,
    "outputTokens": 60
  },
  "estimatedCostUsd": 0.000016926,
  "costSource": "ESTIMATE",
  "latencyMs": 292,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "b44d77fce6f5e945a80d7fae7ecd0900b5565eee4b13efe40e90d19867b293bd",
  "providerRequestId": "req_01a0e7eefc0f7bbeaa8014b5f4ede7e7",
  "traceEntry": {
    "provider": "typesafe",
    "step": "queue-selection",
    "model": "jev-1.13.0",
    "questionSetId": null,
    "latencyMs": 292,
    "attempts": 1,
    "estimatedCostUsd": 0.000016926,
    "failedOverFrom": []
  }
}
```

### OpenRouter

Payload:

```json
{
  "selected": {
    "id": "billing-queue",
    "name": "Billing",
    "description": "Payments, invoices, refunds and subscription changes."
  },
  "id": "billing-queue",
  "probability": 1,
  "confidence": 1,
  "isNoMatch": false,
  "ranking": [
    { "id": "billing-queue", "probability": 1 },
    { "id": "__no_match__", "probability": 0 },
    { "id": "account-queue", "probability": 0 },
    { "id": "technical-queue", "probability": 0 }
  ]
}
```

Attributes:

```json
{
  "provider": "openrouter",
  "requestedModel": "~typesafe/jev-latest",
  "model": "typesafe/jev-1.13-20260917",
  "usage": {
    "inputTokens": 403,
    "outputTokens": 60
  },
  "estimatedCostUsd": 0.000016926,
  "costSource": "PROVIDER",
  "latencyMs": 279,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "b44d77fce6f5e945a80d7fae7ecd0900b5565eee4b13efe40e90d19867b293bd",
  "providerRequestId": "gen-dec-1790597594-7O3EdTGgHbEL0kHqQo6H",
  "traceEntry": {
    "provider": "openrouter",
    "step": "queue-selection",
    "model": "typesafe/jev-1.13-20260917",
    "questionSetId": null,
    "latencyMs": 279,
    "attempts": 1,
    "estimatedCostUsd": 0.000016926,
    "failedOverFrom": []
  }
}
```

Both routes return the original Billing candidate object in `selected`, so downstream steps do not need a second lookup. Ranking order among zero-probability options can vary.

## HTTP call

`POST /{apiVersion}/systemone`

The candidates become one Choice question named `result`. The API version comes from the connection configuration and defaults to `v1`. Cloudflare uses its Workers AI path instead.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:select-candidate
    config-ref="TypeSafe_Config"
    idField="id"
    labelField="name"
    descriptionField="description"
    step="queue-selection">
    <typesafe:candidates>#[vars.queues]</typesafe:candidates>
    <typesafe:query>#[payload]</typesafe:query>
</typesafe:select-candidate>
```

## See also

- [Choose](./choose)
- [Filter](./filter)
- [Set Up](../set-up)
