---
title: "[Decide] Score"
description: Grade JSON state against an ordered TypeSafe Score rubric.
---

# [Decide] Score

Grades one state against ordered rubric levels. Use it for sentiment, severity, quality, priority, or any decision where order matters.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON state to grade. |
| Instructions | Yes | The scoring question. |
| Levels | Yes | Ordered list of 2 to 10 level descriptions. |
| Request options | No | Model override, raw response, cache use, and trace step. |

## Output

```json
{
  "type": "score",
  "score": 1.2,
  "legend": ["very negative", "negative", "neutral", "positive", "very positive"],
  "probabilities": {
    "0": 0.12,
    "1": 0.58,
    "2": 0.20,
    "3": 0.07,
    "4": 0.03
  },
  "confidence": 0.74,
  "derived": {
    "level": 1,
    "levelLabel": "negative"
  }
}
```

Output attributes contain the shared decision metadata.

## Provider call

One decision request: `POST /v1/systemone` in the current snapshot, or the equivalent Cloudflare route.

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
