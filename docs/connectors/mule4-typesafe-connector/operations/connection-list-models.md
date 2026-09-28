---
title: "[Util] Connection List Models"
description: List TypeSafe models available through the primary route and fallbacks.
---

# [Util] Connection List Models

Lists models from every connected route that supports model discovery and merges them into one JSON payload.

## Inputs

The operation requires a connector configuration and connection. `GET /{apiVersion}/models` has no request body, so the input payload and input attributes are explicit null metadata.

## Output

```json
[
  {
    "name": "jev-latest",
    "description": "Latest Jev System One model",
    "release_date": "<vendor release date>",
    "route": "typesafe"
  }
]
```

Output attributes contain:

```json
{
  "count": 1,
  "calls": [
    {
      "route": "typesafe",
      "statusCode": 200,
      "requestId": "request-id"
    }
  ]
}
```

## HTTP call

`GET /{apiVersion}/models`

The API version comes from each route's connection configuration and defaults to `v1`. Supporting routes are queried in parallel; unsupported routes are skipped.

If no configured route supports model discovery, the operation raises `TYPESAFE:UNSUPPORTED_BY_PROVIDER`.

See [TypeSafe model-list documentation](https://docs.typesafe.ai/models).

## XML example

```xml
<typesafe:list-models config-ref="TypeSafe_Config" />
```

TypeSafe, OpenRouter, and Vercel routes support model listing. Cloudflare does not. A compatible gateway supports it only when enabled in the connection.

## See also

- [Connection Get Capabilities](./connection-get-capabilities)
- [Set Up](../set-up)
