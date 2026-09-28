---
title: "[Decide] Ask Yes/No"
description: Ask one TypeSafe Noul question and return the probability of yes.
---

# [Decide] Ask Yes/No

Asks one Noul question about a JSON state. Use it when a flow needs a probabilistic yes/no decision without defining a complete question set.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON state to evaluate. |
| Instructions | Yes | The yes/no question. |
| Criteria true | No | Guidance describing evidence for “yes.” |
| Criteria false | No | Guidance describing evidence for “no.” |
| Request options | No | Model override, raw response, cache use, and trace step. |

Incoming message attributes are not used.

## Output

```json
{
  "type": "noul",
  "noul": 0.82
}
```

`noul` is the probability of “yes,” from `0` to `1`. Output attributes contain the shared decision metadata.

## Provider call

The connector creates one question named `result` and makes one decision request: `POST /v1/systemone` in the current snapshot, or the equivalent Cloudflare route.

See the [TypeSafe API](https://docs.typesafe.ai/api).

## XML example

```xml
<typesafe:ask-noul
    config-ref="TypeSafe_Config"
    instructions="Does this ticket need a fast response?"
    criteriaTrue="An outage, deadline, or loss is described."
    criteriaFalse="This is a routine request."
    step="urgency">
    <typesafe:state>#[payload]</typesafe:state>
</typesafe:ask-noul>
```

Route on the result with an explicit threshold, for example `payload.noul >= 0.7`.
