---
title: "[Util] Connection Get Capabilities"
description: Report capabilities for the primary TypeSafe route and its fallbacks.
---

# [Util] Connection Get Capabilities

Reports the static decision capabilities of the primary route and every configured fallback. Call the operation once per connection when you want to see what that route (and its fallbacks) can do before a billed call.

## Inputs

The operation requires a connector configuration and connection. It sends no request body, so the input payload and input attributes are explicit null metadata.

## Output

The payload is a JSON array with one object per route on the connection. Output attributes carry `count`, the number of reported routes.

### TypeSafe

Payload:

```json
[
  {
    "route": "typesafe",
    "primary": true,
    "capabilities": {
      "supportsNoul": true,
      "supportsChoice": true,
      "supportsScore": true,
      "returnsConfidence": true,
      "supportsModelList": true,
      "supportsStructuredInstructions": true,
      "maxChoiceOptions": 255,
      "maxScoreLevels": 10
    }
  }
]
```

Attributes:

```json
{
  "count": 1
}
```

### OpenRouter

OpenRouter reports the same full decision contract as a direct TypeSafe route. The `route` field identifies the connection; capability flags do not change.

Payload:

```json
[
  {
    "route": "openrouter",
    "primary": true,
    "capabilities": {
      "supportsNoul": true,
      "supportsChoice": true,
      "supportsScore": true,
      "returnsConfidence": true,
      "supportsModelList": true,
      "supportsStructuredInstructions": true,
      "maxChoiceOptions": 255,
      "maxScoreLevels": 10
    }
  }
]
```

Attributes:

```json
{
  "count": 1
}
```

With no fallbacks configured, each connection returns one entry and `count` is `1`. When fallbacks are configured, the array includes every route and `primary` is `true` only for the first.

## Provider call

None. Capabilities are derived locally from the configured route types. They are not fetched from the vendor.

Cloudflare and the mock route set `supportsModelList` to `false`. A compatible gateway reports model listing only when that option is enabled on the connection. TypeSafe, OpenRouter, and Vercel report the full contract above.

## XML example

```xml
<typesafe:get-capabilities config-ref="TypeSafe_Config" />
```

A direct TypeSafe route already supports the full decision contract. The operation is most useful for gateway, Cloudflare, mock, and mixed-fallback configurations.

## See also

- [Connection List Models](./connection-list-models)
- [Set Up](../set-up)
