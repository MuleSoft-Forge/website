---
title: Informatica MDM - Business 360 Connector
description: MuleSoft connector for Informatica MDM Business 360 REST API — Master Read, Search, Source Read, and Source Submit operations.
---

# mule-infa-mdm-connector

A MuleSoft 4 connector for the [Informatica MDM Business 360 REST API](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Business_360_REST_API.html), providing native Anypoint Studio and Anypoint Code Builder integration with full DataSense metadata resolution.

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

## Quick Example

```xml
<!-- Configure the connector -->
<b360:config name="B360_Config">
    <b360:basic-connection
        baseUrl="https://dmp-us.informaticacloud.com/saas/public/core/v3/login"
        username="${iics.username}"
        password="${iics.password}" />
</b360:config>

<!-- Master Read by Business ID -->
<b360:master-read config-ref="B360_Config"
    businessEntity="Person"
    businessId="12345" />

<!-- Search for records -->
<b360:search config-ref="B360_Config"
    entityType="Person"
    search="John Smith"
    recordsToReturn="10" />
```

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
