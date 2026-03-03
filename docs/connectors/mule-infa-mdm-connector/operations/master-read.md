---
title: INFA MDM - Master Read
description: Read a golden (master) record from Informatica MDM Business 360
---

# INFA MDM - Master Read

Reads a golden (master) record — the fully blended, survived "Best Version of Truth" — from B360 by Business ID or by Source System and Source Primary Key. This operation combines two Informatica APIs into a single operation with exclusive parameters.

**Informatica docs:** [Read Master Record by Business ID](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Business_entity_record_APIs.html#ww3_6_40_11_1) | [Read Master Record by SourcePKey](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Business_entity_record_APIs.html#ww3_6_40_14_1)

## XML Signature

```xml
<b360:master-read config-ref="B360_Config"
    businessEntity="Person"
    businessId="12345" />
```

## Parameters

### Record Lookup

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessEntity` | String | Yes | Business entity name (value provider drop-down) |
| `businessId` | String | Conditional | B360 master record ID. Required if `sourceSystem` and `sourcePKey` are not provided. |
| `sourceSystem` | String | Conditional | Source system name. Required (with `sourcePKey`) if `businessId` is not provided. |
| `sourcePKey` | String | Conditional | Source primary key. Required (with `sourceSystem`) if `businessId` is not provided. |

::: tip Exclusive Optionals
The parameter group uses `@ExclusiveOptionals(isOneRequired = true)`. You **must** provide one of:
1. **By Business ID**: `businessEntity` + `businessId`
2. **By Source Key**: `businessEntity` + `sourceSystem` + `sourcePKey`

Both paths return the same master record shape.
:::

### Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `skipLookup` | boolean | No | false | Use cached values for picklist lookups |
| `showContentMeta` | boolean | No | false | Include `_contentMeta` in the response |
| `showPending` | boolean | No | false | Return only pending (unmerged) records |

## Output

### Payload

Returns a `Map<String, Object>` representing the master record, including field data and `_meta`. The structure is dynamic and matches the selected business entity's datamodel.

When `showContentMeta` is `true`, the response also includes a `_contentMeta` section with trust score, survivorship, and data enhancement rule details.

The response includes a `states` object (within `_meta`) with the following statuses:

| State | Example values | Description |
|-------|---------------|-------------|
| `base` | `ACTIVE`, `INACTIVE`, `PENDING` | Record lifecycle state |
| `validation` | `PENDING`, `PASSED`, `FAILED`, `IN_PROGRESS` | Data quality validation status |
| `consolidation` | `MATCH_INDEXED`, `CONSOLIDATED` | Match and merge status |

### Attributes — `MasterReadResponseAttributes`

| Attribute | Type | Description |
|-----------|------|-------------|
| `businessId` | String | B360 master record ID |
| `businessEntity` | String | Business entity name |
| `state` | String | Record lifecycle state (e.g. `ACTIVE`) |
| `validation` | String | Validation status (e.g. `PASSED`, `FAILED`, `PENDING`) |
| `consolidation` | String | Consolidation status (e.g. `CONSOLIDATED`) |
| `createdBy` | String | User who created the record |
| `creationDate` | String | Record creation timestamp |
| `updatedBy` | String | User who last updated the record |
| `lastUpdateDate` | String | Last update timestamp |
| `statusCode` | Integer | HTTP status code |
| `requestId` | String | B360 request tracking ID |

## Underlying API

**Endpoint (by Business ID)**:
```
GET /business-entity/public/api/v1/entity/{businessEntity}/{businessId}
```

**Endpoint (by Source Key)**:
```
GET /business-entity/public/api/v1/entity/{businessEntity}/{sourceSystem}/{sourcePKey}
```

## Examples

### Read by Business ID

```xml
<b360:master-read config-ref="B360_Config"
    businessEntity="Person"
    businessId="12345" />

<logger level="INFO"
    message="Record: #[payload] | Status: #[attributes.state]" />
```

### Read by Source System Key

```xml
<b360:master-read config-ref="B360_Config"
    businessEntity="Person"
    sourceSystem="CRM"
    sourcePKey="CRM-001" />

<logger level="INFO"
    message="Business ID: #[attributes.businessId]" />
```

### With Content Metadata

```xml
<b360:master-read config-ref="B360_Config"
    businessEntity="Organization"
    businessId="67890"
    showContentMeta="true" />
```

### Error Handling

```xml
<try>
    <b360:master-read config-ref="B360_Config"
        businessEntity="Person"
        businessId="#[vars.recordId]" />

    <error-handler>
        <on-error-continue type="B360:CLIENT_ERROR">
            <logger level="WARN"
                message="Record not found: #[error.description]" />
        </on-error-continue>

        <on-error-continue type="B360:TIMEOUT">
            <logger level="ERROR"
                message="B360 timed out reading master record" />
        </on-error-continue>
    </error-handler>
</try>
```

## See Also

- [Operations Overview](./) — All available operations
- [Design Concept](../concept) — Why these operation names?
- [Search](./search) — Search across business entities
- [Source Read](./source-read) — Read cross-reference records
- [Set Up Guide](../set-up) — Installation and configuration
