---
title: "[Policy] Apply"
description: Convert TypeSafe decision answers into an ACCEPT, REVIEW, or REJECT action.
---

# [Policy] Apply

Evaluates policy thresholds locally and converts typed answers into an action that a Mule Choice router or error handler can consume.

## Inputs

| Parameter | Required | Default | Description |
| --- | :---: | --- | --- |
| Decision | Yes | — | Evaluate-style JSON containing an `answers` object. |
| Policy / Question set | Yes | — | Exactly one inline policy object or question-set file containing `policy`. |
| Raise on review | No | `false` | Raise `TYPESAFE:BELOW_THRESHOLD` for a `REVIEW` result. |
| Raise on reject | No | `false` | Raise `TYPESAFE:REJECTED` for a `REJECT` result. |

Incoming message attributes are explicit null metadata and are not read.

## Output

The payload is `{ action, routeKey, reasons, perQuestion }`. The action is the most cautious result across all questions: `REJECT` wins over `REVIEW`, which wins over `ACCEPT`. Output attributes are null.

Policies can test:

- Choice probability, confidence, margin, and no-match behavior
- Noul accept and reject thresholds
- Score accepted and review levels plus confidence

The examples below use `support-ticket-triage.json` with:

```json
"policy": {
  "team": { "minProbability": 0.7, "minMargin": 0.15, "onNoMatch": "REVIEW" },
  "urgent": { "acceptAbove": 0.7, "rejectBelow": 0.3 }
}
```

### ACCEPT

Decision answers clear both thresholds (billing 0.89, urgent 0.98):

```json
{
  "action": "ACCEPT",
  "routeKey": "billing",
  "reasons": [],
  "perQuestion": {
    "team": { "action": "ACCEPT" },
    "urgent": { "action": "ACCEPT" }
  }
}
```

### REVIEW

Decision answers fall below thresholds (billing 0.55, urgent 0.55):

```json
{
  "action": "REVIEW",
  "routeKey": "billing",
  "reasons": [
    "team: probability 0.55 < 0.7",
    "urgent: noul 0.55 < 0.7"
  ],
  "perQuestion": {
    "team": {
      "action": "REVIEW",
      "reasons": ["team: probability 0.55 < 0.7"]
    },
    "urgent": {
      "action": "REVIEW",
      "reasons": ["urgent: noul 0.55 < 0.7"]
    }
  }
}
```

`routeKey` is still the Choice answer (`billing`) so a router can branch on the selected team even when the overall action is `REVIEW`.

## Provider call

None. The operation is deterministic and runs entirely inside Mule. It does not read the connection or API version.

## XML example

```xml
<typesafe:apply-policy
    config-ref="TypeSafe_Config"
    questionSet="support-ticket-triage.json"
    target="policyResult">
    <typesafe:decision>#[payload]</typesafe:decision>
</typesafe:apply-policy>

<choice>
    <when expression="#[vars.policyResult.action == 'ACCEPT']">
        <!-- continue automatically -->
    </when>
    <when expression="#[vars.policyResult.action == 'REVIEW']">
        <!-- send to a human -->
    </when>
    <otherwise>
        <!-- reject -->
    </otherwise>
</choice>
```

The question-set file must declare a `policy` block.

## See also

- [Evaluate](./evaluate)
- [Validate Question Set](./validate-question-set)
- [Set Up](../set-up)
