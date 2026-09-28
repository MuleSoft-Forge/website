---
title: "[Util] Connection Get Capabilities"
description: Report capabilities for the primary TypeSafe route and its fallbacks.
---

# [Util] Connection Get Capabilities

Reports the static decision capabilities of the primary route and every configured fallback. This is useful when one Mule configuration can point at providers with different feature sets.

## Inputs

The operation requires a connector configuration and connection. It sends no input payload and reads no input attributes.

## Output

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

Output attributes contain `count`, the number of reported routes.

## Provider call

None. Capabilities are derived locally from the configured route types.

## XML example

```xml
<typesafe:get-capabilities config-ref="TypeSafe_Config" />
```

A direct TypeSafe route already supports the full decision contract. The operation is most useful for gateway, Cloudflare, mock, and mixed-fallback configurations.

## See also

- [Connection List Models](./connection-list-models)
- [Set Up](../set-up)
