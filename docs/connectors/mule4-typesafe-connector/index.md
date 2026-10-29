---
title: TypeSafe Connector for Mule 4
description: "Think: Smart If Statements. Typed Jev decisions in Mule flows."
---

# TypeSafe Connector for Mule 4

**Think: Smart If Statements.**

[Jev](https://docs.typesafe.ai/introduction) is [TypeSafe](https://typesafe.ai)'s System One model. It turns unstructured JSON **state** and typed **questions** into a value a Choice router, filter, or expression can read. The flow owns the if: the threshold, the route, and the side effect. This connector exists to make that if possible in Mule.

Start with **[How Decisions Work](./how-decisions-work)** for connector behavior (policy bands, fail-closed Apply Policy, filter keep/uncertain/drop, drift on Noul) without needing deep Jev reading.

<AtAGlance id="typesafe" />

## Jev

Use these pages when you need the official project behind a connector concept:

| Topic | Official page |
| --- | --- |
| What Jev is | [Introduction](https://docs.typesafe.ai/introduction) |
| System One | [System One](https://docs.typesafe.ai/concepts/system-one) |
| How to design the if | [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one) |
| State | [State](https://docs.typesafe.ai/concepts/state) |
| Choice, Score, Noul, and Box | [Primitives](https://docs.typesafe.ai/primitives) |
| Images (multipart assets) | [Images](https://docs.typesafe.ai/images) |
| Box coordinates | [Box](https://docs.typesafe.ai/primitives/box) |
| When to act on an answer | [Confidence](https://docs.typesafe.ai/confidence) |
| `jev-latest` and model cards | [Models](https://docs.typesafe.ai/models) |
| `POST /{apiVersion}/systemone` | [HTTP API](https://docs.typesafe.ai/api) |
| Announcement | [Introducing System One Models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) |

## Why use it?

Jev is one System One HTTP call. The connector turns that call into Studio-ready Decide shortcuts, scale patterns, local policy, utilities, and sources — see **[Why a Connector](./why-a-connector)**.

- **Typed decisions** — Noul (yes/no probability), Choice (classification), Score (ordered rubric), and Box (image coordinates) answers.
- **Images** — PNG/JPEG assets on Decide and Select calls (multipart); [Locate](./operations/locate) for Box. See [Images](./operations/#images).
- **Native DataSense** — JSON input and output metadata, including answer-specific metadata for reusable question sets.
- **Six routes** — TypeSafe, OpenRouter, Vercel AI Gateway, Cloudflare Workers AI, compatible gateways, and an in-process mock.
- **Resilient execution** — ordered provider fallbacks, retry handling, optional caching, budgets, and usage statistics.
- **Flow-ready governance** — local policy returns `ACCEPT`, `REVIEW`, or `REJECT`; fails closed and validates rules before applying.
- **Scale operations** — bounded-concurrency batch evaluation and filtering with optional keep / uncertain / drop bands.
- **Operational signals** — polling sources for drift (including Noul certainty), budget thresholds, and successful provider failovers.

## Core concepts

| Term | Meaning |
| --- | --- |
| State | The JSON context being evaluated, such as a ticket, order, candidate, or message. |
| Noul | A yes/no question whose answer is the probability of “yes.” |
| Choice | A classification question that returns one option and a probability distribution. |
| Score | An ordered rubric that returns a score, level distribution, and derived level. |
| Box | An image question that returns a bounding box (`top` / `bottom` / `left` / `right` as 0–1 fractions) plus derived geometry. Needs Jev 1.14+. |
| Images | Reference → PNG or JPEG binary on Decide / Select operations; each reference must appear in state, instructions, or criteria. |
| Question set | A reusable JSON file under `src/main/resources/questions/`. |
| Policy | Local thresholds that convert answers into an `ACCEPT`, `REVIEW`, or `REJECT` action (three-band Noul, per-option Choice, named `routeQuestion`). |

## Routes

| Route | Authentication | Notes |
| --- | --- | --- |
| TypeSafe | API key | Direct System One access, model listing, and images / Box (`supportsImages`, `supportsBox`). |
| OpenRouter | API key | Jev through OpenRouter, including provider-reported cost. No multipart images. |
| Vercel AI Gateway | Gateway key or OIDC token | Jev through Vercel AI Gateway. No multipart images. |
| Cloudflare Workers AI | Account ID and API token | Cloudflare model endpoint; model listing and images unavailable. |
| Compatible Gateway | Optional bearer key | A configurable endpoint that implements the System One contract; images when the gateway supports them. |
| Mock | None | In-process, deterministic answers for development and tests, including images / Box. |

Keyed routes can define ordered fallback routes. A fallback is attempted for connectivity, timeout, rate-limit, and overload failures—not for invalid requests or authorization failures.

## Operations

### Decide and select

- **[\[Decide\] Evaluate](./operations/evaluate)** — evaluate a complete question set (including Box).
- **[\[Decide\] Ask Yes/No](./operations/ask-noul)** — ask one Noul question.
- **[\[Decide\] Choose](./operations/choose)** — classify state into one option.
- **[\[Decide\] Score](./operations/score)** — grade state against ordered levels.
- **[\[Decide\] Locate](./operations/locate)** — return the bounding box of a target in an image.
- **[\[Select\] Candidate](./operations/select-candidate)** — select and rank the best upstream row.
- **[\[Decide\] Evaluate Batch](./operations/evaluate-batch)** — evaluate one question set across many states.
- **[\[Select\] Filter](./operations/filter)** — partition items into kept, uncertain, and dropped by Noul.

### Policy and utilities

- **[\[Policy\] Apply](./operations/apply-policy)** — turn answers into a routing action locally (fails closed; validates policy).
- **[\[Util\] Connection Get Capabilities](./operations/connection-get-capabilities)** — report route capabilities locally.
- **[\[Util\] Connection List Models](./operations/connection-list-models)** — enumerate models across supporting routes.
- **[\[Util\] Validate Question Set](./operations/validate-question-set)** — validate a question set before a billed call.

See the [operations overview](./operations/) for inputs, outputs, and provider-call behavior.

## Sources

- **On Drift Detected** — watches no-match rate, confidence (or Noul certainty), and answer-distribution changes.
- **On Budget Threshold** — fires when calls or input tokens cross a configured percentage.
- **On Provider Failover** — emits successful fallback events.

See [Sources](./sources) for payloads and configuration.

## Requirements

- Mule Runtime 4.9.0 or later
- Java 17
- Maven 3.9.x

## Learn more

- [Why a Connector](./why-a-connector)
- [How Decisions Work](./how-decisions-work)
- [Set Up](./set-up)
- [Images](./operations/#images)
- [Operations Reference](./operations/)
- [Sources](./sources)
- [Jev introduction](https://docs.typesafe.ai/introduction)
- [TypeSafe API](https://docs.typesafe.ai/api)
- [Maven Central `1.0.3`](https://central.sonatype.com/artifact/com.mulesoftforge/mule4-typesafe-connector/1.0.3)
- [GitHub release `v1.0.3`](https://github.com/MuleSoft-Forge/mule4-typesafe-connector/releases/tag/v1.0.3)
- [Set Up — Maven Central install](./set-up)
- [GitHub repository](https://github.com/MuleSoft-Forge/mule4-typesafe-connector)
