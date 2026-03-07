---
title: INFA MDM - Master Search
description: Search across business entities in Informatica MDM Business 360
---

# INFA MDM - Master Search

Searches master (golden) records in B360 via the [Search API](https://onlinehelp.informatica.com/IICS/prod/b360/en/wz-b360-rest-api/Search_API.html), with support for full-text search, field-level search, filtering, sorting, and pagination. Supports English and Japanese locales.

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
| `entityType` | String | Yes | Business Entity Internal Id (value provider drop-down, e.g. `c360.person`, `c360.organization`) |
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

#### Fuzzy search patterns (SAAS Search Scenarios)

Extended patterns useful for MCP/agent planning and rich search UX. Source: [SAAS Search Scenarios](https://knowledge.informatica.com/s/article/SAAS-Search-Scenario-s?language=en_US&type=external).

| Example search string | Search behaviour |
|------------------------|------------------|
| `John Smith` | Records that contain John, Smith, or any variations of John or Smith as a field value. |
| `"John Smith"` | Records that contain John Smith as a field value. |
| `John*` | Records that contain a value that starts with John (e.g. Johnson, Johnny). |
| `Jo*n` | Values that start with Jo and end with n (e.g. Johansson, Jordan). |
| `*` | Returns all records. |
| `Jo?n` | Single character between Jo and n (e.g. John, Joan). Use `?` multiple times per word. |
| `The Washington Post` | Stopword *The* is ignored; searches Washington, Post, or variations. |
| `-John*` | Records that do **not** start with John or variations (e.g. Johnson, Johnny). |
| `+Manager +Janet*` | Records containing Manager and a value starting with Janet (e.g. Janet Williams, designation Manager). |
| `Joan~` | Similar values; up to two characters can differ (e.g. John, Donn). |
| `Hans && Williams` | Records containing both Hans and Williams in the same record. |
| `(Janet* \|\| John*) && Manager` | Manager and any variation of Janet or John (e.g. Johnny + Manager). |
| `/Joan_([0-9]+)/` | Joan_ followed by digits (e.g. Joan_123). Slashes escape the pattern. |

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

## See Also

- [Operations Overview](./) — All available operations
- [Design Concept](../concept) — Why these operation names?
- [Master Read](./master-read) — Read a specific master record
- [Source Read](./source-read) — Read cross-reference records
- [Set Up Guide](../set-up) — Installation and configuration
