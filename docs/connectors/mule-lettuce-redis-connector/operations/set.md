---
title: Set Commands — Lettuce Redis Connector
description: Reference for set Redis commands in the Mule Lettuce Redis Connector
---

# Set Commands

Set commands operate on Redis sets — unordered collections of unique strings. Sets are useful for membership testing, removing duplicates, and set algebra operations.

This page covers: **SADD**, **SCARD**, **SDIFF**, **SISMEMBER**, **SMEMBERS**, **SMISMEMBER**, **SPOP**, **SRANDMEMBER**, **SREM**, **SSCAN**

---

## SADD

Add one or more members to a set.

> 📘 **Redis Reference**: [SADD](https://redis.io/docs/latest/commands/sadd/)

### XML Example

```xml
<lettuce-redis:sadd doc:name="Add tags"
    config-ref="Redis_Config"
    key="article:123:tags"
    members="#[['redis', 'mulesoft', 'integration', 'tutorial']]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |
| `members` | List\<String\> | Yes | — | Members to add. Payload by default via `@Content`. |

### Output

**Type**: `Long`

The number of members **actually added** to the set. Members that were already in the set are not counted.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SREM

Remove one or more members from a set.

> 📘 **Redis Reference**: [SREM](https://redis.io/docs/latest/commands/srem/)

### XML Example

```xml
<lettuce-redis:srem doc:name="Remove tags"
    config-ref="Redis_Config"
    key="article:123:tags"
    members="#[['draft', 'incomplete']]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |
| `members` | List\<String\> | Yes | — | Members to remove. Payload by default via `@Content`. |

### Output

**Type**: `Long`

The number of members removed from the set. Members that were not in the set are not counted.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SMEMBERS

Get all members of a set.

> 📘 **Redis Reference**: [SMEMBERS](https://redis.io/docs/latest/commands/smembers/)

### XML Example

```xml
<lettuce-redis:smembers doc:name="Get all tags"
    config-ref="Redis_Config"
    key="article:123:tags"/>

<!-- payload is now a List<String> of all members -->
<foreach collection="#[payload]">
    <logger level="INFO" message="Tag: #[payload]"/>
</foreach>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |

### Output

**Type**: `List<String>`

All members of the set. Returns an empty list if the set does not exist.

::: warning Large Sets
For sets with many members, consider using [Search Set Members](./search-operations#search-set-members) which streams results incrementally via SSCAN.
:::

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SISMEMBER

Check if a value is a member of a set.

> 📘 **Redis Reference**: [SISMEMBER](https://redis.io/docs/latest/commands/sismember/)

### XML Example

```xml
<lettuce-redis:sismember doc:name="Check if user is admin"
    config-ref="Redis_Config"
    key="users:admins"
    member="user:123"/>

<choice>
    <when expression="#[payload == true]">
        <flow-ref name="admin-flow"/>
    </when>
    <otherwise>
        <flow-ref name="standard-user-flow"/>
    </otherwise>
</choice>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |
| `member` | String | Yes | — | The member to test |

### Output

**Type**: `Boolean`

- `true` if the member is in the set
- `false` if the member is not in the set or the set does not exist

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SMISMEMBER

Check if multiple values are members of a set.

> 📘 **Redis Reference**: [SMISMEMBER](https://redis.io/docs/latest/commands/smismember/)

### XML Example

```xml
<lettuce-redis:smismember doc:name="Check multiple permissions"
    config-ref="Redis_Config"
    key="user:123:permissions"
    members="#[['read', 'write', 'delete', 'admin']]"/>

<!-- payload is now a List<Boolean> with results in the same order as the input -->
<set-variable variableName="permissions"
    value="#[{read: payload[0], write: payload[1], delete: payload[2], admin: payload[3]}]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |
| `members` | List\<String\> | Yes | — | Members to test. Payload by default via `@Content`. |

### Output

**Type**: `List<Boolean>`

A list of boolean values, one for each input member, in the same order. Each value is:
- `true` if the corresponding member is in the set
- `false` if the corresponding member is not in the set

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SCARD

Get the number of members in a set (cardinality).

> 📘 **Redis Reference**: [SCARD](https://redis.io/docs/latest/commands/scard/)

### XML Example

```xml
<lettuce-redis:scard doc:name="Count active sessions"
    config-ref="Redis_Config"
    key="sessions:active"/>

<logger level="INFO" message="Active sessions: #[payload]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |

### Output

**Type**: `Long`

The number of members in the set. Returns `0` if the set does not exist.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SDIFF

Compute the difference between the first set and all subsequent sets.

> 📘 **Redis Reference**: [SDIFF](https://redis.io/docs/latest/commands/sdiff/)

### XML Example

```xml
<!-- Find users who have read permission but not write permission -->
<lettuce-redis:sdiff doc:name="Find read-only users"
    config-ref="Redis_Config"
    key="permissions:read"
    keys="#[['permissions:write']]"/>

<!-- payload contains members in "read" but not in "write" -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The first set (base set) |
| `keys` | List\<String\> | Yes | — | Additional sets to subtract from the first set |

### Output

**Type**: `List<String>`

Members that are in the first set but not in any of the other sets.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | One of the keys is not a set |

---

## SPOP

Remove and return one or more random members from a set.

> 📘 **Redis Reference**: [SPOP](https://redis.io/docs/latest/commands/spop/)

### XML Example

```xml
<!-- Pop a single random member -->
<lettuce-redis:spop doc:name="Draw winner"
    config-ref="Redis_Config"
    key="contest:entries"/>
<!-- payload is a String -->

<!-- Pop multiple random members -->
<lettuce-redis:spop doc:name="Draw three winners"
    config-ref="Redis_Config"
    key="contest:entries"
    count="3"/>
<!-- payload is a List<String> -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |
| `count` | Integer | No | — | Number of members to pop. When omitted, pops one member. |

### Output

**Type**: `Object` (dynamic, resolved by metadata)

- When `count` is **not** specified: `String` (the single popped member)
- When `count` **is** specified: `List<String>` (the popped members)

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SRANDMEMBER

Get one or more random members from a set without removing them.

> 📘 **Redis Reference**: [SRANDMEMBER](https://redis.io/docs/latest/commands/srandmember/)

### XML Example

```xml
<!-- Get one random member -->
<lettuce-redis:srandmember doc:name="Get random item"
    config-ref="Redis_Config"
    key="products:featured"/>

<!-- Get 5 unique random members -->
<lettuce-redis:srandmember doc:name="Get 5 unique items"
    config-ref="Redis_Config"
    key="products:featured"
    count="5"/>

<!-- Get 10 random members (may include duplicates) -->
<lettuce-redis:srandmember doc:name="Get 10 with duplicates allowed"
    config-ref="Redis_Config"
    key="products:featured"
    count="-10"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key |
| `count` | Integer | No | — | Number of members to return. **Positive** = unique results; **Negative** = duplicates allowed. |

### Output

**Type**: `List<String>`

Random members from the set. If `count` is not specified, returns a single-element list.

::: info Count Sign Matters
- **Positive `count`**: Returns up to `count` **unique** members (no duplicates)
- **Negative `count`**: Returns exactly `abs(count)` members, **duplicates allowed**
:::

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |

---

## SSCAN

Incrementally iterate set members using a cursor.

> 📘 **Redis Reference**: [SSCAN](https://redis.io/docs/latest/commands/sscan/)

::: tip Automated Cursor Management
For most use cases, consider using [Search Set Members](./search-operations#search-set-members) instead, which handles cursor iteration automatically and streams all members. Use SSCAN directly only when you need fine-grained control over pagination.
:::

### XML Example

```xml
<!-- Start a new scan (cursor 0) -->
<lettuce-redis:sscan doc:name="Scan set members"
    config-ref="Redis_Config"
    key="users:active"
    cursor="0"
    match="user:*"
    count="100"/>

<!-- payload contains a List<String> of members from this page -->
<!-- attributes.cursor contains the next cursor value -->
<logger level="INFO" message="Next cursor: #[attributes.cursor]"/>

<!-- Continue scanning with the next cursor -->
<lettuce-redis:sscan doc:name="Scan next page"
    config-ref="Redis_Config"
    key="users:active"
    cursor="#[attributes.cursor]"
    match="user:*"
    count="100"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The set key to scan |
| `cursor` | Integer | Yes | — | Cursor position. Use `0` to start a new scan. |
| `match` | String | No | — | Glob-style pattern to filter members |
| `count` | Integer | No | — | Hint for the number of elements to return per iteration |

### Output

**Type**: `List<String>`

A list of members matching the pattern for this scan iteration.

**Attributes**: `ScanAttributes` — Contains the `cursor` field with the next cursor value. When `cursor` is `0`, the scan is complete.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a set |
