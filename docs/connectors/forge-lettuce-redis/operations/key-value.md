---
title: Key / Value Commands — Lettuce Redis Connector
description: Reference for key/value Redis commands in the Mule Lettuce Redis Connector
---

# Key / Value Commands

Key/Value commands operate on Redis string values — the most basic Redis data type. Strings can hold any kind of data: text, JSON, serialized objects, or binary data.

This page covers: **APPEND**, **COPY**, **DECR**, **DEL**, **EXPIRE**, **GET**, **GETDEL**, **GETEX**, **GETRANGE**, **GETSET**, **INCR**, **MGET**, **MSET**, **PERSIST**, **PEXPIRE**, **PTTL**, **SCAN**, **SET**, **TOUCH**, **TTL**

---

## SET

Set a key to hold a string value, with optional expiry and conditional flags.

> 📘 **Redis Reference**: [SET](https://redis.io/docs/latest/commands/set/)

### XML Example

```xml
<!-- Simple SET -->
<lettuce-redis:set doc:name="Set greeting"
    config-ref="Redis_Config"
    key="greeting"
    value="Hello, world!"/>

<!-- SET with expiry and conditional flags -->
<lettuce-redis:set doc:name="Set session with TTL"
    config-ref="Redis_Config"
    key="session:12345"
    value='{"userId": "user123", "loginTime": "2024-01-15T10:30:00Z"}'
    ex="3600"
    nx="true"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to set |
| `value` | String | Yes | — | The value to store (payload by default via `@Content`) |
| `xx` | boolean | No | `false` | Only set if key already exists |
| `nx` | boolean | No | `false` | Only set if key does NOT exist (use for "create if not exists" semantics) |
| `get` | boolean | No | `false` | Return the old value before setting the new one |
| `ex` | Integer | No | — | Expiry time in seconds |
| `px` | Integer | No | — | Expiry time in milliseconds |
| `exat` | Integer | No | — | Expiry as Unix timestamp in seconds |
| `pxat` | Integer | No | — | Expiry as Unix timestamp in milliseconds |
| `keepttl` | boolean | No | `false` | Retain the existing TTL (if key already exists with a TTL) |

::: info Mutually Exclusive TTL Options
Only one of `ex`, `px`, `exat`, `pxat`, or `keepttl` should be specified. The Redis server enforces this constraint.
:::

### Output

**Type**: `String` (media type: `text/plain`)

- Returns `"OK"` when the operation succeeds
- Returns the old value if `get="true"` was specified

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

---

## GET

Retrieve the string value of a key.

> 📘 **Redis Reference**: [GET](https://redis.io/docs/latest/commands/get/)

### XML Example

```xml
<lettuce-redis:get doc:name="Get user session"
    config-ref="Redis_Config"
    key="session:12345"/>

<!-- payload now contains the session JSON string -->
<logger level="INFO" message="Session: #[payload]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to retrieve |

### Output

**Type**: `String` (media type: `text/plain`)

The value stored at the key.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:NIL` | Key does not exist |
| `REDIS:COMMAND` | General command execution error |

::: warning GET Throws on Missing Keys
If the key does not exist, GET throws a `REDIS:NIL` error rather than returning `null`. Use error handling to manage missing keys gracefully.
:::

**Error handling pattern:**

```xml
<try>
    <lettuce-redis:get config-ref="Redis_Config" key="user:profile"/>
    <logger level="INFO" message="Profile found: #[payload]"/>

    <error-handler>
        <on-error-continue type="REDIS:NIL">
            <logger level="WARN" message="User profile not found"/>
            <set-payload value="#[null]"/>
        </on-error-continue>
    </error-handler>
</try>
```

---

## MGET

Retrieve the values of multiple keys in a single operation.

> 📘 **Redis Reference**: [MGET](https://redis.io/docs/latest/commands/mget/)

::: tip MGET Implementation Note
This operation is fully implemented and working, but is not listed in the connector's README. It is safe to use in production.
:::

### XML Example

```xml
<lettuce-redis:mget doc:name="Get multiple user fields"
    config-ref="Redis_Config"
    keys="#[['user:123:name', 'user:123:email', 'user:123:status']]"/>

<!-- payload is now a List<String> with values in the same order as keys -->
<!-- Missing keys appear as null in the list -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | List\<String\> | Yes | — | One or more keys to retrieve. At least one required. |

### Output

**Type**: `List<String>`

A list of values in the same order as the input keys. If a key does not exist or holds the wrong type, the corresponding list entry is `null`.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No keys provided |
| `REDIS:COMMAND` | General command execution error |

---

## MSET

Set multiple key-value pairs atomically.

> 📘 **Redis Reference**: [MSET](https://redis.io/docs/latest/commands/mset/)

### XML Example

```xml
<lettuce-redis:mset doc:name="Set multiple user fields"
    config-ref="Redis_Config"
    keyValues="#[{'user:123:name': 'Alice', 'user:123:email': 'alice@example.com', 'user:123:status': 'active'}]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keyValues` | Map\<String, String\> | Yes | — | Map of key-value pairs to set. Payload by default via `@Content`. |

### Output

**Type**: `Void`

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

---

## APPEND

Append a string to the value of a key. If the key does not exist, it is created with the appended string as its value.

> 📘 **Redis Reference**: [APPEND](https://redis.io/docs/latest/commands/append/)

### XML Example

```xml
<lettuce-redis:append doc:name="Append to log"
    config-ref="Redis_Config"
    key="system:log"
    value="#['\n' ++ now() ++ ': User logged in']"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to append to |
| `value` | String | Yes | — | The string to append (payload by default via `@Content`) |

### Output

**Type**: `Long`

The new total length of the string after appending.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:WRONG_TYPE` | Key exists but holds a non-string value |
| `REDIS:COMMAND` | General command execution error |

---

## INCR

Increment the integer value of a key by 1.

> 📘 **Redis Reference**: [INCR](https://redis.io/docs/latest/commands/incr/)

### XML Example

```xml
<lettuce-redis:incr doc:name="Increment page views"
    config-ref="Redis_Config"
    key="page:views:home"/>

<!-- payload is now the new value after increment -->
<logger level="INFO" message="Page views: #[payload]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key whose value to increment |

### Output

**Type**: `Long`

The value of the key after incrementing.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:WRONG_TYPE` | Key exists but does not hold a string representation of an integer |
| `REDIS:COMMAND` | General command execution error |

---

## DECR

Decrement the integer value of a key by 1.

> 📘 **Redis Reference**: [DECR](https://redis.io/docs/latest/commands/decr/)

### XML Example

```xml
<lettuce-redis:decr doc:name="Decrement rate limit"
    config-ref="Redis_Config"
    key="ratelimit:user:123"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key whose value to decrement |

### Output

**Type**: `Long`

The value of the key after decrementing.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:WRONG_TYPE` | Key exists but does not hold an integer value |
| `REDIS:COMMAND` | General command execution error |

---

## DEL

Delete one or more keys.

> 📘 **Redis Reference**: [DEL](https://redis.io/docs/latest/commands/del/)

### XML Example

```xml
<lettuce-redis:del doc:name="Delete session keys"
    config-ref="Redis_Config"
    keys="#[['session:12345', 'session:12346', 'session:12347']]"/>

<!-- payload is the number of keys actually deleted -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | List\<String\> | Yes | — | One or more keys to delete |

### Output

**Type**: `Long`

The number of keys that were deleted. Keys that did not exist are not counted.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

---

## EXPIRE

Set a key's time to live (TTL) in seconds, with optional conditional flags.

> 📘 **Redis Reference**: [EXPIRE](https://redis.io/docs/latest/commands/expire/)

### XML Example

```xml
<!-- Set 1-hour expiry on a cache key -->
<lettuce-redis:expire doc:name="Expire cache"
    config-ref="Redis_Config"
    key="cache:product:123"
    seconds="3600"/>

<!-- Only set expiry if no TTL currently exists -->
<lettuce-redis:expire doc:name="Expire if no TTL"
    config-ref="Redis_Config"
    key="cache:product:123"
    seconds="3600"
    nx="true"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to set expiry on |
| `seconds` | Integer | Yes | — | TTL in seconds |
| `nx` | boolean | No | `false` | Only set expiry if key currently has no TTL |
| `xx` | boolean | No | `false` | Only set expiry if key already has a TTL |
| `gt` | boolean | No | `false` | Only set expiry if new TTL is greater than current TTL |
| `lt` | boolean | No | `false` | Only set expiry if new TTL is less than current TTL |

### Output

**Type**: `Boolean`

- `true` if the expiry was set
- `false` if the expiry was not set (key doesn't exist or conditional flag prevented the operation)

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | Invalid combination of conditional flags |
| `REDIS:COMMAND` | General command execution error |

---

## PEXPIRE

Set a key's time to live (TTL) in milliseconds.

> 📘 **Redis Reference**: [PEXPIRE](https://redis.io/docs/latest/commands/pexpire/)

### XML Example

```xml
<lettuce-redis:pexpire doc:name="Expire in 500ms"
    config-ref="Redis_Config"
    key="temp:token:xyz"
    milliseconds="500"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to set expiry on |
| `milliseconds` | Integer | Yes | — | TTL in milliseconds |
| `nx` | boolean | No | `false` | Only set expiry if key currently has no TTL |
| `xx` | boolean | No | `false` | Only set expiry if key already has a TTL |
| `gt` | boolean | No | `false` | Only set expiry if new TTL > current TTL |
| `lt` | boolean | No | `false` | Only set expiry if new TTL < current TTL |

### Output

**Type**: `Boolean`

- `true` if the expiry was set
- `false` otherwise

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | Invalid combination of conditional flags |
| `REDIS:COMMAND` | General command execution error |

---

## PERSIST

Remove the expiration from a key, making it persistent.

> 📘 **Redis Reference**: [PERSIST](https://redis.io/docs/latest/commands/persist/)

### XML Example

```xml
<lettuce-redis:persist doc:name="Make session persistent"
    config-ref="Redis_Config"
    key="session:12345"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to remove expiry from |

### Output

**Type**: `Boolean`

- `true` if the TTL was removed
- `false` if the key does not exist or had no TTL

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

---

## TTL

Get the remaining time to live (TTL) of a key in seconds.

> 📘 **Redis Reference**: [TTL](https://redis.io/docs/latest/commands/ttl/)

### XML Example

```xml
<lettuce-redis:ttl doc:name="Check session TTL"
    config-ref="Redis_Config"
    key="session:12345"/>

<choice>
    <when expression="#[payload &gt; 300]">
        <logger level="INFO" message="Session has plenty of time remaining"/>
    </when>
    <when expression="#[payload == -1]">
        <logger level="WARN" message="Session has no expiry set"/>
    </when>
    <when expression="#[payload == -2]">
        <logger level="ERROR" message="Session key does not exist"/>
    </when>
    <otherwise>
        <logger level="WARN" message="Session expires soon: #[payload] seconds"/>
    </otherwise>
</choice>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to inspect |

### Output

**Type**: `Long`

- Remaining TTL in seconds (positive value)
- `-1` if the key exists but has no associated expiry
- `-2` if the key does not exist

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

---

## PTTL

Get the remaining time to live (TTL) of a key in milliseconds.

> 📘 **Redis Reference**: [PTTL](https://redis.io/docs/latest/commands/pttl/)

### XML Example

```xml
<lettuce-redis:pttl doc:name="Check rate limit TTL"
    config-ref="Redis_Config"
    key="ratelimit:user:123"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to inspect |

### Output

**Type**: `Long`

- Remaining TTL in milliseconds (positive value)
- `-1` if the key exists but has no TTL
- `-2` if the key does not exist

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

---

## GETRANGE

Get a substring of the value stored at a key.

> 📘 **Redis Reference**: [GETRANGE](https://redis.io/docs/latest/commands/getrange/)

### XML Example

```xml
<!-- Get first 10 characters -->
<lettuce-redis:getrange doc:name="Get prefix"
    config-ref="Redis_Config"
    key="document:text"
    start="0"
    end="9"/>

<!-- Get last 5 characters (negative indices count from end) -->
<lettuce-redis:getrange doc:name="Get suffix"
    config-ref="Redis_Config"
    key="document:text"
    start="-5"
    end="-1"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to read from |
| `start` | Integer | Yes | — | Start index (inclusive, 0-based). Negative values count from the end. |
| `end` | Integer | Yes | — | End index (inclusive). Negative values count from the end. |

### Output

**Type**: `String` (media type: `text/plain`)

The substring of the stored value.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:NIL` | Key does not exist |
| `REDIS:WRONG_TYPE` | Key exists but holds a non-string value |
| `REDIS:COMMAND` | General command execution error |

---

## GETDEL

Atomically get the value of a key and delete it.

> 📘 **Redis Reference**: [GETDEL](https://redis.io/docs/latest/commands/getdel/)

### XML Example

```xml
<lettuce-redis:getdel doc:name="Get and delete OTP"
    config-ref="Redis_Config"
    key="otp:user:123"/>

<!-- payload now contains the OTP value, and the key is deleted -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to get and delete |

### Output

**Type**: `String` (media type: `text/plain`)

The value before deletion.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:NIL` | Key does not exist |
| `REDIS:WRONG_TYPE` | Key exists but holds a non-string value |
| `REDIS:COMMAND` | General command execution error |

---

## GETEX

Get the value of a key and optionally set or update its expiration.

> 📘 **Redis Reference**: [GETEX](https://redis.io/docs/latest/commands/getex/)

### XML Example

```xml
<!-- Get value and set 10-minute expiry -->
<lettuce-redis:getex doc:name="Get and refresh TTL"
    config-ref="Redis_Config"
    key="session:12345"
    ex="600"/>

<!-- Get value and remove expiry -->
<lettuce-redis:getex doc:name="Get and persist"
    config-ref="Redis_Config"
    key="session:12345"
    persist="true"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to get |
| `ex` | Long | No | — | Set expiry in seconds |
| `px` | Long | No | — | Set expiry in milliseconds |
| `exat` | Long | No | — | Set expiry as Unix timestamp in seconds |
| `pxat` | Long | No | — | Set expiry as Unix timestamp in milliseconds |
| `persist` | boolean | No | `false` | Remove the TTL |

::: info Mutually Exclusive Parameters
Only one of `ex`, `px`, `exat`, `pxat`, or `persist` should be specified. The Redis server enforces this constraint.
:::

### Output

**Type**: `String` (media type: `text/plain`)

The current value of the key.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:NIL` | Key does not exist |
| `REDIS:COMMAND` | General command execution error |

---

## GETSET

Set a key to a new value and return the old value.

> 📘 **Redis Reference**: [GETSET](https://redis.io/docs/latest/commands/getset/)

### XML Example

```xml
<lettuce-redis:getset doc:name="Swap value"
    config-ref="Redis_Config"
    key="current:leader"
    value="node-02"/>

<!-- payload now contains the previous leader ID -->
<logger level="INFO" message="Previous leader: #[payload]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The key to set |
| `value` | String | Yes | — | The new value to store (payload by default via `@Content`) |

### Output

**Type**: `String` (media type: `text/plain`)

The old value before the SET operation. Returns `null` if the key did not exist.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:WRONG_TYPE` | Key exists but holds a non-string value |
| `REDIS:COMMAND` | General command execution error |

---

## COPY

Copy a key to a new key, optionally to a different database.

> 📘 **Redis Reference**: [COPY](https://redis.io/docs/latest/commands/copy/)

### XML Example

```xml
<lettuce-redis:copy doc:name="Backup user data"
    config-ref="Redis_Config"
    source="user:123"
    destination="user:123:backup"
    replace="true"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source` | String | Yes | — | Source key to copy from |
| `destination` | String | Yes | — | Destination key to copy to |
| `destinationDb` | Integer | No | — | Target database index (if copying to a different database) |
| `replace` | boolean | No | `false` | Overwrite destination if it already exists |

### Output

**Type**: `Boolean`

- `true` if the key was copied
- `false` if the source key does not exist or destination exists and `replace=false`

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

---

## TOUCH

Update the last access time of one or more keys without changing their values.

> 📘 **Redis Reference**: [TOUCH](https://redis.io/docs/latest/commands/touch/)

### XML Example

```xml
<lettuce-redis:touch doc:name="Touch session keys"
    config-ref="Redis_Config"
    keys="#[['session:12345', 'session:12346']]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | List\<String\> | Yes | — | One or more keys to touch |

### Output

**Type**: `Void`

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No keys provided |
| `REDIS:COMMAND` | General command execution error |

---

## SCAN

Incrementally iterate the keyspace using a cursor.

> 📘 **Redis Reference**: [SCAN](https://redis.io/docs/latest/commands/scan/)

::: tip Automated Cursor Management
For most use cases, consider using [Search Keys](./search-operations#search-keys) instead, which handles cursor iteration automatically and streams all matching keys. Use SCAN directly only when you need fine-grained control over pagination.
:::

### XML Example

```xml
<!-- Start a new scan (cursor 0) -->
<lettuce-redis:scan doc:name="Scan for user keys"
    config-ref="Redis_Config"
    cursor="0"
    match="user:*"
    count="100"/>

<!-- payload contains keys from this page -->
<!-- attributes.cursor contains the next cursor value -->
<logger level="INFO" message="Next cursor: #[attributes.cursor]"/>

<!-- Continue scanning with the next cursor -->
<lettuce-redis:scan doc:name="Scan next page"
    config-ref="Redis_Config"
    cursor="#[attributes.cursor]"
    match="user:*"
    count="100"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `cursor` | Integer | Yes | — | Cursor position. Use `0` to start a new scan. |
| `match` | String | No | — | Glob-style pattern to filter keys (e.g., `user:*`, `product:*:cache`) |
| `count` | Integer | No | — | Hint for the number of elements to return. Redis may return more or fewer. |
| `type` | String | No | — | Filter by Redis type (`string`, `list`, `set`, `zset`, `hash`, `stream`) |

### Output

**Type**: `List<String>`

A list of keys matching the pattern for this scan iteration.

**Attributes**: `ScanAttributes` — Contains the `cursor` field with the next cursor value. When `cursor` is `0`, the scan is complete.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |

### Manual Cursor Iteration Pattern

```xml
<flow name="manual-scan-iteration">
    <set-variable variableName="cursor" value="#[0]"/>
    <set-variable variableName="allKeys" value="#[[]]"/>

    <until-successful maxRetries="1000">
        <lettuce-redis:scan
            config-ref="Redis_Config"
            cursor="#[vars.cursor]"
            match="session:*"
            count="100"/>

        <!-- Collect keys from this page -->
        <set-variable variableName="allKeys"
            value="#[vars.allKeys ++ payload]"/>

        <!-- Update cursor for next iteration -->
        <set-variable variableName="cursor"
            value="#[attributes.cursor]"/>

        <!-- Stop when cursor returns to 0 -->
        <choice>
            <when expression="#[vars.cursor == 0]">
                <raise-error type="SCAN:COMPLETE"/>
            </when>
        </choice>
    </until-successful>

    <logger level="INFO"
        message="Scanned #[sizeOf(vars.allKeys)] keys"/>
</flow>
```
