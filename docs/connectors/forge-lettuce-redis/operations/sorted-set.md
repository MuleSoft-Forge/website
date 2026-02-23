---
title: Sorted Set Commands — Lettuce Redis Connector
description: Reference for sorted set Redis commands in the Mule Lettuce Redis Connector
---

# Sorted Set Commands

Sorted set commands operate on Redis sorted sets — collections of unique strings, each associated with a score. Members are ordered by score, making sorted sets useful for leaderboards, priority queues, and range queries.

This page covers: **ZADD**, **ZINCRBY**, **ZRANK**, **ZSCAN**, **ZSCORE**

---

## ZADD

Add one or more members with scores to a sorted set, with optional conditional flags.

> 📘 **Redis Reference**: [ZADD](https://redis.io/docs/latest/commands/zadd/)

### XML Example

```xml
<!-- Add multiple members with scores -->
<lettuce-redis:zadd doc:name="Add leaderboard scores"
    config-ref="Redis_Config"
    key="leaderboard:global"
    memberScores="#[{'player:123': 1500.0, 'player:456': 1200.0, 'player:789': 1800.0}]"
    xx="false"
    nx="false"
    gt="false"
    lt="false"
    ch="false"/>

<!-- Only update existing members if new score is higher -->
<lettuce-redis:zadd doc:name="Update high scores"
    config-ref="Redis_Config"
    key="leaderboard:global"
    memberScores="#[{'player:123': 1600.0}]"
    xx="true"
    gt="true"
    ch="true"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The sorted set key |
| `memberScores` | Map\<String, Double\> | Yes | — | Member-to-score pairs. Payload by default via `@Content`. |
| `xx` | boolean | No | `false` | Only update existing members (do not add new) |
| `nx` | boolean | No | `false` | Only add new members (do not update existing) |
| `gt` | boolean | No | `false` | Only update if the new score is **greater than** the current score |
| `lt` | boolean | No | `false` | Only update if the new score is **less than** the current score |
| `ch` | boolean | No | `false` | Change the return value to count **changed** members instead of **added** members |

### Output

**Type**: `Long`

- By default: the number of **new** members added (updates to existing members are not counted)
- When `ch=true`: the number of members **added or changed**

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a sorted set |

---

## ZSCORE

Get the score of a member in a sorted set.

> 📘 **Redis Reference**: [ZSCORE](https://redis.io/docs/latest/commands/zscore/)

### XML Example

```xml
<lettuce-redis:zscore doc:name="Get player score"
    config-ref="Redis_Config"
    key="leaderboard:global"
    member="player:123"/>

<!-- payload is now the player's score as a Double -->
<logger level="INFO" message="Player score: #[payload]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The sorted set key |
| `member` | String | Yes | — | The member whose score to retrieve |

### Output

**Type**: `Double`

The score of the member.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a sorted set |

---

## ZRANK

Get the rank (index) of a member in a sorted set, optionally with its score.

> 📘 **Redis Reference**: [ZRANK](https://redis.io/docs/latest/commands/zrank/)

### XML Example

```xml
<!-- Get rank only -->
<lettuce-redis:zrank doc:name="Get player rank"
    config-ref="Redis_Config"
    key="leaderboard:global"
    member="player:123"
    withScore="false"/>
<!-- payload is a Long (the rank, 0-based) -->

<!-- Get rank and score together -->
<lettuce-redis:zrank doc:name="Get player rank and score"
    config-ref="Redis_Config"
    key="leaderboard:global"
    member="player:123"
    withScore="true"/>
<!-- payload is a Map with keys "rank" and "score" -->
<logger level="INFO" message="Rank: #[payload.rank], Score: #[payload.score]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The sorted set key |
| `member` | String | Yes | — | The member to get the rank of |
| `withScore` | boolean | No | `false` | If `true`, return both rank and score together |

### Output

**Type**: `Object` (dynamic, resolved by metadata)

- When `withScore=false`: `Long` — The rank (0-based index in sorted order)
- When `withScore=true`: `Map<String, Object>` with keys:
  - `"rank"` → Long
  - `"score"` → Double

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:NIL` | Member does not exist in the sorted set |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a sorted set |

---

## ZINCRBY

Increment the score of a member in a sorted set.

> 📘 **Redis Reference**: [ZINCRBY](https://redis.io/docs/latest/commands/zincrby/)

### XML Example

```xml
<lettuce-redis:zincrby doc:name="Award points"
    config-ref="Redis_Config"
    key="leaderboard:global"
    increment="100.0"
    member="player:123"/>

<!-- payload is now the new score after increment -->
<logger level="INFO" message="New score: #[payload]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The sorted set key |
| `increment` | Double | Yes | — | The amount to add to the member's score (can be negative) |
| `member` | String | Yes | — | The member whose score to increment |

### Output

**Type**: `Double`

The new score of the member after the increment.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a sorted set |

---

## ZSCAN

Incrementally iterate sorted set members and scores using a cursor.

> 📘 **Redis Reference**: [ZSCAN](https://redis.io/docs/latest/commands/zscan/)

::: tip Automated Cursor Management
For most use cases, consider using [Search Sorted Set Members](./search-operations#search-sorted-set-members) instead, which handles cursor iteration automatically and streams all member-score pairs. Use ZSCAN directly only when you need fine-grained control over pagination.
:::

### XML Example

```xml
<!-- Start a new scan (cursor 0) -->
<lettuce-redis:zscan doc:name="Scan leaderboard"
    config-ref="Redis_Config"
    key="leaderboard:global"
    cursor="0"
    match="player:*"
    count="50"/>

<!-- payload is a List<Map<String, Double>> -->
<!-- Each element is a single-entry map: {member: score} -->
<foreach collection="#[payload]">
    <logger level="INFO"
        message="Member: #[payload.keys()[0]], Score: #[payload[payload.keys()[0]]]"/>
</foreach>

<!-- attributes.cursor contains the next cursor value -->
<logger level="INFO" message="Next cursor: #[attributes.cursor]"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The sorted set key to scan |
| `cursor` | Integer | Yes | — | Cursor position. Use `0` to start a new scan. |
| `match` | String | No | — | Glob-style pattern to filter member names |
| `count` | Integer | No | — | Hint for the number of elements to return per iteration |

### Output

**Type**: `List<Map<String, Double>>`

A list where each element is a single-entry map representing one member-score pair:
```json
[
  {"player:123": 1500.0},
  {"player:456": 1200.0},
  {"player:789": 1800.0}
]
```

**Attributes**: `ScanAttributes` — Contains the `cursor` field with the next cursor value. When `cursor` is `0`, the scan is complete.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a sorted set |
