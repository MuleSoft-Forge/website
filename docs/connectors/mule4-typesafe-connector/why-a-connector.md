---
title: Why a Connector
description: One System One endpoint, twelve Mule operations — what the TypeSafe connector adds over a raw HTTP request.
---

# Why a Connector

Jev has one decision call: [`POST /{apiVersion}/systemone`](https://docs.typesafe.ai/api). The TypeSafe console Playground is a UI over that call. In this connector, **[\[Decide\] Evaluate](./operations/evaluate)** is the one-to-one Mule equivalent: free-form state plus questions, one provider round-trip, typed answers back.

The other eleven operations are not extra endpoints. They are what an integration needs *around* that call — Studio ergonomics, scale patterns, local governance, design-time checks, and runtime signals — so a Mule flow does not re-implement them with HTTP Request, DataWeave, For Each, and custom error handling.

## What you would build yourself

Wire Jev with only the HTTP connector and you still own every surrounding concern:

| Concern | Without the connector | With the connector |
| --- | --- | --- |
| Question JSON | Hand-build `type`, `instructions`, `criteria` for every call | Shortcuts expose typed Studio fields; Evaluate loads classpath question sets |
| Auth and route | Headers, base URL, and API version per provider | One config with six routes and a configured `apiVersion` |
| Images | Multipart encoding and reference wiring | `Images` map on Decide / Select operations |
| Answer shape | Dig `answers.<id>.noul` (or `choice` / `score`) out of a raw body | Shortcuts return a single answer; Evaluate names answers for DataSense |
| Retry and failover | Custom `until-successful` and route switching | Ordered fallbacks, retries, and typed `TYPESAFE:*` errors |
| Cache and budget | Your own store and counters | Optional cache, budgets, and usage on attributes |
| Thresholds and routing | DataWeave `if` on raw probabilities | [Apply Policy](./operations/apply-policy) returns `ACCEPT` / `REVIEW` / `REJECT` locally |
| Lists of items | For Each plus aggregation | [Evaluate Batch](./operations/evaluate-batch), [Filter](./operations/filter), [Select Candidate](./operations/select-candidate) |

A thin wrapper around one HTTP call stops at the first row. The connector exists for the rest of the table.

## Five layers over one call

| Layer | What it adds | Operations | Provider call? |
| --- | --- | --- | --- |
| **Single-type shortcuts** | Typed Studio fields, no question JSON, answer-shaped DataSense | [Ask Yes/No](./operations/ask-noul), [Choose](./operations/choose), [Score](./operations/score), [Locate](./operations/locate) | Yes (1) |
| **Scale patterns** | Bounded concurrency, per-state cache, keep / uncertain / drop bands | [Evaluate Batch](./operations/evaluate-batch), [Filter](./operations/filter), [Select Candidate](./operations/select-candidate) | Yes (per item / chunk) |
| **Local policy** | Probabilities → `ACCEPT` / `REVIEW` / `REJECT`; fails closed | [Apply Policy](./operations/apply-policy) | No |
| **Design-time utilities** | Model dropdowns, route capability checks, catch bad question sets before a billed call | [List Models](./operations/connection-list-models), [Get Capabilities](./operations/connection-get-capabilities), [Validate Question Set](./operations/validate-question-set) | List Models only |
| **Runtime signals** | Drift, budget threshold, and successful provider failover as Mule events | [Sources](./sources) | Polling / local |

[Evaluate](./operations/evaluate) sits under the first layer as the general-purpose form: same System One call, full question set, named answers under `payload.answers`.

## Cross-cutting value

No single operation shows the whole story. Across Decide, Select, Policy, and Utils you also get:

- **Six routes behind one config** — TypeSafe, OpenRouter, Vercel AI Gateway, Cloudflare Workers AI, compatible gateways, and an in-process mock.
- **Ordered fallbacks** — connectivity, timeout, rate-limit, and overload failures can move to the next route; invalid requests and auth failures do not.
- **Retry, cache, budgets, and usage** — request options and attributes carry cost and latency without a second custom flow.
- **DataSense from classpath question sets** — named answers such as `payload.answers.team.choice` appear in Studio when you point at a file under `questions/`.
- **Typed errors** — `TYPESAFE:INVALID_QUESTION_SET`, `TYPESAFE:UNSUPPORTED_BY_PROVIDER`, and peers drive `on-error` without scraping HTTP status text.

## Same question, two ways

Both snippets ask whether ticket `T-1001` needs a fast response. The left side is what a raw HTTP Request flow looks like. The right side is the shortcut the connector ships for that shape.

::: code-group

```xml [HTTP Request]
<http:request method="POST" path="/v1/systemone" config-ref="TypeSafe_HTTP">
    <http:headers><![CDATA[#[output application/java
---
{ Authorization: "Bearer " ++ p('typesafe.apiKey') }]]]></http:headers>
    <http:body><![CDATA[#[output application/json
---
{
  state: payload,
  questions: {
    result: {
      type: "noul",
      instructions: "Does this ticket need a fast response?",
      criteria: {
        "true": "An outage, deadline, or loss is described.",
        "false": "This is a routine request."
      }
    }
  }
}]]]></http:body>
</http:request>

<!-- Then dig the probability out yourself -->
<ee:transform>
    <ee:message>
        <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
payload.answers.result.noul]]></ee:set-payload>
    </ee:message>
</ee:transform>
```

```xml [Ask Yes/No]
<typesafe:ask-noul
    config-ref="TypeSafe_Config"
    instructions="Does this ticket need a fast response?"
    criteriaTrue="An outage, deadline, or loss is described."
    criteriaFalse="This is a routine request."
    step="urgency">
    <typesafe:state>#[payload]</typesafe:state>
</typesafe:ask-noul>

<!-- payload.noul is already the yes probability -->
```

:::

Both hit the same System One endpoint. The connector builds the inline `result` question, sets auth from the connection, returns a Noul-shaped payload, and puts provider, model, usage, and latency on attributes. Route on `payload.noul >= 0.7` without a second transform.

For a full triage with named answers and local governance, use Evaluate plus Apply Policy as in [Set Up](./set-up#first-flow).

## When plain Evaluate is enough

Use Evaluate (or a console-style playground built on it) when free-form state and questions *are* the product:

- Exploring Jev the way the TypeSafe Playground does
- Prototyping a question set before locking Studio fields
- Passing a complete JSON question object from an upstream system

The sample app under [`demo/mule4-typesafe-connector-app`](https://github.com/MuleSoft-Forge/mule4-typesafe-connector/tree/main/demo/mule4-typesafe-connector-app) ships an embedded playground at `GET /playground`. It calls the connector’s Evaluate, shortcuts, Validate, Apply Policy, List Models, and Get Capabilities operations, with integration-first examples (CRM dedup, EDI notes, GL coding, DLQ triage, PII egress, ticket routing) plus images / Locate. See [Set Up — Playground](./set-up#playground).

Reach for shortcuts, batch, filter, policy, utilities, and sources when you wire Jev into a production Mule flow — typed fields, many items, thresholds that fail closed, and operational signals.

## Learn more

- [How Decisions Work](./how-decisions-work) — answer shapes, policy bands, fail-closed Apply Policy
- [Operations](./operations/) — inputs, outputs, and provider-call counts for all twelve operations
- [Set Up](./set-up) — config, first flow, and classpath question sets
- [TypeSafe HTTP API](https://docs.typesafe.ai/api) — the underlying `POST /{apiVersion}/systemone` contract
