---
title: List Commands — Lettuce Redis Connector
description: Reference for list Redis commands in the Mule Lettuce Redis Connector
---

# List Commands

List commands operate on Redis lists — ordered collections of strings. Lists are doubly-linked, so adding elements to the head or tail is very fast.

This page covers: **BLMOVE**, **BLPOP**, **BRPOP**, **LMOVE**, **LPOP**, **LPUSH**, **LSET**, **RPOP**, **RPUSH**

---

## LPUSH

Prepend one or more values to a list.

> 📘 **Redis Reference**: [LPUSH](https://redis.io/docs/latest/commands/lpush/)

### XML Example

```xml
<lettuce-redis:lpush doc:name="Push to queue"
    config-ref="Redis_Config"
    key="queue:tasks"
    members="#[['task-1', 'task-2', 'task-3']]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The list key |
| `members` | List\<String\> | Yes | — | Values to prepend. At least one required. Payload by default via `@Content`. |

### Output

**Type**: `Long`

The length of the list after the operation.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No members provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a list |

---

## RPUSH

Append one or more values to a list.

> 📘 **Redis Reference**: [RPUSH](https://redis.io/docs/latest/commands/rpush/)

### XML Example

```xml
<lettuce-redis:rpush doc:name="Append to log"
    config-ref="Redis_Config"
    key="log:events"
    members="#[['event-1', 'event-2']]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The list key |
| `members` | List\<String\> | Yes | — | Values to append. At least one required. Payload by default via `@Content`. |

### Output

**Type**: `Long`

The length of the list after the operation.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No members provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a list |

---

## LPOP

Remove and return the first element(s) from a list.

> 📘 **Redis Reference**: [LPOP](https://redis.io/docs/latest/commands/lpop/)

### XML Example

```xml
<!-- Pop a single element -->
<lettuce-redis:lpop doc:name="Pop one"
    config-ref="Redis_Config"
    key="queue:tasks"/>
<!-- payload is a List<String> with one element -->

<!-- Pop multiple elements -->
<lettuce-redis:lpop doc:name="Pop three"
    config-ref="Redis_Config"
    key="queue:tasks"
    count="3"/>
<!-- payload is a List<String> with up to three elements -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The list key |
| `count` | Integer | No | — | Number of elements to pop. When omitted, pops one element. |

### Output

**Type**: `List<String>`

The operation always returns a `List<String>` regardless of whether `count` is provided:
- When `count` is **not** specified: list contains a single element (the popped element)
- When `count` **is** specified: list contains up to `count` popped elements

::: warning Metadata Mismatch
Anypoint Studio's design-time metadata indicates this operation returns a `String` when `count` is not provided. At runtime, the operation always returns a `List<String>`. When writing DataWeave expressions, treat the output as a list. This mismatch is tracked in [issue #4](https://github.com/MuleSoft-Forge/mule-lettuce-redis-connector/issues/4).
:::

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a list |

---

## RPOP

Remove and return the last element(s) from a list.

> 📘 **Redis Reference**: [RPOP](https://redis.io/docs/latest/commands/rpop/)

### XML Example

```xml
<!-- Pop a single element -->
<lettuce-redis:rpop doc:name="Pop last"
    config-ref="Redis_Config"
    key="stack:items"/>
<!-- payload is a List<String> with one element -->

<!-- Pop multiple elements -->
<lettuce-redis:rpop doc:name="Pop last three"
    config-ref="Redis_Config"
    key="stack:items"
    count="3"/>
<!-- payload is a List<String> with up to three elements -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The list key |
| `count` | Integer | No | — | Number of elements to pop |

### Output

**Type**: `List<String>`

The operation always returns a `List<String>` regardless of whether `count` is provided:
- When `count` is **not** specified: list contains a single element (the popped element)
- When `count` **is** specified: list contains up to `count` popped elements

::: warning Metadata Mismatch
Anypoint Studio's design-time metadata indicates this operation returns a `String` when `count` is not provided. At runtime, the operation always returns a `List<String>`. When writing DataWeave expressions, treat the output as a list. This mismatch is tracked in [issue #4](https://github.com/MuleSoft-Forge/mule-lettuce-redis-connector/issues/4).
:::

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a list |

---

## BLPOP

Remove and return the first element from one of multiple lists, blocking until an element is available or timeout occurs.

> 📘 **Redis Reference**: [BLPOP](https://redis.io/docs/latest/commands/blpop/)

### XML Example

```xml
<!-- Block for up to 5 seconds waiting for a task -->
<lettuce-redis:blpop doc:name="Wait for task"
    config-ref="Redis_Config"
    keys="#[['queue:high-priority', 'queue:normal', 'queue:low']]"
    timeoutSeconds="5"/>

<!-- payload is a Map<String, String> with one entry: the key and the popped value -->
<logger level="INFO"
    message="Popped from #[payload.keys()[0]]: #[payload[payload.keys()[0]]]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | List\<String\> | Yes | — | One or more list keys to wait on. At least one required. The first list to have an element available is popped. |
| `timeoutSeconds` | Double | Yes | — | Seconds to wait. Use `0` to block indefinitely. |

### Output

**Type**: `Map<String, String>`

A single-entry map where:
- **Key**: The list key that had an element
- **Value**: The popped element

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No keys provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | One of the keys is not a list |
| `REDIS:TIMEOUT` | Timeout reached with no element available |

---

## BRPOP

Remove and return the last element from one of multiple lists, blocking until an element is available or timeout occurs.

> 📘 **Redis Reference**: [BRPOP](https://redis.io/docs/latest/commands/brpop/)

### XML Example

```xml
<lettuce-redis:brpop doc:name="Wait for message"
    config-ref="Redis_Config"
    keys="#[['messages:inbox']]"
    timeoutSeconds="10"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keys` | List\<String\> | Yes | — | One or more list keys. At least one required. |
| `timeoutSeconds` | Double | Yes | — | Seconds to wait. Use `0` to block indefinitely. |

### Output

**Type**: `Map<String, String>`

A single-entry map: the key that had an element and the popped value.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No keys provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | One of the keys is not a list |
| `REDIS:TIMEOUT` | Timeout reached with no element available |

---

## LMOVE

Atomically move an element from one list to another.

> 📘 **Redis Reference**: [LMOVE](https://redis.io/docs/latest/commands/lmove/)

### XML Example

```xml
<!-- Move task from pending to in-progress queue -->
<lettuce-redis:lmove doc:name="Move task to processing"
    config-ref="Redis_Config"
    source="queue:pending"
    destination="queue:in-progress"
    whereFrom="LEFT"
    whereTo="RIGHT"/>

<!-- payload now contains the moved element -->
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source` | String | Yes | — | Source list key |
| `destination` | String | Yes | — | Destination list key |
| `whereFrom` | ListEnd | Yes | — | Which end to pop from the source list: `LEFT` or `RIGHT` |
| `whereTo` | ListEnd | Yes | — | Which end to push to the destination list: `LEFT` or `RIGHT` |

**ListEnd values**: `LEFT`, `RIGHT`

### Output

**Type**: `String` (media type: `text/plain`)

The element that was moved.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Source or destination is not a list |

### Queue Transfer Pattern

```xml
<!-- Implement a reliable queue: move tasks from "pending" to "in-progress" -->
<flow name="process-tasks">
    <scheduler>
        <scheduling-strategy>
            <fixed-frequency frequency="1" timeUnit="SECONDS"/>
        </scheduling-strategy>
    </scheduler>

    <try>
        <lettuce-redis:lmove
            config-ref="Redis_Config"
            source="queue:pending"
            destination="queue:in-progress"
            whereFrom="LEFT"
            whereTo="RIGHT"/>

        <!-- Process the task -->
        <flow-ref name="process-task"/>

        <!-- On success, remove from in-progress -->
        <lettuce-redis:rpop
            config-ref="Redis_Config"
            key="queue:in-progress"/>

        <error-handler>
            <on-error-continue>
                <!-- On failure, move back to pending -->
                <lettuce-redis:lmove
                    config-ref="Redis_Config"
                    source="queue:in-progress"
                    destination="queue:pending"
                    whereFrom="RIGHT"
                    whereTo="LEFT"/>
            </on-error-continue>
        </error-handler>
    </try>
</flow>
```

---

## BLMOVE

Atomically move an element from one list to another, blocking until an element is available or timeout occurs.

> 📘 **Redis Reference**: [BLMOVE](https://redis.io/docs/latest/commands/blmove/)

### XML Example

```xml
<lettuce-redis:blmove doc:name="Wait and move task"
    config-ref="Redis_Config"
    source="queue:pending"
    destination="queue:in-progress"
    whereFrom="LEFT"
    whereTo="RIGHT"
    timeout="5.0"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source` | String | Yes | — | Source list key |
| `destination` | String | Yes | — | Destination list key |
| `whereFrom` | ListEnd | Yes | — | Which end to pop from: `LEFT` or `RIGHT` |
| `whereTo` | ListEnd | Yes | — | Which end to push to: `LEFT` or `RIGHT` |
| `timeout` | Double | Yes | — | Seconds to wait for an element. Use `0.0` to block indefinitely. |

### Output

**Type**: `String` (media type: `text/plain`)

The element that was moved.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Source or destination is not a list |

---

## LSET

Set the value of an element in a list by its index.

> 📘 **Redis Reference**: [LSET](https://redis.io/docs/latest/commands/lset/)

### XML Example

```xml
<!-- Update the first element (index 0) -->
<lettuce-redis:lset doc:name="Update first item"
    config-ref="Redis_Config"
    key="todo:items"
    index="0"
    element="Buy groceries (URGENT)"/>

<!-- Update the last element (index -1) -->
<lettuce-redis:lset doc:name="Update last item"
    config-ref="Redis_Config"
    key="todo:items"
    index="-1"
    element="Call mom"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The list key |
| `index` | Long | Yes | — | Index of the element to set (0-based). Negative indices count from the end (-1 is last element). |
| `element` | String | Yes | — | The new value (payload by default via `@Content`) |

### Output

**Type**: `Void`

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:OUT_OF_RANGE` | Index is out of range for the list |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a list |
