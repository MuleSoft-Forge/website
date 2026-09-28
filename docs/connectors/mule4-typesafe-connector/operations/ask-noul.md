---
title: "[Decide] Ask Yes/No"
description: Ask one TypeSafe Noul question and return the probability of yes.
---

# [Decide] Ask Yes/No

Asks one Noul question about a JSON state. Use it when a flow needs a probabilistic yes/no decision without defining a complete question set. Call the operation once per connection when you want to compare routes side by side.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON state to evaluate. |
| Instructions | Yes | The yes/no question. |
| Criteria true | No | Guidance describing evidence for “yes.” |
| Criteria false | No | Guidance describing evidence for “no.” |
| Request options | No | Model override, raw response, cache use, and trace step. |

Incoming message attributes are explicit null metadata and are not read.

## Output

The payload is a single Noul answer. `noul` is the probability of “yes,” from `0` to `1`. Output attributes contain the shared decision metadata. Because this is a shortcut (not a file-backed question set), `questionSetId` and `questionSetVersion` are null.

The examples below use the [Set Up](../set-up#first-flow) ticket `T-1001` (production checkout outage) with the website XML instructions.

### TypeSafe

Payload:

```json
{
  "type": "noul",
  "noul": 0.98
}
```

Attributes:

```json
{
  "provider": "typesafe",
  "requestedModel": "jev-latest",
  "model": "jev-1.13.0",
  "usage": {
    "inputTokens": 348,
    "outputTokens": 20
  },
  "estimatedCostUsd": 0.000014616,
  "costSource": "ESTIMATE",
  "latencyMs": 299,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "req_01a0e7e414187e9f8e35f9704a84b1d1",
  "traceEntry": {
    "provider": "typesafe",
    "step": "urgency",
    "model": "jev-1.13.0",
    "questionSetId": null,
    "latencyMs": 299,
    "attempts": 1,
    "estimatedCostUsd": 0.000014616,
    "failedOverFrom": []
  }
}
```

### OpenRouter

Payload:

```json
{
  "type": "noul",
  "noul": 0.98
}
```

Attributes:

```json
{
  "provider": "openrouter",
  "requestedModel": "~typesafe/jev-latest",
  "model": "typesafe/jev-1.13-20260917",
  "usage": {
    "inputTokens": 348,
    "outputTokens": 20
  },
  "estimatedCostUsd": 0.000014616,
  "costSource": "PROVIDER",
  "latencyMs": 307,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "gen-dec-1790596879-8nIcpCIkHH8Wxl4gjMyw",
  "traceEntry": {
    "provider": "openrouter",
    "step": "urgency",
    "model": "typesafe/jev-1.13-20260917",
    "questionSetId": null,
    "latencyMs": 307,
    "attempts": 1,
    "estimatedCostUsd": 0.000014616,
    "failedOverFrom": []
  }
}
```

Route on the result with an explicit threshold, for example `payload.noul >= 0.7`.

## HTTP call

`POST /{apiVersion}/systemone`

The connector builds one inline question named `result` and sends one decision request. The API version comes from the connection configuration and defaults to `v1`. Cloudflare uses its Workers AI path instead.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:ask-noul
    config-ref="TypeSafe_Config"
    instructions="Does this ticket need a fast response?"
    criteriaTrue="An outage, deadline, or loss is described."
    criteriaFalse="This is a routine request."
    step="urgency">
    <typesafe:state>#[payload]</typesafe:state>
</typesafe:ask-noul>
```

## See also

- [Evaluate](./evaluate)
- [Choose](./choose)
- [Set Up](../set-up)
