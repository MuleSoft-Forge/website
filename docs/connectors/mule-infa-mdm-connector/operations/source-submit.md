---
title: INFA MDM - Source Submit
description: Create or update a source record in Informatica MDM Business 360
---

# INFA MDM - Source Submit

Submits source system data to B360 for matching and consolidation. The MDM engine decides whether to create a new master record, merge with an existing one, or hold the record for approval.

**Informatica docs:** [Business entity record APIs — Create Master Record](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Business_entity_record_APIs.html#ww3_6_40_8_1)

<Hint type="info">

**Why "Source Submit" instead of "Create Master Record"?** The Informatica API calls this "Create Master Record," but the operation always requires a **source system**. You are submitting source data; the MDM engine decides whether to create, merge, or hold for approval. The name "Submit" sets the right expectation: the caller sends data, the system makes the decision. See [Design Concept](../concept) for the full naming rationale.

</Hint>

## Parameters

### Source Record (Required)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessEntity` | String | Yes | Business Entity Internal Id (value provider drop-down, e.g. `c360.person`) |
| `sourceSystem` | String | Yes | Source system name (value provider drop-down, scoped to entity) |
| `sourcePKey` | String | No | Source primary key. If omitted, B360 creates a new record. |
| `businessId` | String | No | B360 master record ID. Used to associate the source record with an existing master. |

### Record Payload (Required)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | Object | Yes | Record data as a JSON object, Map, or List. Serialized to JSON for the API request. Input metadata is resolved dynamically from the B360 datamodel. |

### Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `resolveCrosswalk` | boolean | No | false | Standardize picklist values using crosswalk resolution |

## Output

### Payload

Returns a `Map<String, Object>` containing the submitted record response from B360:

```json
{
    "approvalRequired": false,
    "id": "9991234567890123",
    "businessId": "999456789222123"
}
```

### Attributes — `SourceSubmitResponseAttributes`

| Attribute | Type | Description |
|-----------|------|-------------|
| `businessId` | String | B360 master record ID (new or existing) |
| `approvalRequired` | boolean | Whether the submission requires approval before merging |
| `statusCode` | Integer | HTTP status code |
| `requestId` | String | B360 request tracking ID |

## Underlying API

**Endpoint**:
```
POST /business-entity/public/api/v1/entity/{businessEntity}?sourceSystem={sourceSystem}
```

Additional query parameters are appended for `sourcePKey` and `businessId` when provided.

## See Also

- [Operations Overview](./) — All available operations
- [Design Concept](../concept) — Why "Source Submit" instead of "Create Master Record"?
- [Source Read](./source-read) — Read cross-reference records
- [Master Read](./master-read) — Read golden master records
- [Set Up Guide](../set-up) — Installation and configuration
