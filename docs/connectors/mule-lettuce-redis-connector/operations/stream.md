---
title: Stream Commands — Lettuce Redis Connector
description: Reference for stream Redis commands in the Mule Lettuce Redis Connector
---

# Stream Commands

Stream commands operate on Redis streams — append-only log data structures designed for messaging and event sourcing. Streams support consumer groups for distributed processing, making them ideal for building scalable message queues and event-driven architectures.

This page covers: **XACK**, **XADD**, **XDEL**, **XGROUP CREATE**, **XGROUP DESTROY**, **XINFO GROUPS**, **XRANGE**, **XREAD**, **XREADGROUP**, **XTRIM**

---

## XADD

Append a new entry to a stream, optionally with automatic eviction to cap stream size.

> 📘 **Redis Reference**: [XADD](https://redis.io/docs/latest/commands/xadd/)

### XML Example

```xml
<!-- Add an entry with auto-generated ID -->
<lettuce-redis:xadd doc:name="Add event"
    config-ref="Redis_Config"
    key="events:orders"
    noMkStream="false"
    entry="#[{orderId: '12345', status: 'created', timestamp: now()}]"/>

<!-- Add with max length eviction (keep last 1000 entries) -->
<lettuce-redis:xadd doc:name="Add with eviction"
    config-ref="Redis_Config"
    key="events:orders"
    noMkStream="false"
    entry="#[{orderId: '12346', status: 'created'}]">
    <lettuce-redis:eviction-option>
        <lettuce-redis:max-len-eviction-option
            maxLength="1000"
            exactTrimming="false"
            limit="100"/>
    </lettuce-redis:eviction-option>
</lettuce-redis:xadd>

<!-- payload is now the generated entry ID (e.g., "1609459200000-0") -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |
| `noMkStream` | boolean | No | `false` | If `true`, do not create the stream if it doesn't exist |
| `id` | String | No | `"*"` | Entry ID. Use `"*"` for auto-generation (recommended). |
| `evictionOption` | StreamEvictionOption | No | — | Eviction policy to cap stream size (MaxLenEvictionOption or MinIdEvictionOption) |
| `entry` | Map\<String, String\> | Yes | — | Field-value pairs for the entry. At least one required. Payload by default via `@Content`. |

**StreamEvictionOption** (choose one):

| Type | Fields |
|------|--------|
| `MaxLenEvictionOption` | `maxLength` (long), `exactTrimming` (boolean, default `true`), `limit` (Integer, optional) |
| `MinIdEvictionOption` | `id` (String), `exactTrimming` (boolean, default `true`), `limit` (Integer, optional) |

**Eviction notes**:
- `exactTrimming=false` allows approximate trimming for better performance
- `limit` caps the number of entries deleted in a single trim operation

### Output

**Type**: `String` (media type: `text/plain`)

The ID of the newly added entry (e.g., `"1609459200000-0"`).

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | Entry map is empty, or invalid ID |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a stream |

---

## XRANGE

Retrieve a range of entries from a stream.

> 📘 **Redis Reference**: [XRANGE](https://redis.io/docs/latest/commands/xrange/)

### XML Example

```xml
<!-- Get all entries -->
<lettuce-redis:xrange doc:name="Get all entries"
    config-ref="Redis_Config"
    key="events:orders"
    start="-"
    end="+"/>

<!-- Get entries in a specific time range, limit to 100 -->
<lettuce-redis:xrange doc:name="Get recent entries"
    config-ref="Redis_Config"
    key="events:orders"
    start="1609459200000"
    end="1609545600000"
    count="100"/>

<!-- payload is a Map<String, Map<String, String>> -->
<!-- Outer map: entry ID -> inner map of field-value pairs -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |
| `start` | String | Yes | — | Range start ID. Use `"-"` for the beginning of the stream. |
| `end` | String | Yes | — | Range end ID. Use `"+"` for the end of the stream. |
| `count` | Integer | No | — | Maximum number of entries to return |

### Output

**Type**: `Map<String, Map<String, String>>`

A map where:
- **Key**: Entry ID (e.g., `"1609459200000-0"`)
- **Value**: Map of field-value pairs for that entry

Example:
```json
{
  "1609459200000-0": {"orderId": "12345", "status": "created"},
  "1609459200001-0": {"orderId": "12346", "status": "created"}
}
```

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | Invalid start or end ID |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a stream |

---

## XREAD

Read entries from one or more streams, optionally blocking until new entries arrive.

> 📘 **Redis Reference**: [XREAD](https://redis.io/docs/latest/commands/xread/)

### XML Example

```xml
<!-- Read new entries from multiple streams -->
<lettuce-redis:xread doc:name="Read from streams"
    config-ref="Redis_Config"
    count="10"
    streamWatermarks="#[[
        {key: 'events:orders', id: '$'},
        {key: 'events:shipments', id: '$'}
    ]]"/>

<!-- Block for up to 5 seconds waiting for new entries -->
<lettuce-redis:xread doc:name="Block and read"
    config-ref="Redis_Config"
    count="10"
    block="5000"
    streamWatermarks="#[[
        {key: 'events:orders', id: '$'}
    ]]"/>

<!-- payload is a Map<String, List<StreamEntry>> -->
<!-- Stream key -> list of entries -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `count` | Integer | No | — | Maximum entries per stream |
| `block` | Integer | No | — | Milliseconds to block waiting for new entries. Omit for non-blocking. |
| `streamWatermarks` | List\<StreamWatermark\> | Yes | — | Stream keys and last-read IDs. At least one required. Use `"0"` to read from the beginning, `"$"` to read only new entries. |

**StreamWatermark structure**:
```dataweave
{
  key: "stream-key",           // String
  id: "$"                      // String (entry ID or special value)
}
```

**Special ID values**:
- `"0"` — Read from the beginning of the stream
- `"$"` — Read only entries added **after** this call

### Output

**Type**: `Map<String, List<StreamEntry>>`

A map where:
- **Key**: Stream key
- **Value**: List of StreamEntry objects

**StreamEntry structure**:
```dataweave
{
  id: "1609459200000-0",             // String
  entry: {orderId: "12345", ...}     // Map<String, String>
}
```

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No stream watermarks provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | One of the keys is not a stream |

---

## XREADGROUP

Read entries from one or more streams as part of a consumer group.

> 📘 **Redis Reference**: [XREADGROUP](https://redis.io/docs/latest/commands/xreadgroup/)

### XML Example

```xml
<!-- Read undelivered entries for this consumer -->
<lettuce-redis:xreadgroup doc:name="Read as consumer"
    config-ref="Redis_Config"
    group="order-processors"
    consumer="worker-01"
    count="10"
    noack="false"
    streamWatermarks="#[[
        {key: 'events:orders', id: '>'}
    ]]"/>

<!-- Block for up to 10 seconds waiting for new entries -->
<lettuce-redis:xreadgroup doc:name="Block and read as consumer"
    config-ref="Redis_Config"
    group="order-processors"
    consumer="worker-01"
    count="5"
    block="10000"
    noack="false"
    streamWatermarks="#[[
        {key: 'events:orders', id: '>'}
    ]]"/>

<!-- payload is a Map<String, List<StreamEntry>> -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `group` | String | Yes | — | Consumer group name |
| `consumer` | String | Yes | — | Consumer name within the group |
| `count` | Long | No | — | Maximum entries per stream |
| `block` | Long | No | — | Milliseconds to block waiting for new entries |
| `noack` | boolean | No | `false` | If `true`, do not track acknowledgment (auto-acknowledge) |
| `streamWatermarks` | List\<StreamWatermark\> | Yes | — | Stream keys and IDs. At least one required. Use `">"` to read undelivered entries. |

**Special ID value for consumer groups**:
- `">"` — Read only entries **not yet delivered** to any consumer in the group

### Output

**Type**: `Map<String, List<StreamEntry>>`

Same structure as XREAD.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No stream watermarks provided, or group/consumer invalid |
| `REDIS:COMMAND` | General command execution error (e.g., group does not exist) |
| `REDIS:WRONG_TYPE` | One of the keys is not a stream |

### Consumer Group Processing Pattern

```xml
<!-- Create consumer group (one-time setup) -->
<lettuce-redis:xgroup-create
    config-ref="Redis_Config"
    key="events:orders"
    group="order-processors"
    lastEntryId="$"
    mkstream="true"/>

<!-- Consumer loop -->
<flow name="process-orders">
    <scheduler>
        <scheduling-strategy>
            <fixed-frequency frequency="1" timeUnit="SECONDS"/>
        </scheduling-strategy>
    </scheduler>

    <!-- Read undelivered entries -->
    <lettuce-redis:xreadgroup
        config-ref="Redis_Config"
        group="order-processors"
        consumer="worker-01"
        count="10"
        block="5000"
        noack="false"
        streamWatermarks="#[[{key: 'events:orders', id: '>'}]]"/>

    <!-- Process each entry -->
    <foreach collection="#[payload['events:orders'] default []]">
        <set-variable variableName="entryId" value="#[payload.id]"/>
        <set-variable variableName="orderData" value="#[payload.entry]"/>

        <try>
            <flow-ref name="process-order"/>

            <!-- Acknowledge successful processing -->
            <lettuce-redis:xack
                config-ref="Redis_Config"
                key="events:orders"
                group="order-processors"
                ids="#[[vars.entryId]]"/>

            <error-handler>
                <on-error-continue>
                    <logger level="ERROR"
                        message="Failed to process order #[vars.entryId]"/>
                    <!-- Entry remains in pending list for retry -->
                </on-error-continue>
            </error-handler>
        </try>
    </foreach>
</flow>
```

---

## XACK

Acknowledge one or more entries as processed by a consumer group.

> 📘 **Redis Reference**: [XACK](https://redis.io/docs/latest/commands/xack/)

### XML Example

```xml
<lettuce-redis:xack doc:name="Acknowledge entry"
    config-ref="Redis_Config"
    key="events:orders"
    group="order-processors"
    ids="#[['1609459200000-0', '1609459200001-0']]"/>

<!-- payload is the number of entries acknowledged -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |
| `group` | String | Yes | — | Consumer group name |
| `ids` | List\<String\> | Yes | — | Entry IDs to acknowledge. At least one required. |

### Output

**Type**: `Long`

The number of entries successfully acknowledged.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No IDs provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key is not a stream |

---

## XDEL

Delete one or more entries from a stream.

> 📘 **Redis Reference**: [XDEL](https://redis.io/docs/latest/commands/xdel/)

### XML Example

```xml
<lettuce-redis:xdel doc:name="Delete processed entries"
    config-ref="Redis_Config"
    key="events:orders"
    ids="#[['1609459200000-0', '1609459200001-0']]"/>

<!-- payload is the number of entries deleted -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |
| `ids` | List\<String\> | Yes | — | Entry IDs to delete. At least one required. |

### Output

**Type**: `Long`

The number of entries deleted.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No IDs provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key is not a stream |

---

## XTRIM

Trim a stream to a specified length or minimum ID.

> 📘 **Redis Reference**: [XTRIM](https://redis.io/docs/latest/commands/xtrim/)

::: warning Static Configuration Required
The `evictionOption` parameter is `@Expression(NOT_SUPPORTED)` — it **must** be configured statically in XML. DataWeave expressions cannot be used for this parameter.
:::

### XML Example

```xml
<!-- Trim to keep last 1000 entries (approximate) -->
<lettuce-redis:xtrim doc:name="Trim stream"
    config-ref="Redis_Config"
    key="events:orders">
    <lettuce-redis:eviction-option>
        <lettuce-redis:max-len-eviction-option
            maxLength="1000"
            exactTrimming="false"
            limit="100"/>
    </lettuce-redis:eviction-option>
</lettuce-redis:xtrim>

<!-- Trim entries older than a specific ID -->
<lettuce-redis:xtrim doc:name="Trim old entries"
    config-ref="Redis_Config"
    key="events:orders">
    <lettuce-redis:eviction-option>
        <lettuce-redis:min-id-eviction-option
            id="1609459200000-0"
            exactTrimming="true"/>
    </lettuce-redis:eviction-option>
</lettuce-redis:xtrim>

<!-- payload is the number of entries deleted -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |
| `evictionOption` | StreamEvictionOption | Yes | — | Eviction policy (MaxLenEvictionOption or MinIdEvictionOption). Must be static XML. |

**StreamEvictionOption** (same as XADD):

| Type | Fields |
|------|--------|
| `MaxLenEvictionOption` | `maxLength` (long), `exactTrimming` (boolean), `limit` (Integer, optional) |
| `MinIdEvictionOption` | `id` (String), `exactTrimming` (boolean), `limit` (Integer, optional) |

### Output

**Type**: `Long`

The number of entries deleted.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key is not a stream |

---

## XGROUP CREATE

Create a new consumer group for a stream.

> 📘 **Redis Reference**: [XGROUP CREATE](https://redis.io/docs/latest/commands/xgroup-create/)

### XML Example

```xml
<!-- Create group starting from current end of stream -->
<lettuce-redis:xgroup-create doc:name="Create consumer group"
    config-ref="Redis_Config"
    key="events:orders"
    group="order-processors"
    lastEntryId="$"
    mkstream="true"/>

<!-- Create group to process all existing and future entries -->
<lettuce-redis:xgroup-create doc:name="Create group from beginning"
    config-ref="Redis_Config"
    key="events:orders"
    group="archive-processors"
    lastEntryId="0"
    mkstream="false"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |
| `group` | String | Yes | — | Consumer group name to create |
| `lastEntryId` | String | No | `"$"` | ID of the last entry the group has seen. Use `"$"` to start from the current end, `"0"` to process all existing entries. |
| `mkstream` | boolean | Yes | — | If `true`, create the stream if it does not exist |
| `entriesRead` | Long | No | — | Number of entries already read (for accurate lag tracking) |

### Output

**Type**: `Void`

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error (e.g., group already exists) |
| `REDIS:WRONG_TYPE` | Key exists but is not a stream |

---

## XGROUP DESTROY

Destroy a consumer group.

> 📘 **Redis Reference**: [XGROUP DESTROY](https://redis.io/docs/latest/commands/xgroup-destroy/)

### XML Example

```xml
<lettuce-redis:xgroup-destroy doc:name="Destroy consumer group"
    config-ref="Redis_Config"
    key="events:orders"
    group="old-processors"/>

<!-- payload is true if group was destroyed, false if it didn't exist -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |
| `group` | String | Yes | — | Consumer group name to destroy |

### Output

**Type**: `Boolean`

- `true` if the group was destroyed
- `false` if the group did not exist

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key is not a stream |

---

## XINFO GROUPS

Get information about all consumer groups for a stream.

> 📘 **Redis Reference**: [XINFO GROUPS](https://redis.io/docs/latest/commands/xinfo-groups/)

### XML Example

```xml
<lettuce-redis:xinfo-groups doc:name="Get consumer groups"
    config-ref="Redis_Config"
    key="events:orders"/>

<!-- payload is a List<Map<String, Object>> with one map per group -->
<foreach collection="#[payload]">
    <logger level="INFO"
        message="Group: #[payload.name], Consumers: #[payload.consumers], Pending: #[payload.pending]"/>
</foreach>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The stream key |

### Output

**Type**: `List<Map<String, Object>>`

A list of maps, one for each consumer group. Each map contains:

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Consumer group name |
| `consumers` | Long | Number of consumers in the group |
| `pending` | Long | Number of entries pending acknowledgment |
| `last-delivered-id` | String | ID of the last entry delivered to a consumer |
| `entries-read` | Long | Number of entries read by the group |
| `lag` | Long | Number of entries in the stream not yet delivered |

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key is not a stream |
