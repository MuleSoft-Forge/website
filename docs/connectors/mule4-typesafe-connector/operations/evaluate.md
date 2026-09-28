---
title: "[Decide] Evaluate"
description: Evaluate a complete TypeSafe question set against one JSON state.
---

# [Decide] Evaluate

Evaluates one JSON state against a complete set of named Noul, Choice, and Score questions.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON document describing the item or situation being evaluated. |
| Questions | Conditional | Inline JSON object keyed by question ID. |
| Question set | Conditional | File name under the configured classpath question-set folder. |
| Question set ID / version | No | Audit identifiers used when questions are inline. |
| Request options | No | Model override, raw response, cache use, and trace step. |

Supply exactly one of **Questions** or **Question set**. Incoming message attributes are not used.

## Output

The JSON payload contains the selected model and one typed answer per question:

```json
{
  "model": "jev-latest",
  "answers": {
    "urgent": { "type": "noul", "noul": 0.82 },
    "team": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.72, "technical": 0.18, "other": 0.10 },
      "confidence": 0.81,
      "derived": { "margin": 0.54, "runnerUp": "technical", "isNoMatch": false }
    }
  }
}
```

Output attributes provide provider, token usage, cost, latency, attempts, failover, cache, request ID, and audit-trace metadata.

## Provider call

One decision request: `POST /v1/systemone` in the current snapshot, or the equivalent Cloudflare route. The mock route stays in-process.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:evaluate
    config-ref="TypeSafe_Config"
    questionSet="ticket-triage.json"
    step="triage">
    <typesafe:state>#[payload]</typesafe:state>
</typesafe:evaluate>
```

File-backed question sets drive answer-specific DataSense, for example `payload.answers.team.choice`.

## See also

- [Validate Question Set](./validate-question-set)
- [Evaluate Batch](./evaluate-batch)
- [Apply Policy](./apply-policy)
