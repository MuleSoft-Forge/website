---
title: "[Decide] Score"
description: Grade JSON state against an ordered TypeSafe Score rubric.
---

# [Decide] Score

Grades one state against ordered rubric levels. Use it for sentiment, severity, quality, priority, or any decision where order matters. Call the operation once per connection when you want to compare routes side by side.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON state to grade. |
| Instructions | Yes | The scoring question. |
| Levels | Yes | Ordered list of 2 to 10 level descriptions. |
| Request options | No | Model override, raw response, cache use, and trace step. |

Incoming message attributes are explicit null metadata and are not read.

## Output

The payload is a single Score answer. `legend` maps level index strings to the labels you supplied. `derived.level` is the most probable level index; `derived.levelLabel` is that label. Output attributes contain the shared decision metadata. Because this is a shortcut, `questionSetId` and `questionSetVersion` are null.

The examples below use the [Set Up](../set-up#first-flow) ticket `T-1001` (production checkout outage) with the website sentiment levels.

### TypeSafe

Payload:

```json
{
  "type": "score",
  "score": 0.22,
  "confidence": 0.82,
  "legend": {
    "0": "very negative",
    "1": "negative",
    "2": "neutral",
    "3": "positive",
    "4": "very positive"
  },
  "probabilities": {
    "0": 0.79,
    "1": 0.21,
    "2": 0,
    "3": 0,
    "4": 0
  },
  "derived": {
    "level": 0,
    "levelLabel": "very negative"
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
    "inputTokens": 354,
    "outputTokens": 17
  },
  "estimatedCostUsd": 0.000014868,
  "costSource": "ESTIMATE",
  "latencyMs": 288,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "req_01a0e7e9c5b978deb291b7265f762138",
  "traceEntry": {
    "provider": "typesafe",
    "step": "sentiment",
    "model": "jev-1.13.0",
    "questionSetId": null,
    "latencyMs": 288,
    "attempts": 1,
    "estimatedCostUsd": 0.000014868,
    "failedOverFrom": []
  }
}
```

### OpenRouter

Payload:

```json
{
  "type": "score",
  "score": 0.25,
  "legend": {
    "0": "very negative",
    "1": "negative",
    "2": "neutral",
    "3": "positive",
    "4": "very positive"
  },
  "probabilities": {
    "0": 0.75,
    "1": 0.25,
    "2": 0,
    "3": 0,
    "4": 0
  },
  "confidence": 0.79,
  "derived": {
    "level": 0,
    "levelLabel": "very negative"
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
    "inputTokens": 354,
    "outputTokens": 17
  },
  "estimatedCostUsd": 0.000014868,
  "costSource": "PROVIDER",
  "latencyMs": 324,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": null,
  "questionSetVersion": null,
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "gen-dec-1790597252-IIOAJXQeRjV9KyGlRTLa",
  "traceEntry": {
    "provider": "openrouter",
    "step": "sentiment",
    "model": "typesafe/jev-1.13-20260917",
    "questionSetId": null,
    "latencyMs": 324,
    "attempts": 1,
    "estimatedCostUsd": 0.000014868,
    "failedOverFrom": []
  }
}
```

Both routes grade the outage ticket as **very negative** (`level` 0).

## HTTP call

`POST /{apiVersion}/systemone`

The connector builds one inline Score question named `result` and sends one decision request. The API version comes from the connection configuration and defaults to `v1`. Cloudflare uses its Workers AI path instead.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:score
    config-ref="TypeSafe_Config"
    instructions="How positive is the customer's tone?"
    step="sentiment">
    <typesafe:state>#[payload]</typesafe:state>
    <typesafe:levels>
        <typesafe:level value="very negative" />
        <typesafe:level value="negative" />
        <typesafe:level value="neutral" />
        <typesafe:level value="positive" />
        <typesafe:level value="very positive" />
    </typesafe:levels>
</typesafe:score>
```

## See also

- [Evaluate](./evaluate)
- [Choose](./choose)
- [Ask Yes/No](./ask-noul)
- [Set Up](../set-up)
