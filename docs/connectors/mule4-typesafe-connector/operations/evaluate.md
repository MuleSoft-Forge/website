---
title: "[Decide] Evaluate"
description: Evaluate a complete TypeSafe question set against one JSON state.
---

# [Decide] Evaluate

Evaluates one JSON state against a complete set of named Noul, Choice, and Score questions. Call the operation once per connection when you want to compare routes side by side.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON document describing the item or situation being evaluated. |
| Questions | Conditional | Inline JSON object keyed by question ID. |
| Question set | Conditional | File name under the configured classpath question-set folder. |
| Question set ID / version | No | Audit identifiers used when questions are inline. |
| Request options | No | Model override, raw response, cache use, and trace step. |

Supply exactly one of **Questions** or **Question set**. Incoming message attributes are explicit null metadata and are not read.

## Output

The JSON payload contains the selected model and one typed answer per question. Output attributes provide provider, token usage, cost, latency, attempts, failover, cache, request ID, and audit-trace metadata.

The examples below use the [Set Up](../set-up#first-flow) ticket `T-1001` (production checkout outage) and question set `support-ticket-triage.json`.

### TypeSafe

Payload:

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "team": {
      "type": "choice",
      "choice": "billing",
      "confidence": 0.83,
      "probabilities": {
        "technical": 0.11,
        "other": 0,
        "billing": 0.89
      },
      "derived": {
        "margin": 0.78,
        "runnerUp": "technical",
        "isNoMatch": false
      }
    },
    "urgent": {
      "type": "noul",
      "noul": 0.98
    }
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
    "inputTokens": 433,
    "outputTokens": 55
  },
  "estimatedCostUsd": 0.000018186,
  "costSource": "ESTIMATE",
  "latencyMs": 287,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": "support-ticket-triage",
  "questionSetVersion": "1.0.0",
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "req_01a0e7e17628712da124ea8c579d60a6",
  "traceEntry": {
    "provider": "typesafe",
    "step": "triage",
    "model": "jev-1.13.0",
    "questionSetId": "support-ticket-triage",
    "latencyMs": 287,
    "attempts": 1,
    "estimatedCostUsd": 0.000018186,
    "failedOverFrom": []
  }
}
```

TypeSafe does not return a provider-priced cost on this route, so `costSource` is `ESTIMATE`. The connection model `jev-latest` resolves to the concrete model in `payload.model` / `attributes.model`.

### OpenRouter

Payload:

```json
{
  "model": "typesafe/jev-1.13-20260917",
  "answers": {
    "team": {
      "type": "choice",
      "choice": "billing",
      "probabilities": {
        "billing": 0.87,
        "technical": 0.13,
        "other": 0
      },
      "confidence": 0.81,
      "derived": {
        "margin": 0.74,
        "runnerUp": "technical",
        "isNoMatch": false
      }
    },
    "urgent": {
      "type": "noul",
      "noul": 0.98
    }
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
    "inputTokens": 433,
    "outputTokens": 55
  },
  "estimatedCostUsd": 0.000018186,
  "costSource": "PROVIDER",
  "latencyMs": 289,
  "attempts": 1,
  "failedOverFrom": [],
  "cacheHit": false,
  "questionSetId": "support-ticket-triage",
  "questionSetVersion": "1.0.0",
  "stateHash": "bb4467d35c0ccfdfb0195925daf3eeef03f6128c209ad7f0c7a279853d10cc67",
  "providerRequestId": "gen-dec-1790596707-27hVNnZ8FKJQqWpTvRfG",
  "traceEntry": {
    "provider": "openrouter",
    "step": "triage",
    "model": "typesafe/jev-1.13-20260917",
    "questionSetId": "support-ticket-triage",
    "latencyMs": 289,
    "attempts": 1,
    "estimatedCostUsd": 0.000018186,
    "failedOverFrom": []
  }
}
```

OpenRouter reports provider cost (`costSource`: `PROVIDER`) and a generation id in `providerRequestId`. Answer shapes match TypeSafe; concrete model ids use OpenRouter's `typesafe/…` namespace.

## HTTP call

`POST /{apiVersion}/systemone`

The API version comes from the connection configuration and defaults to `v1`. Cloudflare uses its Workers AI path instead. The mock route stays in-process.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:evaluate
    config-ref="TypeSafe_Config"
    questionSet="support-ticket-triage.json"
    step="triage">
    <typesafe:state>#[payload]</typesafe:state>
</typesafe:evaluate>
```

File-backed question sets drive answer-specific DataSense, for example `payload.answers.team.choice`.

## See also

- [Validate Question Set](./validate-question-set)
- [Evaluate Batch](./evaluate-batch)
- [Apply Policy](./apply-policy)
- [Set Up](../set-up)
