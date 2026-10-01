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

### Fails closed

Since 1.0.2, a policy that has nothing to judge returns `REVIEW`, never `ACCEPT`:

| Situation | Reason in the payload |
| --- | --- |
| The decision has no answers, for example `{}` or the wrong variable | `decision has no answers to judge` |
| A policy rule's question has no answer | `urgent: no answer to judge` |
| A rule's keys do not fit the answer's type | `team: rule does not fit a 'choice' answer` |

The second case catches a common mistake. A shortcut operation (`ask-noul`, `choose`, `score`) returns a single answer, which is judged as the question `result`. A question-set policy keyed by real question ids therefore finds no answer to judge.

## Policy validation

The policy is checked before it is applied, and an invalid policy raises `TYPESAFE:INVALID_QUESTION_SET` listing every problem. A policy from a question-set file is checked against that file's questions. An inline policy is checked for structure only.

- A rule for a question id that does not exist
- An unknown or misspelt key, such as `minProbabilty`
- A key for a different question type, such as `acceptAbove` on a Choice
- A threshold that is not a number from 0 to 1
- An `onNoMatch` other than `ACCEPT`, `REVIEW`, or `REJECT`
- `rejectBelow` greater than `acceptAbove`
- A Score level out of range, not a number, or in both `acceptLevels` and `reviewLevels`
- A Score rule with neither `acceptLevels` nor `reviewLevels`, which would reject every answer

Run [Validate Question Set](./validate-question-set) on the file to see the same errors, plus warnings, before deploying.

## Errors

| Error | When |
| --- | --- |
| `TYPESAFE:INVALID_QUESTION_SET` | The decision or policy is not JSON, both or neither of Policy and Question set are given, the file has no `policy` block, or the policy fails validation. |
| `TYPESAFE:BELOW_THRESHOLD` | Raise on review is `true` and the action is `REVIEW`. |
| `TYPESAFE:REJECTED` | Raise on reject is `true` and the action is `REJECT`. |

Before 1.0.2 these errors were not declared on the operation, so Mule raised `MULE:UNKNOWN` in their place.

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
