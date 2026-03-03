---
title: Design Concept — Why These Operation Names?
description: Architectural rationale for the connector's canonical Application Integration naming — translating MDM terminology into predictable CRUD concepts.
---

# Design Concept — Why These Operation Names?

This connector acts as an **API Facade** (Anti-Corruption Layer) between Informatica MDM and MuleSoft application developers. Understanding *why* the operations are named the way they are will help you use them correctly and avoid common architectural mistakes.

---

## The Dilemma

There is a fundamental disconnect between two worlds:

- **Data Integration (ETL, MDM, batch syncing)** — thinks in terms of probabilistic governance: *Contribute, Merge, Survive, Unmerge*.
- **Application Integration (APIs, events, real-time CRUD)** — thinks in terms of clear, deterministic state changes: *Create, Read, Update, Delete*.

If the connector exposes raw Informatica names (e.g. *Create Master Record*, *Entity XREF*) to an application developer building a lightweight microservice, they will misunderstand what the API actually does. That leads to bad architecture and support load.

---

## The Solution: Abstract It

The connector translates MDM concepts into standard, predictable application concepts. Operations use **canonical Application Integration naming** in the UI (Anypoint Studio / Code Builder), while the exact Informatica endpoint and raw terminology are documented here and in operation tooltips for architects who need to debug the raw HTTP call.

---

## Translation Guide

| Informatica raw name / endpoint | What it actually does | Connector operation name |
|---------------------------------|------------------------|---------------------------|
| **Create Master Record** — `POST /entity/{entityType}` | Accepts source data and runs it through the match/merge engine. The MDM engine decides whether to create, merge, or hold for approval. | **[Source Submit](./operations/source-submit)** |
| **Read Master Record** — `GET /entity/{entityType}/{id}` | Returns the fully blended, survived "Best Version of Truth" record. | **[Master Read](./operations/master-read)** |
| **Search API** — `POST /search` | Searches across golden/master records. | **[Search](./operations/search)** |
| **Source Record API** — `GET /entity-xref/...` | Reads the raw, isolated data from one specific source system's contribution. | **[Source Read](./operations/source-read)** |

---

## Why This Matters

### 1. Prevents the "I created it, why is it gone?" problem

If the operation were called *Create Master Record*, an application developer would assume they own that record. When the MDM engine merges it with another record later, they would think the API is broken.

The name **Source Submit** sets the right expectation: *you are submitting source data; the MDM engine makes the decision* about whether to create a new master, merge with an existing one, or hold for approval.

### 2. Hides complexity developers don't need

Application developers want to push source data and move on. They don't need to understand Survivorship Rules, Match/Merge configuration, or Consolidation states. The connector encapsulates that complexity behind familiar operation names.

### 3. Future-proofing

If the organization replaces Informatica with another MDM platform (e.g. Reltio, Semarchy), application developers don't have to rewrite their integrations. The connector's canonical interface stays the same; only the wiring under the hood changes.

---

## The Compromise: Good Documentation

- **Operations** (display names in Anypoint Studio) use **canonical Application Integration names**.
- **Tooltips, descriptions, and this documentation** include the exact Informatica endpoint and raw name.

**Example description in Studio:**

> **Source Submit** — Submits source system data to the MDM hub for matching and consolidation.
> *(Maps to Informatica: POST /business-entity/public/api/v1/entity/{entityType})*

That gives application developers a clear concept and gives senior architects a breadcrumb to the raw HTTP call.

---

## Canonical Naming Reference

| Connector operation | What it does | Informatica raw name | Canonical alternative names |
|---------------------|--------------|----------------------|----------------------------|
| **Master Read** | Returns the fully blended, survived golden record. | Read Master Record | Get Golden Record, Get Consolidated Profile |
| **Search** | Searches over golden/master records via the Search API. | Master Search | Search Golden Records, Search Consolidated Profiles |
| **Source Read** | Reads a single source system's contribution (cross-reference / XREF). | Source Record API (Read) | Get Source Contribution, Get Cross-Reference Record |
| **Source Submit** | Submits source data; MDM engine runs match/merge/survivorship. | Create Master Record | Upsert Source Candidate, Submit System Data |

---

## MDM Concepts for Application Developers

If you're new to MDM, here's a quick primer on the key concepts:

| MDM Term | What it means for you |
|----------|----------------------|
| **Golden Record** (Master Record) | The single "best version of truth" — a blended, deduplicated record created by the MDM engine from multiple source contributions. This is what **Master Read** returns. |
| **Source Record** (Cross-Reference / XREF) | A single source system's raw contribution. Multiple source records can contribute to one golden record. This is what **Source Read** returns and **Source Submit** creates. |
| **Match & Merge** | The MDM engine's process of finding duplicate records and combining them. When you call **Source Submit**, the engine decides if your data matches an existing record. |
| **Survivorship** | Rules that determine which source system's value "wins" for each field in the golden record. You don't control this from the connector — the MDM engine applies these rules automatically. |
| **Approval** | Some submissions may require a data steward to review before the golden record is updated. The `approvalRequired` attribute in the **Source Submit** response tells you if this happened. |

---

*For the full Informatica B360 REST API reference, see the [Business 360 REST API documentation](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Business_360_REST_API.html).*
