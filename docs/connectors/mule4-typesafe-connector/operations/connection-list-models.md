---
title: "[Util] Connection List Models"
description: List TypeSafe models available through the primary route and fallbacks.
---

# [Util] Connection List Models

Lists models from every connected route that supports model discovery and merges them into one JSON payload. Call the operation once per connection when you want to compare routes side by side.

## Inputs

The operation requires a connector configuration and connection. `GET /{apiVersion}/models` has no request body, so the input payload and input attributes are explicit null metadata.

## Output

The payload is a JSON array of model cards. Output attributes carry `count` and one `calls[]` entry per route that was queried.

### TypeSafe

Payload:

```json
[
  {
    "name": "jev-latest",
    "description": "The latest iteration of TypeSafe's System One Model: Jev",
    "release_date": "2026-09-10T18:38:01.391457+00:00",
    "route": "typesafe"
  },
  {
    "name": "jev-preview",
    "description": "A preview version of `jev-latest`: should be better in most ways",
    "release_date": "2026-09-10T18:39:06.057655+00:00",
    "route": "typesafe"
  }
]
```

Attributes:

```json
{
  "count": 2,
  "calls": [
    {
      "route": "typesafe",
      "requestId": "req_01a0e7a4cedc76beb0d353cdb0313a50",
      "statusCode": 200
    }
  ]
}
```

### OpenRouter

OpenRouter's public catalog is multi-vendor. The connector keeps only that route's TypeSafe model namespace (`typesafe/…`). Catalog labels that differ from the callable id appear as `display_name`.

Payload:

```json
[
  {
    "name": "typesafe/jev-router",
    "description": "Jev Router picks the best model and reasoning effort for each request, balancing quality, speed, and cost. It runs on [Jev](https://openrouter.ai/~typesafe/jev-latest), TypeSafe's first System One model, and adapts as your...",
    "release_date": "2026-09-25T19:12:40Z",
    "route": "openrouter",
    "display_name": "TypeSafe: Jev Router"
  }
]
```

Attributes:

```json
{
  "count": 1,
  "calls": [
    {
      "route": "openrouter",
      "requestId": "a4223284084a198c-ARN",
      "statusCode": 200
    }
  ]
}
```

OpenRouter's model-list response has no generation ID. For that route, `calls[].requestId` uses OpenRouter's per-request `cf-ray` trace as a support-correlation fallback.

## HTTP call

`GET /{apiVersion}/models`

The API version comes from each route's connection configuration and defaults to `v1`. Supporting routes are queried in parallel; unsupported routes are skipped.

If no configured route supports model discovery, the operation raises `TYPESAFE:UNSUPPORTED_BY_PROVIDER`.

See [TypeSafe model-list documentation](https://docs.typesafe.ai/models).

## XML example

```xml
<typesafe:list-models config-ref="TypeSafe_Config" />
```

TypeSafe, OpenRouter, and Vercel routes support model listing. Each route adapter normalizes its provider response and scopes broad provider catalogs to that route's TypeSafe model namespace. Cloudflare does not support model listing. A compatible gateway supports it only when enabled in the connection.

## See also

- [Connection Get Capabilities](./connection-get-capabilities)
- [Set Up](../set-up)
