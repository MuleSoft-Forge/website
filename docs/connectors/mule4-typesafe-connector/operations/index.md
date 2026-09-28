---
title: TypeSafe Connector Operations
description: Complete operation reference for typed decisions, selection, governance, and discovery.
---

# Operations

The connector exposes 11 operations. Provider-backed operations call Jev through the configured route. Policy, capability, and validation operations run locally.

## Decision operations

| Operation | Alias | Provider calls | Purpose |
| --- | --- | ---: | --- |
| [\[Decide\] Evaluate](./evaluate) | `evaluate` | 1 | Evaluate a complete named question set against one state. |
| [\[Decide\] Ask Yes/No](./ask-noul) | `ask-noul` | 1 | Return the yes probability for one Noul question. |
| [\[Decide\] Choose](./choose) | `choose` | 1 | Classify state into one of a fixed set of options. |
| [\[Decide\] Score](./score) | `score` | 1 | Grade state against ordered rubric levels. |
| [\[Select\] Candidate](./select-candidate) | `select-candidate` | 1 | Select and rank the best row from runtime candidates. |

## Scale operations

| Operation | Alias | Provider calls | Purpose |
| --- | --- | ---: | --- |
| [\[Decide\] Evaluate Batch](./evaluate-batch) | `evaluate-batch` | One per unique cache miss | Apply one question set to many states with bounded concurrency. |
| [\[Select\] Filter](./filter) | `filter` | One per chunk | Retain items whose Noul probability clears a threshold. |

## Policy and utility operations

| Operation | Alias | Provider calls | Purpose |
| --- | --- | ---: | --- |
| [\[Policy\] Apply](./apply-policy) | `apply-policy` | 0 | Convert answers to `ACCEPT`, `REVIEW`, or `REJECT`. |
| [\[Util\] Connection Get Capabilities](./connection-get-capabilities) | `get-capabilities` | 0 | Describe primary and fallback route capabilities. |
| [\[Util\] Connection List Models](./connection-list-models) | `list-models` | One per supporting route | Merge model cards across the connection. |
| [\[Util\] Validate Question Set](./validate-question-set) | `validate-question-set` | 0 | Validate questions before a billed call. |

## Shared request options

Provider-backed operations include:

| Option | Default | Description |
| --- | --- | --- |
| Model override | Connection model | Select a model for this call. |
| Include raw response | `false` | Attach the provider body to `attributes.rawResponse`. |
| Use cache | `false` | Use the connector cache when caching is enabled globally. |
| Step | Empty | Copy a flow label into `attributes.traceEntry.step`. |

## Decision attributes

Provider-backed decision operations return metadata separately from the payload:

- Provider, requested model, and actual model
- Input and output token usage
- Estimated cost and cost source
- Latency, attempts, and failed-over routes
- Cache-hit status
- Question-set ID and version
- State hash and provider request ID
- Optional raw response
- Audit-ready trace entry

## Provider endpoints

- TypeSafe, OpenRouter, Vercel, and compatible decision routes use `POST /{apiVersion}/systemone` (connection **API version**, default `v1`).
- Cloudflare uses `POST /client/v4/accounts/{accountId}/ai/run/{model}`.
- Model discovery uses `GET /{apiVersion}/models`.
- The mock route, Apply Policy, Get Capabilities, and Validate Question Set make no HTTP request.

See [TypeSafe API documentation](https://docs.typesafe.ai/api) and [model-list documentation](https://docs.typesafe.ai/models).

## Errors

Operations can raise `TYPESAFE:*` errors including:

- `UNAUTHORIZED`, `RATE_LIMITED`, `OVERLOADED`, `TIMEOUT`, and `CONNECTIVITY`
- `PROVIDER_VALIDATION`, `PROVIDER_ERROR`, and `INVALID_RESPONSE`
- `INVALID_QUESTION_SET`, `INVALID_STATE`, and `TOO_MANY_OPTIONS`
- `BATCH_TOO_LARGE`, `BUDGET_EXCEEDED`, and `UNSUPPORTED_BY_PROVIDER`
- `BELOW_THRESHOLD` and `REJECTED`

Transient connectivity, timeout, rate-limit, and overload failures can use ordered fallback routes. Validation and authorization failures do not fail over.
