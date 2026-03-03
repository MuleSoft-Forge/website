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

## XML Signature

```xml
<b360:source-submit config-ref="B360_Config"
    businessEntity="Person"
    sourceSystem="CRM"
    sourcePKey="CRM-001">
    <b360:body>#[payload]</b360:body>
</b360:source-submit>
```

## Parameters

### Source Record (Required)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessEntity` | String | Yes | Business entity name (value provider drop-down) |
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

## Examples

### Create a New Source Record

```xml
<b360:source-submit config-ref="B360_Config"
    businessEntity="Person"
    sourceSystem="CRM">
    <b360:body>#[{
        "firstName": "Lewis",
        "lastName": "Hamilton",
        "middleName": "Decay",
        "PostalAddress": [
            {
                "_id": "3d4a8f4d07cb4f0db9ea1be9bf8d27e8",
                "defaultIndicator": true,
                "addressType": { "Name": "Home", "Code": "Home" },
                "addressLine1": "789456, park road",
                "country": { "Name": "United States", "Code": "US" },
                "state": { "Name": "California", "Code": "CA" },
                "city": "California"
            }
        ],
        "Phone": [
            {
                "_id": "f142a11b916c4a1b8239466f15852",
                "phoneType": { "Name": "Mobile", "Code": "Mobile" },
                "phoneNumber": "9900202777"
            }
        ]
    }]</b360:body>
</b360:source-submit>

<logger level="INFO"
    message="Created record with Business ID: #[attributes.businessId], Approval required: #[attributes.approvalRequired]" />
```

::: tip Field Groups
For field groups (e.g. `PostalAddress`, `Phone`), include the `_id` parameter for each entry if the field group has a data quality rule. Picklist fields use `{ "Name": "...", "Code": "..." }` objects.
:::

### Update an Existing Source Record

```xml
<b360:source-submit config-ref="B360_Config"
    businessEntity="Person"
    sourceSystem="CRM"
    sourcePKey="CRM-001">
    <b360:body>#[{
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@newdomain.com",
        "phone": "+1-555-0100"
    }]</b360:body>
</b360:source-submit>
```

### Associate with Existing Master Record

```xml
<b360:source-submit config-ref="B360_Config"
    businessEntity="Person"
    sourceSystem="ERP"
    businessId="12345">
    <b360:body>#[vars.erpRecord]</b360:body>
</b360:source-submit>
```

### With Crosswalk Resolution

```xml
<b360:source-submit config-ref="B360_Config"
    businessEntity="Organization"
    sourceSystem="CRM"
    sourcePKey="CRM-ORG-100"
    resolveCrosswalk="true">
    <b360:body>#[payload]</b360:body>
</b360:source-submit>
```

### Error Handling

```xml
<try>
    <b360:source-submit config-ref="B360_Config"
        businessEntity="Person"
        sourceSystem="CRM"
        sourcePKey="#[vars.sourcePKey]">
        <b360:body>#[payload]</b360:body>
    </b360:source-submit>

    <error-handler>
        <on-error-continue type="B360:CLIENT_ERROR">
            <logger level="ERROR"
                message="Submit rejected: #[error.description]" />
        </on-error-continue>

        <on-error-continue type="B360:SERVER_ERROR">
            <logger level="ERROR"
                message="B360 server error during submit: #[error.description]" />
        </on-error-continue>
    </error-handler>
</try>
```

## See Also

- [Operations Overview](./) — All available operations
- [Design Concept](../concept) — Why "Source Submit" instead of "Create Master Record"?
- [Source Read](./source-read) — Read cross-reference records
- [Master Read](./master-read) — Read golden master records
- [Set Up Guide](../set-up) — Installation and configuration
