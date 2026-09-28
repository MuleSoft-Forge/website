---
title: "[Decide] Choose"
description: Classify JSON state into one of a fixed set of TypeSafe Choice options.
---

# [Decide] Choose

Classifies one state into a fixed set of options and returns the selected option, its distribution, and derived confidence signals. Call the operation once per connection when you want to compare routes side by side.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON state to classify. |
| Instructions | Yes | The classification question. |
| Options | Yes | Map of stable option IDs to descriptions. |
| No-match option | No | Option ID used when none of the options applies. |
| Request options | No | Model override, raw response, cache use, and trace step. |

A Choice supports up to 255 options. If the no-match key is absent from **Options**, the connector adds it with a default description. Incoming message attributes are explicit null metadata and are not read.

## Output

The payload is a single Choice answer. Output attributes contain the shared decision metadata. Because this is a shortcut (not a file-backed question set), `questionSetId` and `questionSetVersion` are null.

The examples below use the [Set Up](../set-up#first-flow) ticket `T-1001` (production checkout outage) with the website XML options.

### TypeSafe

Payload:

```json
{
  "type": "choice",
  "choice": "billing",
  "confidence": 0.7,
  "probabilities": {
    "other": 0,
    "billing": 0.8,
    "technical": 0.2
  },
  "derived": {
    "margin": 0.6,
    "runnerUp": "technical",
    "isNoMatch": false
  }
}
```

Attributes:

```json
{
  "provider": "typesafe",
  "requestedModel": "jev-latest",
  "model": "jev-1.13.0",
  "usage": {
    "inputTokens": 377,
    "outputTokens": 38
  },
  "estimatedCostUsd": 0.000015834,
  "costSource": "ESTIMATE",
  "latencyMs": 244,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "req_01a0e7e6343c7dacb14a9f87fb33eb58",
  "traceEntry": {
    "provider": "typesafe",
    "step": "routing",
    "model": "jev-1.13.0",
    "questionSetId": null,
    "latencyMs": 244,
    "attempts": 1,
    "estimatedCostUsd": 0.000015834,
    "failedOverFrom": []
  }
}
```

### OpenRouter

Payload:

```json
{
  "type": "choice",
  "choice": "billing",
  "probabilities": {
    "technical": 0.14,
    "billing": 0.86,
    "other": 0
  },
  "confidence": 0.79,
  "derived": {
    "margin": 0.72,
    "runnerUp": "technical",
    "isNoMatch": false
  }
}
```

Attributes:

```json
{
  "provider": "openrouter",
  "requestedModel": "~typesafe/jev-latest",
  "model": "typesafe/jev-1.13-20260917",
  "usage": {
    "inputTokens": 377,
    "outputTokens": 38
  },
  "estimatedCostUsd": 0.000015834,
  "costSource": "PROVIDER",
  "latencyMs": 297,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "gen-dec-1790597018-7tMEcOiPF2lJWWCR2Q5u",
  "traceEntry": {
    "provider": "openrouter",
    "step": "routing",
    "model": "typesafe/jev-1.13-20260917",
    "questionSetId": null,
    "latencyMs": 297,
    "attempts": 1,
    "estimatedCostUsd": 0.000015834,
    "failedOverFrom": []
  }
}
```

Both routes selected `billing` with `technical` as runner-up, matching [Evaluate](./evaluate) on the same ticket.

## HTTP call

`POST /{apiVersion}/systemone`

The connector builds one inline Choice question named `result` and sends one decision request. The API version comes from the connection configuration and defaults to `v1`. Cloudflare uses its Workers AI path instead.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:choose
    config-ref="TypeSafe_Config"
    instructions="Which team should own this ticket?"
    noMatchOption="other"
    step="routing">
    <typesafe:state>#[payload]</typesafe:state>
    <typesafe:choose-options>
        <typesafe:choose-option key="billing" value="Payments, invoices, and refunds." />
        <typesafe:choose-option key="technical" value="Product and API problems." />
        <typesafe:choose-option key="other" value="None of the listed teams applies." />
    </typesafe:choose-options>
</typesafe:choose>
```

## See also

- [Evaluate](./evaluate)
- [Ask Yes/No](./ask-noul)
- [Score](./score)
- [Set Up](../set-up)
