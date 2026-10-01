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

The payload is a JSON object with `valid`, `errors`, and `warnings`. Output attributes are null. `valid` is `true` only when `errors` is empty; warnings alone do not fail validation.

### Happy path — Set Up sample

Validating the [Set Up](../set-up#add-a-reusable-question-set) file `support-ticket-triage.json`:

```json
{
  "valid": true,
  "errors": [],
  "warnings": []
}
```

### Errors and warnings together

A deliberately broken file can return both arrays. Example payload from `support-ticket-triage-error.json`:

```json
{
  "valid": false,
  "errors": [
    "broken: type must be one of noul, choice, score",
    "broken: instructions are required",
    "broken: 'options' is not a TypeSafe question field; put it under 'criteria'"
  ],
  "warnings": [
    "team: choice has no no-match option; consider adding one",
    "team: option 'technical' has an empty description",
    "team: duplicate option description 'Payments'",
    "sentiment: score has fewer than 3 levels"
  ]
}
```

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

### Policy block

Since 1.0.2, when **Question set** names a file with a `policy` block, the policy is checked against the file's questions. Its messages are prefixed `policy.<id>`. [Apply Policy](./apply-policy#policy-validation) raises the same errors before it evaluates.

Errors include:

- A rule for a question id that does not exist
- An unknown key, or a key for a different question type
- A threshold that is not a number from 0 to 1
- An `onNoMatch` other than `ACCEPT`, `REVIEW`, or `REJECT`
- `rejectBelow` greater than `acceptAbove`
- A Score level out of range or in both lists, or a Score rule with no levels listed

Warnings include:

- A yes/no rule with `rejectBelow`, which turns a clear "no" into `REJECT` for the whole decision
- Score levels that are neither accepted nor reviewed, which also reject the decision
- `onNoMatch` on a Choice that declares no `noMatchOption`

Inline **Questions** carry no policy, so only the questions are checked.

## Provider call

None. The operation does not read the connection or API version.

See the limits in the [TypeSafe API documentation](https://docs.typesafe.ai/api).

## XML examples

Validate a classpath file:

```xml
<typesafe:validate-question-set
    config-ref="TypeSafe_Config"
    questionSet="support-ticket-triage.json" />
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
