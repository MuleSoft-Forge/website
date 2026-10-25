---
title: TypeSafe Connector Operations
description: Complete operation reference for typed decisions, selection, governance, and discovery.
---

# Operations

The connector exposes 12 operations. Provider-backed operations call Jev through the configured route. Policy, capability, and validation operations run locally.

[\[Decide\] Evaluate](./evaluate) maps one-to-one to `POST /{apiVersion}/systemone`. The other operations are what a Mule integration needs around that call — see [Why a Connector](../why-a-connector).

## Decision operations

| Operation | Alias | Provider calls | Purpose |
| --- | --- | ---: | --- |
| [\[Decide\] Evaluate](./evaluate) | `evaluate` | 1 | Evaluate a complete named question set against one state. |
| [\[Decide\] Ask Yes/No](./ask-noul) | `ask-noul` | 1 | Return the yes probability for one Noul question. |
| [\[Decide\] Choose](./choose) | `choose` | 1 | Classify state into one of a fixed set of options. |
| [\[Decide\] Score](./score) | `score` | 1 | Grade state against ordered rubric levels. |
| [\[Decide\] Locate](./locate) | `locate` | 1 | Return the bounding box of a target in an image. |
| [\[Select\] Candidate](./select-candidate) | `select-candidate` | 1 | Select and rank the best row from runtime candidates. |

## Scale operations

| Operation | Alias | Provider calls | Purpose |
| --- | --- | ---: | --- |
| [\[Decide\] Evaluate Batch](./evaluate-batch) | `evaluate-batch` | One per unique cache miss | Apply one question set to many states with bounded concurrency. |
| [\[Select\] Filter](./filter) | `filter` | One per chunk | Partition items into kept / uncertain / dropped by Noul. |

## Policy and utility operations

| Operation | Alias | Provider calls | Purpose |
| --- | --- | ---: | --- |
| [\[Policy\] Apply](./apply-policy) | `apply-policy` | 0 | Convert answers to `ACCEPT`, `REVIEW`, or `REJECT` (fails closed). |
| [\[Util\] Connection Get Capabilities](./connection-get-capabilities) | `get-capabilities` | 0 | Describe primary and fallback route capabilities. |
| [\[Util\] Connection List Models](./connection-list-models) | `list-models` | One per supporting route | Merge model cards across the connection. |
| [\[Util\] Validate Question Set](./validate-question-set) | `validate-question-set` | 0 | Validate questions and file `policy` before a billed call. |

See [How Decisions Work](../how-decisions-work) for policy bands, fail-closed behavior, filter bands, and drift expectations.

## Shared request options

Provider-backed operations include:

| Option | Default | Description |
| --- | --- | --- |
| Model override | Connection model | Select a model for this call. |
| Include raw response | `false` | Attach the provider body to `attributes.rawResponse`. |
| Use cache | `false` | Use the connector cache when caching is enabled globally. |
| Step | Empty | Copy a flow label into `attributes.traceEntry.step`. |

## Images

Evaluate, Ask Yes/No, Choose, Score, Select Candidate, and Locate take an **Images** map. Each key is a reference string, and each value is a PNG or JPEG binary, for example from a File read or an HTTP body:

```xml
<typesafe:images>#[{ (vars.photoRef): vars.photo }]</typesafe:images>
```

Write each reference somewhere in a string value of the state, instructions, or criteria (for example `{ "photo": vars.photoRef }` and the instruction "Is there a person in `photo`?"). An image nothing refers to is an error. Use an opaque unique reference such as a UUID rather than a word that might appear in ordinary text.

With images, the connector sends `multipart/form-data` to `POST /{apiVersion}/systemone`. The body has a `request` JSON part, whose `assets` entries point at file parts, followed by one file part per image. It also sets `TypeSafe-Danger-Zone-Images: true`. Base64 text, with or without a `data:` prefix, is decoded first.

Before any cache lookup, budget reservation, or HTTP call, the connector checks the documented limits and raises `TYPESAFE:INVALID_IMAGE` on a violation:

| Limit | Value |
| --- | --- |
| Formats | PNG or JPEG (no animated PNG) |
| Size | 16 MiB per image, 32 MiB for all images |
| Each side | 280–1568 px |
| Total pixels | 78,400–2,458,624 |
| Reference | 1,024 bytes each, 65,536 bytes for all |

Images need a route with `supportsImages` (TypeSafe, compatible, or mock; see [Connection Get Capabilities](./connection-get-capabilities)). Evaluate Batch and Filter do not take images. The image API is marked experimental by TypeSafe. See [TypeSafe images](https://docs.typesafe.ai/images).

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
- `INVALID_QUESTION_SET`, `INVALID_STATE`, `INVALID_IMAGE`, and `TOO_MANY_OPTIONS`
- `REQUEST_TOO_LARGE` (HTTP 413)
- `BATCH_TOO_LARGE`, `BUDGET_EXCEEDED`, and `UNSUPPORTED_BY_PROVIDER`
- `BELOW_THRESHOLD` and `REJECTED`

Transient connectivity, timeout, rate-limit, and overload failures can use ordered fallback routes. Validation and authorization failures do not fail over.
