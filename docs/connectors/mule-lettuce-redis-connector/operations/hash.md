---
title: Hash Commands — Lettuce Redis Connector
description: Reference for hash Redis commands in the Mule Lettuce Redis Connector
---

# Hash Commands

Hash commands operate on Redis hashes — maps between string fields and string values. Hashes are ideal for representing objects with multiple fields.

This page covers: **HEXISTS**, **HGET**, **HGETALL**, **HINCRBY**, **HLEN**, **HMGET**, **HSCAN**, **HSET**

---

## HSET

Set one or more fields in a hash.

> 📘 **Redis Reference**: [HSET](https://redis.io/docs/latest/commands/hset/)

### XML Example

```xml
<!-- Set multiple fields in a user hash -->
<lettuce-redis:hset doc:name="Set user fields"
    config-ref="Redis_Config"
    key="user:123"
    fields="#[{'name': 'Alice Johnson', 'email': 'alice@example.com', 'role': 'admin', 'status': 'active'}]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key |
| `fields` | Map\<String, String\> | Yes | — | Field-value pairs to set. Map must not be empty. Payload by default via `@Content`. |

### Output

**Type**: `Long`

The number of **new** fields added. Updates to existing fields are not counted.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | Fields map is empty |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash |

---

## HGET

Get the value of a hash field.

> 📘 **Redis Reference**: [HGET](https://redis.io/docs/latest/commands/hget/)

### XML Example

```xml
<lettuce-redis:hget doc:name="Get user email"
    config-ref="Redis_Config"
    key="user:123"
    field="email"/>

<!-- payload now contains the email address -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key |
| `field` | String | Yes | — | The field name to retrieve |

### Output

**Type**: `String` (media type: `text/plain`)

The value of the field.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:NIL` | Field does not exist in the hash |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash |

---

## HGETALL

Get all fields and values in a hash.

> 📘 **Redis Reference**: [HGETALL](https://redis.io/docs/latest/commands/hgetall/)

### XML Example

```xml
<lettuce-redis:hgetall doc:name="Get all user fields"
    config-ref="Redis_Config"
    key="user:123"/>

<!-- payload is now a Map<String, String> with all fields and values -->
<logger level="INFO" message="User name: #[payload.name]"/>
<logger level="INFO" message="User email: #[payload.email]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key |

### Output

**Type**: `Map<String, String>`

A map of all field-value pairs in the hash. Returns an empty map if the hash does not exist.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash |

---

## HMGET

Get the values of multiple hash fields.

> 📘 **Redis Reference**: [HMGET](https://redis.io/docs/latest/commands/hmget/)

### XML Example

```xml
<lettuce-redis:hmget doc:name="Get multiple user fields"
    config-ref="Redis_Config"
    key="user:123"
    fieldNames="#[['name', 'email', 'status']]"/>

<!-- payload is now a Map<String, String> with the requested fields -->
<!-- Missing fields appear with null values in the map -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key |
| `fieldNames` | List\<String\> | Yes | — | Field names to retrieve. At least one required. Fields must be defined inline (`allowInlineDefinition=true, allowReferences=false`). |

### Output

**Type**: `Map<String, String>`

A map of field names to values. If a field does not exist in the hash, its value in the map is `null`.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No field names provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash |

---

## HEXISTS

Check if a field exists in a hash.

> 📘 **Redis Reference**: [HEXISTS](https://redis.io/docs/latest/commands/hexists/)

### XML Example

```xml
<lettuce-redis:hexists doc:name="Check if user has phone"
    config-ref="Redis_Config"
    key="user:123"
    field="phone"/>

<choice>
    <when expression="#[payload == true]">
        <logger level="INFO" message="User has a phone number on file"/>
    </when>
    <otherwise>
        <logger level="INFO" message="No phone number for user"/>
    </otherwise>
</choice>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key |
| `field` | String | Yes | — | The field to check |

### Output

**Type**: `Boolean`

- `true` if the field exists in the hash
- `false` if the field does not exist or the hash does not exist

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash |

---

## HLEN

Get the number of fields in a hash.

> 📘 **Redis Reference**: [HLEN](https://redis.io/docs/latest/commands/hlen/)

### XML Example

```xml
<lettuce-redis:hlen doc:name="Count user fields"
    config-ref="Redis_Config"
    key="user:123"/>

<logger level="INFO" message="User has #[payload] fields"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key |

### Output

**Type**: `Long`

The number of fields in the hash. Returns `0` if the hash does not exist.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash |

---

## HINCRBY

Increment the integer value of a hash field by the specified amount.

> 📘 **Redis Reference**: [HINCRBY](https://redis.io/docs/latest/commands/hincrby/)

### XML Example

```xml
<lettuce-redis:hincrby doc:name="Increment user login count"
    config-ref="Redis_Config"
    key="user:123:stats"
    field="loginCount"
    increment="1"/>

<!-- payload is now the new value after increment -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key |
| `field` | String | Yes | — | The field to increment |
| `increment` | Long | Yes | — | The amount to add (can be negative for decrement) |

### Output

**Type**: `Long`

The new value of the field after the increment.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash, or field does not hold an integer value |

---

## HSCAN

Incrementally iterate hash fields using a cursor.

> 📘 **Redis Reference**: [HSCAN](https://redis.io/docs/latest/commands/hscan/)

::: tip Automated Cursor Management
For most use cases, consider using [Search Hash Fields](./search-operations#search-hash-fields) instead, which handles cursor iteration automatically and streams all field-value pairs. Use HSCAN directly only when you need fine-grained control over pagination.
:::

### XML Example

```xml
<!-- Start a new scan (cursor 0) -->
<lettuce-redis:hscan doc:name="Scan hash fields"
    config-ref="Redis_Config"
    key="user:123"
    cursor="0"
    match="setting:*"
    count="50"/>

<!-- payload contains a Map<String, String> of fields from this page -->
<!-- attributes.cursor contains the next cursor value -->
<logger level="INFO" message="Next cursor: #[attributes.cursor]"/>

<!-- Continue scanning with the next cursor -->
<lettuce-redis:hscan doc:name="Scan next page"
    config-ref="Redis_Config"
    key="user:123"
    cursor="#[attributes.cursor]"
    match="setting:*"
    count="50"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The hash key to scan |
| `cursor` | Integer | Yes | — | Cursor position. Use `0` to start a new scan. |
| `match` | String | No | — | Glob-style pattern to filter field names |
| `count` | Integer | No | — | Hint for the number of elements to return per iteration |

### Output

**Type**: `Map<String, String>`

A map of field-value pairs matching the pattern for this scan iteration.

**Attributes**: `ScanAttributes` — Contains the `cursor` field with the next cursor value. When `cursor` is `0`, the scan is complete.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a hash |
