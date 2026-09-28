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

The operation does not use incoming message attributes.

## Output

```json
{
  "action": "REVIEW",
  "routeKey": "billing",
  "reasons": [
    "team probability is below 0.70"
  ],
  "perQuestion": {
    "team": {
      "action": "REVIEW",
      "reasons": ["probability is below threshold"]
    }
  }
}
```

The action is the most cautious result across all questions: `REJECT` wins over `REVIEW`, which wins over `ACCEPT`. Output attributes are null.

Policies can test:

- Choice probability, confidence, margin, and no-match behavior
- Noul accept and reject thresholds
- Score accepted and review levels plus confidence

## Provider call

None. The operation is deterministic and runs entirely inside Mule.

## XML example

```xml
<typesafe:apply-policy
    config-ref="TypeSafe_Config"
    questionSet="ticket-triage.json"
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

## See also

- [Evaluate](./evaluate)
- [Validate Question Set](./validate-question-set)
