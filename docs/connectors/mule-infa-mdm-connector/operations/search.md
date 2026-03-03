---
title: INFA MDM - Master Search
description: Search across business entities in Informatica MDM Business 360
---

# INFA MDM - Master Search

Searches master (golden) records in B360 via the [Search API](https://onlinehelp.informatica.com/IICS/prod/b360/en/wz-b360-rest-api/Search_API.html), with support for full-text search, field-level search, filtering, sorting, and pagination. Supports English and Japanese locales.

## XML Signature

```xml
<b360:search config-ref="B360_Config"
    entityType="Person"
    search="John Smith"
    recordsToReturn="10"
    recordOffset="0" />
```

## Parameters

### Pagination

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `recordOffset` | Integer | No | 0 | Number of records to skip (0-based) |
| `recordsToReturn` | Integer | No | — | Number of search results to return |
| `pageSize` | Integer | No | — | Number of search results per page |
| `pageOffset` | Integer | No | 0 | Number of pages to skip |
| `maxRecords` | Integer | No | — | Maximum records to return (max 10,000 per page) |

### Search Criteria (Required)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityType` | String | Yes | Business entity internal ID to search (value provider drop-down, e.g. `c360.person`, `c360.organization`) |
| `search` | String | Conditional | Full-text search query. Mutually exclusive with `fields`. |
| `fields` | Object | Conditional | Search specific fields by name/value (e.g. first name `"J*"`). Mutually exclusive with `search`. |

::: tip Search Modes
- **Full-text search**: Set `search` to a query string (e.g. `"John Smith"`)
- **Field-level search**: Set `fields` to specify which fields to search with specific values
- Use `search` **or** `fields`, not both
:::

### Search String Syntax

The `search` parameter supports fuzzy search, wildcards, and exact matching:

| Search string | Behavior |
|---------------|----------|
| `John Smith` | Records containing *John Smith* as a field value |
| `Jo*n` | Values starting with *Jo* and ending with *n* (e.g. Johansson, Jordan) |
| `Hans && Williams` | Records containing both *Hans* and *Williams* in the same record |
| `*` | All records (typically used with filters) |
| `"\"London\""` | Exact match for the value *London* |

**Supported wildcards:** `*`, `~`, `&&`, `||`

<Hint type="info">

**Dates** must use the `YYYY-MM-DD` format. **Keywords as values** — when searching for the literal words AND, OR, or NOT, specify them as `"\"OR\""`, `"\"AND\""`, `"\"NOT\""`. System fields support only exact match (no fuzzy), but wildcards still work. A search string containing only whitespace returns no results.

</Hint>

### Filter (Optional)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `operator` | SearchFilterOperator | No | — | Logical operator joining filters: `AND` or `OR` |
| `filters` | List&lt;SearchFilterRecord&gt; | No | — | List of filter conditions |

#### SearchFilterRecord

| Field | Type | Description |
|-------|------|-------------|
| `comparator` | SearchFilterComparator | Comparison operator (see below) |
| `fieldName` | String | Field to filter on |
| `fieldValue` | String | Value to compare against |
| `fieldValueGroups` | List&lt;String&gt; | Multiple values (for `IN`, `BETWEEN`) |

#### SearchFilterComparator Values

| Comparator | Description |
|------------|-------------|
| `EQUALS` | Exact match |
| `NOT_EQUALS` | Not equal |
| `IN` | Value in list |
| `CONTAINS` | Substring match |
| `STARTS_WITH` | Prefix match |
| `ENDS_WITH` | Suffix match |
| `IS_MISSING` | Field is null/empty |
| `IS_NOT_MISSING` | Field is not null/empty |
| `BETWEEN` | Range (inclusive) |
| `GREATER_THAN` | Greater than |
| `GREATER_THAN_OR_EQUAL_TO` | Greater than or equal |
| `LESS_THAN` | Less than |
| `LESS_THAN_OR_EQUAL_TO` | Less than or equal |

### Sort (Optional)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sorts` | List&lt;SearchSortRecord&gt; | No | List of sort criteria |

#### SearchSortRecord

| Field | Type | Description |
|-------|------|-------------|
| `fieldName` | String | Field to sort by |
| `order` | SearchSortOrder | `ASCENDING` or `DESCENDING` |

### Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `showContentMeta` | boolean | No | false | Include content metadata in results |
| `searchLocale` | String | No | `en` | Language code for search: `en` (English) or `ja` (Japanese) |

## Output

### Payload

Returns a `List<Object>` of matching records. Each record is a `Map<String, Object>` matching the business entity's datamodel.

### Attributes — `SearchResponseAttributes`

| Attribute | Type | Description |
|-----------|------|-------------|
| `hits` | Integer | Total number of matching records |
| `pageSize` | Integer | Page size used |
| `pageOffset` | Integer | Page offset used |
| `recordsToReturn` | Integer | Records requested |
| `recordOffset` | Integer | Record offset used |
| `maxRecords` | Integer | Maximum records available |
| `statusCode` | Integer | HTTP status code |
| `requestId` | String | B360 request tracking ID |

## Underlying API

**Endpoint**:
```
POST <baseApiUrl>/search/public/api/v1/search
```

The request body is constructed from the pagination, criteria, filter, and sort parameters. The connector uses a PagingProvider and requests subsequent pages by incrementing `recordOffset` until the requested records are returned or the API reports no more results.

<Hint type="warning">

After editing record and field privileges or data access rules, users with custom user roles must wait at least **10 minutes** before searching via the Search REST API. Searching immediately after such changes can return inaccurate results.

</Hint>

See the [Search API documentation](https://onlinehelp.informatica.com/IICS/prod/b360/en/wz-b360-rest-api/Search_API.html) for the full request/response specification.

## Examples

### Full-Text Search

```xml
<b360:search config-ref="B360_Config"
    entityType="Person"
    search="John Smith"
    recordsToReturn="25"
    recordOffset="0" />

<logger level="INFO"
    message="Found #[attributes.hits] results" />

<foreach>
    <logger level="INFO" message="Record: #[payload]" />
</foreach>
```

### Paginated Results

```xml
<!-- Page 1 -->
<b360:search config-ref="B360_Config"
    entityType="Organization"
    search="Acme"
    recordsToReturn="10"
    recordOffset="0" />

<!-- Page 2 -->
<b360:search config-ref="B360_Config"
    entityType="Organization"
    search="Acme"
    recordsToReturn="10"
    recordOffset="10" />
```

### Error Handling

```xml
<try>
    <b360:search config-ref="B360_Config"
        entityType="Person"
        search="#[vars.query]"
        recordsToReturn="50"
        recordOffset="0" />

    <error-handler>
        <on-error-continue type="B360:CLIENT_ERROR">
            <logger level="WARN"
                message="Invalid search request: #[error.description]" />
        </on-error-continue>
    </error-handler>
</try>
```

## See Also

- [Operations Overview](./) — All available operations
- [Design Concept](../concept) — Why these operation names?
- [Master Read](./master-read) — Read a specific master record
- [Source Read](./source-read) — Read cross-reference records
- [Set Up Guide](../set-up) — Installation and configuration
