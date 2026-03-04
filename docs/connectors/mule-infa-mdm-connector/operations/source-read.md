---
title: INFA MDM - Source Read
description: Read a cross-reference (source) record from Informatica MDM Business 360
---

# INFA MDM - Source Read

Reads a cross-reference (source) record from B360 by Business Entity Internal Id, Source System, and Source Primary Key. This returns a single source system's contribution — not the blended golden record. See [Design Concept](../concept) for the distinction between source records and golden records.

**Informatica docs:** [Source Record API](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Source_record_API.html)

## Parameters

### Source Record (Required)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessEntity` | String | Yes | Business Entity Internal Id (value provider drop-down, e.g. `c360.person`) |
| `sourceSystem` | String | Yes | Source system name (value provider drop-down, scoped to entity) |
| `sourcePKey` | String | Yes | Source primary key |

### Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `resolveCrosswalk` | boolean | No | false | Standardize picklist values using crosswalk resolution |
| `showContentMeta` | boolean | No | false | Include `_contentMeta` in the response |

## Output

### Payload

Returns a `Map<String, Object>` representing the source record, including field data, `_meta`, and optionally `_contentMeta` and `dataEnhancementRule`. The structure is dynamic and matches the selected business entity's datamodel.

The response includes a `states` object with the following statuses:

| State | Example values | Description |
|-------|---------------|-------------|
| `base` | `ACTIVE` | Record lifecycle state |
| `consolidation` | `MATCH_INDEXED`, `CONSOLIDATED` | Match and merge status |
| `searchIndex` | `SEARCH_DIRTY` | Search index status |
| `validation` | `PENDING`, `PASSED`, `FAILED` | Data quality validation status |

When `showContentMeta` is `true`, the response also includes a `_contentMeta` object with trust score and survivorship details.

When a data quality rule applies, the response includes a `dataEnhancementRule` object with a `fail` array listing failed data enhancement rules.

### Attributes — `SourceReadResponseAttributes`

| Attribute | Type | Description |
|-----------|------|-------------|
| `businessId` | String | B360 master record ID this source record contributes to |
| `businessEntity` | String | Business Entity Internal Id |
| `createdBy` | String | User who created the source record |
| `creationDate` | String | Record creation timestamp |
| `updatedBy` | String | User who last updated the record |
| `lastUpdateDate` | String | Last update timestamp |
| `sourceLastUpdatedDate` | String | Last update timestamp from the source system |
| `sourceSystem` | String | Source system name |
| `sourcePrimaryKey` | String | Source primary key |
| `xrefType` | String | Cross-reference type (e.g. `DATA`) |
| `statusCode` | Integer | HTTP status code |
| `requestId` | String | B360 request tracking ID |

## Underlying API

**Endpoint**:
```
GET <baseApiUrl>/business-entity/public/api/v1/entity-xref/{businessEntity}/{sourceSystem}/{sourcePKey}[?_resolveCrosswalk=true][&_showContentMeta=true]
```

::: tip Dependent Drop-downs
The **Business Entity Internal Id** and **Source System** fields use dependent value providers. When you select a Business Entity Internal Id, the Source System drop-down refreshes to show only the source systems configured for that entity in your B360 tenant datamodel.
:::

## See Also

- [Operations Overview](./) — All available operations
- [Design Concept](../concept) — Why these operation names?
- [Master Read](./master-read) — Read golden master records
- [Source Submit](./source-submit) — Create or update source records
- [Set Up Guide](../set-up) — Installation and configuration
