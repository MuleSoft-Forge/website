---
title: Send Command — Lettuce Redis Connector
description: Execute any Redis command dynamically when no dedicated operation exists
---

# Send Command

## When to Use Send Command

The Lettuce Redis Connector implements dedicated operations for the most commonly used Redis commands — SET, GET, LPUSH, ZADD, and dozens more. But Redis has hundreds of commands, and new ones are added in every server release. When you need a command that the connector doesn't have a dedicated operation for, **Send Command** is your escape hatch.

Use Send Command when you need to:
- Execute a Redis command not yet implemented as a dedicated operation
- Use new commands added in recent Redis server versions
- Call commands from Redis modules (RedisJSON, RedisGraph, etc.)
- Work with custom or experimental commands

**The tradeoff:** You lose type safety and design-time metadata. The connector can't validate your arguments at design time or automatically infer the return type — you're responsible for knowing the command's signature and specifying how to interpret the response.

---

## How It Works

Send Command uses Lettuce's low-level dispatch mechanism to send an arbitrary command string with arguments directly to the Redis server. You specify three things:

1. **Command name** — the Redis command (e.g., `"LLEN"`, `"TYPE"`, `"RANDOMKEY"`)
2. **Arguments** — an ordered list of strings representing the command's arguments
3. **Return type** — what kind of response you expect from Redis (`STATUS`, `STRING`, `LONG`, or `ARRAY`)

The connector sends the command, receives the response from Redis, and converts it to a Mule-friendly type based on the `returnType` you specified.

---

## The `returnType` Parameter — Understanding Your Options

The `returnType` parameter is the most important part of using Send Command. It tells the connector how to interpret Redis's response. Choose the wrong type and you'll get a runtime error.

| Return Type | Redis Response Type | Mule Output Type | Use When |
|-------------|---------------------|-------------------|----------|
| `STATUS` | Simple status string (e.g., `"OK"`, `"QUEUED"`) | `String` | Commands that return a status message: SET (without GET option), PING, SELECT, FLUSHDB |
| `STRING` | Bulk string | `String` | Commands that return a string value: GET, HGET, LINDEX, TYPE |
| `LONG` | Integer | `Long` | Commands that return a number: INCR, DECR, DBSIZE, LLEN, SCARD |
| `ARRAY` | Array | `List<String>` | Commands that return multiple values: KEYS, MGET, LRANGE, SMEMBERS |

::: tip How to Pick the Right Return Type
Check the [Redis command documentation](https://redis.io/commands) for the command you're using. Every command page lists its return type — map that to one of the four `returnType` values above.
:::

::: warning NIL Responses
If the command returns nil (e.g., GET on a nonexistent key) and you specified `returnType=STRING` or `returnType=ARRAY`, the connector throws a `REDIS:NIL` error. Use an error handler to catch this if nil is a valid outcome for your use case.
:::

---

## Example: Using a Command Not in the Connector

Let's say you need to check the length of a Redis list using the `LLEN` command. The connector doesn't have a dedicated LLEN operation, so you use Send Command:

```xml
<flow name="check-queue-length">
    <http:listener config-ref="HTTP_Config" path="/queue/length"/>

    <!-- Get the length of the "pending-tasks" list -->
    <lettuce-redis:send-command
        config-ref="Redis_Config"
        command="LLEN"
        arguments="#[['pending-tasks']]"
        returnType="LONG"/>

    <!-- payload is now a Long — the list length -->
    <logger level="INFO" message="Queue has #[payload] pending tasks"/>

    <set-payload value="#[output application/json --- {queueLength: payload}]"/>
</flow>
```

**What's happening here:**
- **`command="LLEN"`** — we're calling the Redis LLEN command
- **`arguments="#[['pending-tasks']]"`** — LLEN takes one argument: the list key
- **`returnType="LONG"`** — LLEN returns an integer (the list length)

After the operation, `payload` contains the number of items in the list as a `Long`.

---

## Example: Getting a Key's Type

Redis's `TYPE` command returns the data type of a key (`string`, `hash`, `list`, etc.). Since it returns a string status, use `returnType=STRING`:

```xml
<flow name="inspect-key-type">
    <lettuce-redis:send-command
        config-ref="Redis_Config"
        command="TYPE"
        arguments="#[['user:1001']]"
        returnType="STRING"/>

    <!-- payload is now a String like "hash" or "string" -->
    <choice>
        <when expression="#[payload == 'hash']">
            <logger message="Key is a hash — fetching all fields"/>
            <lettuce-redis:hgetall config-ref="Redis_Config" key="user:1001"/>
        </when>
        <when expression="#[payload == 'string']">
            <logger message="Key is a string — fetching value"/>
            <lettuce-redis:get config-ref="Redis_Config" key="user:1001"/>
        </when>
        <otherwise>
            <logger level="WARN" message="Unexpected key type: #[payload]"/>
        </otherwise>
    </choice>
</flow>
```

---

## Example: Combining with DataWeave

When using `returnType=ARRAY`, the result is a `List<String>`. You can transform it with DataWeave just like any other list:

```xml
<flow name="get-and-transform-range">
    <!-- Get elements 0-9 from a list -->
    <lettuce-redis:send-command
        config-ref="Redis_Config"
        command="LRANGE"
        arguments="#[['event-log', '0', '9']]"
        returnType="ARRAY"/>

    <!-- payload is now a List<String> -->
    <ee:transform>
        <ee:message>
            <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
    events: payload map {
        timestamp: $ splitBy '|' then [0],
        message: $ splitBy '|' then [1]
    }
}]]></ee:set-payload>
        </ee:message>
    </ee:transform>
</flow>
```

---

## Error Handling

Send Command can throw several error types depending on what goes wrong:

| Error Type | When It's Thrown | How to Handle |
|------------|------------------|---------------|
| `REDIS:NIL` | Redis returned nil and `returnType` is `STRING` or `ARRAY` | Use an error handler to provide a default value or alternate logic |
| `REDIS:WRONG_TYPE` | The key holds a different data type than the command expects | Check the key type first or catch and handle gracefully |
| `REDIS:COMMAND` | Redis rejected the command (wrong arguments, unknown command, etc.) | Verify command syntax and argument count |
| `REDIS:TIMEOUT` | Redis server did not respond in time | Retry or alert on infrastructure issues |

### Example: Handling NIL Gracefully

```xml
<flow name="safe-get">
    <try>
        <lettuce-redis:send-command
            config-ref="Redis_Config"
            command="GET"
            arguments="#[['session:' ++ attributes.queryParams.sessionId]]"
            returnType="STRING"/>

        <logger message="Session found: #[payload]"/>

        <error-handler>
            <on-error-continue type="REDIS:NIL">
                <logger level="WARN" message="Session not found — using default"/>
                <set-payload value="{}"/>
            </on-error-continue>
        </error-handler>
    </try>
</flow>
```

---

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `command` | String | Yes | — | Redis command name (e.g., `"LLEN"`, `"TYPE"`, `"RANDOMKEY"`) |
| `arguments` | List\<String\> | Yes | — | Command arguments in order. Use an empty list `#[[]]` for commands with no arguments. |
| `returnType` | CommandReturnType | Yes | — | Expected return type: `STATUS`, `STRING`, `LONG`, or `ARRAY` |

### Output

**Type**: `Object` (resolved dynamically based on `returnType`)

- `STATUS` → `String`
- `STRING` → `String`
- `LONG` → `Long`
- `ARRAY` → `List<String>`

---

## Tips

- **Check the Redis docs for return type:** If you're unsure which `returnType` to use, check the official [Redis command reference](https://redis.io/commands) — every command page lists the return type
- **Arguments are always strings:** Even if a command takes a number (like `LRANGE key 0 10`), pass the arguments as strings: `#[['mylist', '0', '10']]`
- **Keys go in the arguments list:** Unlike dedicated operations, Send Command doesn't have a separate `key` parameter — the key is just the first (or second, or third) argument depending on the command
- **Use dedicated operations when available:** Send Command is powerful but less convenient than dedicated operations. If a command has a dedicated operation (like SET, GET, ZADD), prefer that — you get better metadata, validation, and autocomplete

---

## See Also

- [Key-Value Operations](./key-value) — Dedicated operations for common commands like SET, GET, MGET
- [List Operations](./list) — LPUSH, RPOP, LMOVE, and other list commands
- [Hash Operations](./hash) — HSET, HGET, HINCRBY, and more
