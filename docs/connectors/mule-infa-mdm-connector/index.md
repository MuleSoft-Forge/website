---
title: Informatica MDM - Business 360 Connector
description: MuleSoft connector for Informatica MDM Business 360 REST API — Master Read, Search, Source Read, and Source Submit operations.
---

# mule-infa-mdm-connector

A MuleSoft Java SDK Connector (ain't no REST wrapper ;) ) for the [Informatica MDM Business 360 REST API](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Business_360_REST_API.html), providing native Anypoint Studio and Anypoint Code Builder integration with full DataSense metadata resolution.

<Hint type="info">

**New to MDM?** Read the [Design Concept](./concept) page first — it explains *why* the operations are named the way they are and how this connector bridges the gap between MDM terminology and Application Integration patterns.

</Hint>

## Key Benefits

* **Native MDM Operations**: Dedicated operations for Master Read, Search, Source Read, and Source Submit — no HTTP Requester boilerplate required.
* **Dynamic DataSense**: Metadata resolvers introspect your B360 tenant datamodel at design time, providing entity-aware input/output types and attribute metadata.
* **Value Providers**: Drop-down selection for Business Entities and Source Systems, populated directly from your MDM tenant.
* **Simplified Authentication**: Logs in via the IICS V3 Login API and automatically manages session tokens and JWT refresh.
* **Proxy & TLS Support**: Full support for HTTP/HTTPS, custom TLS contexts, and HTTP proxy configuration.

## Operations

| Operation | Display Name | Description |
|-----------|-------------|-------------|
| [Master Read](./operations/master-read) | INFA MDM - Master Read | Read a master record by Business ID or Source System key |
| [Search](./operations/search) | INFA MDM - Master Search | Full-text or field-level search across business entities |
| [Source Read](./operations/source-read) | INFA MDM - Source Read | Read a cross-reference (source) record |
| [Source Submit](./operations/source-submit) | INFA MDM - Source Submit | Create or update a source record |

## Use Cases

### Data Enrichment / Lookup

An incoming order or service request contains a customer name or ID. Use **Search** or **Master Read** to look up the golden record in MDM and enrich the payload with verified address, phone, email, or other attributes before routing downstream.

### Customer 360 / Single View

Surface the master record in a CRM, portal, or case management system. **Master Read** by Business ID gives you the consolidated golden record; **Source Read** lets you drill into the individual source contributions (e.g., "this address came from SAP, that phone number came from Salesforce").

### Data Onboarding / Ingestion

New or updated records arrive from an external system (file, API, event). Use **Source Submit** to push them into MDM as source records, letting B360's match/merge engine handle deduplication and survivorship.

### Data Synchronization

Keep downstream systems in sync with MDM. Use **Search** or **Master Read** to pull master data, then transform and push to target systems (ERP, data warehouse, marketing platform).

### Duplicate Detection / Validation

Before creating a new account or contact, **Search** MDM to check if a matching record already exists. Prevent duplicates at the point of entry rather than cleaning up after the fact.

### Cross-Reference Resolution

Given a source system key (e.g., SAP customer number), use **Source Read** to find the corresponding master record and then resolve to another source system's key — effectively translating IDs across systems.

## Supported Error Types

| Error Type | Description |
|------------|-------------|
| `B360:CLIENT_ERROR` | 4xx HTTP responses from the B360 API |
| `B360:SERVER_ERROR` | 5xx HTTP responses from the B360 API |
| `B360:TIMEOUT` | Request timed out (SocketTimeoutException) |
| `B360:CONNECTIVITY` | General connectivity failure |

## Requirements

- **Mule Runtime**: 4.6.0 or later
- **Java**: 8, 11, or 17
- **Informatica Cloud (IICS)**: Active account with MDM Business 360 entitlement

## Learn More

- [Design Concept](./concept) — Why the operations are named the way they are (read this first)
- [Set Up Guide](./set-up) — Installation, authentication, and configuration
- [Operations Reference](./operations/) — All operations with parameters and examples
- [GitHub Repository](https://github.com/MuleSoft-Forge/mule-infa-mdm-connector) — Source code and issues
