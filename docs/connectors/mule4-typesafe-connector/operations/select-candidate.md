---
title: "[Select] Candidate"
description: Select and rank the best runtime candidate with a TypeSafe Choice decision.
---

# [Select] Candidate

Turns runtime rows—such as database records, queues, products, or search results—into Choice options and returns the best matching original row.

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

The operation accepts at most 254 candidates. IDs must be nonempty and unique.

## Output

```json
{
  "selected": {
    "id": "billing-queue",
    "name": "Billing"
  },
  "id": "billing-queue",
  "probability": 0.77,
  "confidence": 0.84,
  "isNoMatch": false,
  "ranking": [
    { "id": "billing-queue", "probability": 0.77 },
    { "id": "technical-queue", "probability": 0.18 }
  ]
}
```

Output attributes contain the shared decision metadata.

## Provider call

The candidates become one Choice question. The connector makes one decision request: `POST /v1/systemone` in the current snapshot, or the equivalent Cloudflare route.

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

The `selected` value is the original candidate object, so downstream components do not need to look it up again.
