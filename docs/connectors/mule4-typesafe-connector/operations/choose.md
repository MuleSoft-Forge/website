---
title: "[Decide] Choose"
description: Classify JSON state into one of a fixed set of TypeSafe Choice options.
---

# [Decide] Choose

Classifies one state into a fixed set of options and returns the selected option, its distribution, and derived confidence signals.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON state to classify. |
| Instructions | Yes | The classification question. |
| Options | Yes | Map of stable option IDs to descriptions. |
| No-match option | No | Option ID used when none of the options applies. |
| Request options | No | Model override, raw response, cache use, and trace step. |

A Choice supports up to 255 options. If the no-match key is absent from **Options**, the connector adds it with a default description.

## Output

```json
{
  "type": "choice",
  "choice": "billing",
  "probabilities": {
    "billing": 0.72,
    "technical": 0.18,
    "other": 0.10
  },
  "confidence": 0.81,
  "derived": {
    "margin": 0.54,
    "runnerUp": "technical",
    "isNoMatch": false
  }
}
```

Output attributes contain the shared decision metadata.

## Provider call

One decision request: `POST /v1/systemone` in the current snapshot, or the equivalent Cloudflare route.

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
