---
title: INFA MDM - MetaData Read
description: Read structural metadata from the Informatica MDM Metadata v2 API
---

# INFA MDM - MetaData Read

Read structural metadata from the Informatica MDM Metadata v2 API. Returns schema definitions, entity blueprints, or relationship metadata depending on the selected resource. Unlike data APIs that return records, the metadata API returns the **schema** — fields, data types, constraints, relationships, and lookup types.

**Sources:** [Informatica KB: Metadata from Org](https://knowledge.informatica.com/s/article/metadata-from-org?language=en_US) | [Relationship Metadata API](https://docs.informatica.com/master-data-management-cloud/business-360-console/current-version/business-360-rest-api-reference/business-360-rest-api/relationship-api/metadata-api.html)

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Resource** | Yes | One of: `DATAMODEL`, `BUSINESS_ENTITY`, `REFERENCE_ENTITY`, `RELATIONSHIP`, `VIEW`, `EXTERNAL_RESOURCE`. |
| **Object Internal Id** | Conditional | Internal id of the object (e.g. `c360.person` for BUSINESS_ENTITY). **Required** when Resource is `BUSINESS_ENTITY`, `REFERENCE_ENTITY`, `VIEW`, or `EXTERNAL_RESOURCE`; ignored for `DATAMODEL` and `RELATIONSHIP`. |

## Resource summary

| Resource | Description |
|----------|-------------|
| **DATAMODEL** | Full schema for the organization: all business entities, relationships, field groups, lookup types. No object id. |
| **BUSINESS_ENTITY** | Field types, constraints, relationships for a specific business entity (e.g. `c360.person`). |
| **REFERENCE_ENTITY** | Metadata for a specific reference entity. |
| **RELATIONSHIP** | How objects link; includes `relationship_Internal_ID` and attributes for Create/Update Relationship APIs. No object id. |
| **VIEW** | Metadata for a specific view. |
| **EXTERNAL_RESOURCE** | Metadata for a specific external resource. |

## Output

- **Payload:** Full metadata JSON as a `Map<String, Object>`.
- **Attributes** — `MetaDataReadResponseAttributes`:

| Attribute | Type | Description |
|-----------|------|-------------|
| `resource` | String | Resource type queried (e.g. DATAMODEL, BUSINESS_ENTITY, RELATIONSHIP). |
| `objectInternalId` | String | Object internal id when required; empty for DATAMODEL and RELATIONSHIP. |
| `statusCode` | int | HTTP status code. |
| `requestId` | String | Request/tracing ID from response headers. |

## Resolved API paths

| Resource | Path |
|----------|------|
| `DATAMODEL` | `<baseApiUrl>/metadata/api/v2/objects/tenantModel/datamodel` |
| `BUSINESS_ENTITY` | `<baseApiUrl>/metadata/api/v2/objects/businessEntity/{objectInternalId}` |
| `REFERENCE_ENTITY` | `<baseApiUrl>/metadata/api/v2/objects/referenceEntity/{objectInternalId}` |
| `RELATIONSHIP` | `<baseApiUrl>/metadata/api/v2/objects/relationship` |
| `VIEW` | `<baseApiUrl>/metadata/api/v2/objects/view/{objectInternalId}` |
| `EXTERNAL_RESOURCE` | `<baseApiUrl>/metadata/api/v2/objects/externalResource/{objectInternalId}` |

## Common use cases

- **Automation:** Generate client code or UI forms from the current data model.
- **Audit & compliance:** Verify tenant structure meets regulatory requirements.
- **Integration:** Map external systems to the SaaS schema.
- **Relationship CRUD:** Obtain `relationship_Internal_ID` before calling Create/Update/Delete Relationship APIs.

## Error handling

- Missing **Object Internal Id** when required throws `B360:CLIENT_ERROR`.
- 4xx → `B360:CLIENT_ERROR`, 5xx → `B360:SERVER_ERROR`, timeouts → `B360:TIMEOUT`.

**Troubleshooting:** 401 — ensure session has Metadata or System Administrator scope. 404 — verify Object Internal Id (e.g. use DATAMODEL to discover ids).

## See Also

- [Operations Overview](./) — All available operations
- [Http Request](./http-request) — Call any B360 endpoint with custom headers
- [Set Up Guide](../set-up) — Authentication and configuration
