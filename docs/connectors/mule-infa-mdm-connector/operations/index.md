---
title: Operations
description: Available operations for the Informatica MDM - Business 360 Connector
---

# Operations

The Informatica MDM - Business 360 Connector provides four operations covering the core B360 REST API capabilities. The operation names use **canonical Application Integration naming** rather than raw Informatica MDM terminology — see [Design Concept](../concept) to understand why and how they map to the underlying APIs.

## Available Operations

| Operation | Display Name | API Endpoint | Description |
|-----------|-------------|--------------|-------------|
| [Master Read](./master-read) | INFA MDM - Master Read | `GET /business-entity/.../entity/{businessEntity}/{id}` | Read a golden (master) record by Business ID or Source System key |
| [Search](./search) | INFA MDM - Master Search | `POST /search/.../search` | Full-text or field-level search with filtering, sorting, and pagination |
| [Source Read](./source-read) | INFA MDM - Source Read | `GET /business-entity/.../entity-xref/{entity}/{system}/{key}` | Read a cross-reference (source) record |
| [Source Submit](./source-submit) | INFA MDM - Source Submit | `POST /business-entity/.../entity/{businessEntity}` | Create or update a source record in B360 |

## DataSense Support

All operations support dynamic metadata resolution:

- **Business Entity Internal Id** and **Source System** fields provide drop-down value providers populated from your B360 tenant datamodel
- **Output metadata** is resolved dynamically based on the selected business entity, giving you entity-aware DataWeave autocompletion
- **Input metadata** (Source Submit) resolves the expected record payload structure for the selected entity

## Error Handling

All operations can throw the following error types:

| Error Type | HTTP Status | Description |
|------------|-------------|-------------|
| `B360:CLIENT_ERROR` | 4xx | Invalid request, unauthorized, entity not found, etc. |
| `B360:SERVER_ERROR` | 5xx | B360 API internal error |
| `B360:TIMEOUT` | — | Request timed out |
| `B360:CONNECTIVITY` | — | General connectivity failure |

### Error Handling Example

```xml
<try>
    <b360:master-read config-ref="B360_Config"
        businessEntity="c360.person"
        businessId="12345" />

    <error-handler>
        <on-error-continue type="B360:CLIENT_ERROR">
            <logger level="WARN"
                message="Record not found or invalid request: #[error.description]" />
        </on-error-continue>

        <on-error-continue type="B360:TIMEOUT">
            <logger level="ERROR"
                message="B360 API timed out: #[error.description]" />
        </on-error-continue>
    </error-handler>
</try>
```

## Response Attributes

Each operation returns response attributes alongside the payload, accessible via `attributes`:

| Attribute | Type | Description |
|-----------|------|-------------|
| `statusCode` | Integer | HTTP status code from the B360 API |
| `requestId` | String | B360 request tracking ID for troubleshooting |

Additional attributes vary by operation — see each operation's documentation for details.
