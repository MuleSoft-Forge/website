---
title: "[Util] Validate Question Set"
description: Validate a TypeSafe question set locally before making a billed provider call.
---

# [Util] Validate Question Set

Checks question structure and TypeSafe limits locally so malformed or risky question sets can fail before a billed decision call.

## Inputs

Supply exactly one:

| Parameter | Description |
| --- | --- |
| Questions | JSON object keyed by question ID. |
| Question set | A file from the configured classpath question-set folder. |

The **Question set** selector lists JSON files under `src/main/resources/questions/`. Incoming message attributes are explicit null metadata and are not read.

## Output

```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    "Question 'team' defines more than 20 choice options"
  ]
}
```

Output attributes are null.

## Validation behavior

Errors include:

- Missing or empty questions
- Unknown question types
- Missing instructions
- Missing Choice criteria or more than 255 options
- Fewer than 2 or more than 10 Score levels
- Legacy `options`, `levels`, `legend`, `criteriaTrue`, or `criteriaFalse` fields outside `criteria`

Warnings include:

- Choice with no no-match option
- Empty or duplicate option descriptions
- More than 20 Choice options
- Fewer than 3 Score levels

## Provider call

None. The operation does not read the connection or API version.

See the limits in the [TypeSafe API documentation](https://docs.typesafe.ai/api).

## XML examples

Validate a classpath file:

```xml
<typesafe:validate-question-set
    config-ref="TypeSafe_Config"
    questionSet="ticket-triage.json" />
```

Validate an inline Questions object:

```xml
<typesafe:validate-question-set config-ref="TypeSafe_Config">
    <typesafe:questions>#[payload]</typesafe:questions>
</typesafe:validate-question-set>
```

## See also

- [Set Up a reusable question set](../set-up#add-a-reusable-question-set)
- [Evaluate](./evaluate)
