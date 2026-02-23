---
title: Search Operations — Lettuce Redis Connector
description: Automated SCAN-based iteration for keys, hash fields, set members, and sorted set members
---

# Search Operations

## The Problem with Manual SCAN

When you need to iterate over large keyspaces or collections in Redis, you can't just ask for "all keys" or "all set members" — that would lock the server for too long. Instead, Redis uses cursor-based iteration commands: SCAN, HSCAN, SSCAN, and ZSCAN.

Here's what manual cursor iteration looks like:

1. Call SCAN with cursor `0`
2. Process the returned keys
3. Read the new cursor value from the response
4. Call SCAN again with the new cursor
5. Repeat steps 2-4 until the cursor returns to `0`
6. Handle the edge case where a page returns 0 results but the cursor is not yet `0`

In Mule XML, this requires flow-ref recursion, choice routers, and careful state management — verbose, error-prone, and cluttered with iteration logic instead of business logic.

**Search Operations solve this problem.** They handle all the cursor management automatically and integrate natively with `<foreach>` and batch processing. You just write a simple loop — the connector takes care of the rest.

---

## How Search Operations Work

Search Operations are implemented as Mule SDK `PagingProvider`s. This means:

- They stream results in pages, making repeated SCAN calls under the hood
- The connector maintains cursor state automatically until the full result set is returned
- You use them with `<foreach>`, batch jobs, or any component that consumes iterables
- You never see or manage the cursor — it's completely transparent

Under the hood, the connector:
1. Starts a SCAN loop with cursor `0`
2. Calls the Redis SCAN command and retrieves a page of results
3. Passes that page to your flow
4. Stores the new cursor value internally
5. Repeats until cursor returns to `0`, indicating the scan is complete

---

## The Four Search Operations

### Search Keys

**Automates:** [SCAN](./key-value#scan)

**When to use:** Iterating over all keys in the database, optionally filtered by pattern or type.

#### Example

```xml
<flow name="cleanup-expired-sessions">
    <scheduler>
        <scheduling-strategy>
            <cron expression="0 0 2 * * ?"/>
        </scheduling-strategy>
    </scheduler>

    <!-- Find all session keys -->
    <lettuce-redis:search-keys
        config-ref="Redis_Config"
        match="session:*"
        type="string"
        pageSizeHint="100"/>

    <!-- Process each key -->
    <foreach>
        <set-variable variableName="currentKey" value="#[payload]"/>
        <logger level="DEBUG" message="Checking session key: #[vars.currentKey]"/>

        <!-- Check TTL and delete if no expiration is set -->
        <lettuce-redis:ttl config-ref="Redis_Config" key="#[vars.currentKey]"/>

        <choice>
            <when expression="#[payload == -1]">
                <logger level="INFO" message="Deleting session with no TTL: #[vars.currentKey]"/>
                <lettuce-redis:del config-ref="Redis_Config" keys="#[[vars.currentKey]]"/>
            </when>
        </choice>
    </foreach>
</flow>
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `match` | String | No | — | Glob-style pattern filter (e.g., `"user:*"`, `"cache:???"`). Only keys matching this pattern are returned. |
| `type` | String | No | — | Redis type filter: `"string"`, `"hash"`, `"list"`, `"set"`, `"zset"`, or `"stream"`. Only keys of this type are returned. |
| `pageSizeHint` | Integer | No | — | Hint to Redis for number of elements per SCAN call. Redis may return more or fewer elements. |

#### Output

**Type (per iteration):** `String`

Each iteration of `<foreach>` receives a single key name as a String.

---

### Search Hash Fields

**Automates:** [HSCAN](./hash#hscan)

**When to use:** Iterating over all field-value pairs in a hash, optionally filtered by field name pattern.

#### Example

```xml
<flow name="export-user-preferences">
    <http:listener config-ref="HTTP_Config" path="/user/{userId}/preferences"/>

    <!-- Get all preference fields for the user -->
    <lettuce-redis:search-hash-fields
        config-ref="Redis_Config"
        key="#['user:' ++ attributes.uriParams.userId ++ ':prefs']"
        pageSizeHint="50"/>

    <!-- Each iteration gets a Map<String, String> with field-value pairs from this page -->
    <foreach>
        <logger level="DEBUG" message="Preference batch: #[payload]"/>

        <!-- Transform to an array of preference objects -->
        <ee:transform>
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
payload pluck (value, key) -> {
    name: key,
    value: value
}]]></ee:set-payload>
            </ee:message>
        </ee:transform>
    </foreach>
</flow>
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | Hash key to scan |
| `match` | String | No | — | Pattern filter on field names (e.g., `"email_*"`, `"theme_*"`) |
| `pageSizeHint` | Integer | No | — | Elements per HSCAN call hint |

#### Output

**Type (per iteration):** `Map<String, String>`

Each iteration receives a map of field-value pairs from one page of the HSCAN result. The map may contain multiple fields depending on how Redis batched the results.

---

### Search Set Members

**Automates:** [SSCAN](./set#sscan)

**When to use:** Iterating over all members of a set, optionally filtered by pattern.

#### Example

```xml
<flow name="process-active-users">
    <!-- Get all members from the "active-users" set -->
    <lettuce-redis:search-set-members
        config-ref="Redis_Config"
        key="active-users"
        pageSizeHint="100"/>

    <!-- Each iteration gets a single member (user ID) -->
    <foreach>
        <logger message="Processing active user: #[payload]"/>

        <!-- Fetch user details from another Redis key -->
        <lettuce-redis:hgetall
            config-ref="Redis_Config"
            key="#['user:' ++ payload]"/>

        <!-- Send notification or update stats -->
        <flow-ref name="send-user-notification"/>
    </foreach>
</flow>
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | Set key to scan |
| `match` | String | No | — | Pattern filter on member values |
| `pageSizeHint` | Integer | No | — | Elements per SSCAN call hint |

#### Output

**Type (per iteration):** `String`

Each iteration receives a single set member as a String.

---

### Search Sorted Set Members

**Automates:** [ZSCAN](./sorted-set#zscan)

**When to use:** Iterating over all members and scores in a sorted set, optionally filtered by member name pattern.

#### Example

```xml
<flow name="export-leaderboard">
    <http:listener config-ref="HTTP_Config" path="/leaderboard/export"/>

    <!-- Get all player scores from the leaderboard -->
    <lettuce-redis:search-sorted-set-members
        config-ref="Redis_Config"
        key="leaderboard:global"
        pageSizeHint="500"/>

    <!-- Each iteration gets a Map<String, Double> with member-score pairs -->
    <foreach>
        <logger message="Leaderboard page: #[payload]"/>
    </foreach>

    <!-- Aggregate all results into a final JSON response -->
    <ee:transform>
        <ee:message>
            <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
    players: payload flatMap (page) ->
        page pluck (score, member) -> {
            playerId: member,
            score: score
        }
}]]></ee:set-payload>
        </ee:message>
    </ee:transform>
</flow>
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | Sorted set key to scan |
| `match` | String | No | — | Pattern filter on member names |
| `pageSizeHint` | Integer | No | — | Elements per ZSCAN call hint |

#### Output

**Type (per iteration):** `Map<String, Double>`

Each iteration receives a map where keys are member names (Strings) and values are scores (Doubles). The map contains member-score pairs from one page of the ZSCAN result.

---

## When to Use Search Operations vs Manual SCAN

| Scenario | Use |
|----------|-----|
| Iterate over all matches and process them | **Search Operations** — automatic, clean, works with `<foreach>` and batch |
| Stop early after finding N results | **Manual SCAN** — you control the loop and can break out |
| Need access to the raw cursor value | **Manual SCAN** — Search Operations hide the cursor |
| Need to resume a scan from a saved cursor | **Manual SCAN** — Search Operations always start from cursor `0` |
| Production iteration over large keyspaces | **Search Operations** — handles edge cases automatically |
| Filter results with complex logic during iteration | **Search Operations** — iterate with `<foreach>`, filter with `<choice>` |

---

## Important Notes

### SCAN Is Not Atomic

Redis SCAN commands are not snapshots — data can change during iteration. If keys are added or removed while you're scanning, they may or may not appear in your results. This is a Redis behavior, not a connector limitation.

If you need a consistent view of data at a point in time, consider:
- Using Redis transactions (MULTI/EXEC) with smaller, known key sets
- Snapshoting data to a temporary key first, then scanning that
- Accepting eventual consistency and designing your logic to be idempotent

### `pageSizeHint` Is a Hint, Not a Guarantee

The `pageSizeHint` parameter maps to Redis's `COUNT` option. Redis uses it as a hint for how many elements to scan per iteration, but the actual number returned can be more or less depending on:
- The internal representation of the data structure
- Hash table density and resizing
- The `match` filter (filtered results may be smaller than the hint)

The connector handles this transparently — you don't need to worry about variable page sizes.

### Performance Tuning

For very large keyspaces (millions of keys), SCAN can take many round trips to Redis. The `pageSizeHint` parameter helps you tune the tradeoff:

- **Smaller hints** (e.g., `10-50`) → More round trips, lower memory usage per call, lower server load per call
- **Larger hints** (e.g., `500-1000`) → Fewer round trips, higher memory usage per call, higher server load per call

Start with the default (Redis decides) and only tune if you see performance issues.

---

## Example: Batch Processing with Search Operations

Search Operations integrate seamlessly with Mule's batch processing:

```xml
<flow name="batch-update-user-stats">
    <scheduler>
        <scheduling-strategy>
            <cron expression="0 0 1 * * ?"/>
        </scheduling-strategy>
    </scheduler>

    <batch:job jobName="updateUserStatsBatch">
        <batch:input>
            <!-- Search Operations work as batch input sources -->
            <lettuce-redis:search-keys
                config-ref="Redis_Config"
                match="user:*:stats"
                pageSizeHint="100"/>
        </batch:input>

        <batch:process-records>
            <batch:step name="updateStats">
                <logger message="Processing user stats key: #[payload]"/>

                <!-- Fetch, transform, update logic here -->
                <lettuce-redis:hgetall
                    config-ref="Redis_Config"
                    key="#[payload]"/>

                <!-- Update stats based on business logic -->
            </batch:step>
        </batch:process-records>
    </batch:job>
</flow>
```

---

## See Also

- [SCAN](./key-value#scan) — Manual key scanning with cursor control
- [HSCAN](./hash#hscan) — Manual hash field scanning
- [SSCAN](./set#sscan) — Manual set member scanning
- [ZSCAN](./sorted-set#zscan) — Manual sorted set member scanning
