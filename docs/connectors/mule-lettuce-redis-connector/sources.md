---
title: Sources (Listeners)
description: Real-time Redis Pub/Sub event listeners for Mule flows using SUBSCRIBE and PSUBSCRIBE.
---

# Sources (Listeners)

## What Are Sources?

In the Mule SDK, a *source* is an event listener — a component that sits at the beginning of a flow and triggers it when something happens externally. Unlike operations (which your flow calls), sources wait and react.

Redis Pub/Sub lets applications publish messages to channels and receive them in real time. The connector exposes two sources:

| Source | Redis Command | Use when |
|--------|--------------|----------|
| SUBSCRIBE | SUBSCRIBE | You know the exact channel names to listen on |
| PSUBSCRIBE | PSUBSCRIBE | You want to match channels by glob pattern (e.g., `user:*:events`) |

Each message published to a subscribed channel or matching pattern triggers one Mule event through the connected flow.

::: tip Pub/Sub Is Fire-and-Forget
If no subscriber is listening when a message is published, the message is lost. Redis Pub/Sub is not a message queue — it does not persist messages. For durable messaging, consider Redis Streams (XADD/XREADGROUP) instead.
:::

## Prerequisites

Sources require the **Pub/Sub configuration** (`lettuce-redis:pubsub-config`), not the standard configuration. See [Set Up](./set-up#pub-sub-configuration) for how to create it and why it must be separate.

```xml
<lettuce-redis:pubsub-config name="Redis_PubSub_Config">
    <lettuce-redis:pubsub-connection
        host="${redis.host}"
        port="${redis.port}"
        tls="${redis.tls}"
        password="${secure::redis.password}"/>
</lettuce-redis:pubsub-config>
```

---

## SUBSCRIBE

### What It Does

SUBSCRIBE listens on one or more **exact** channel names. Every message published to any of those channels triggers one Mule event with the message as the payload.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channels` | List\<String\> | Yes | One or more exact channel names to subscribe to |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `payload` | String | The message content |
| `attributes.channel` | String | The channel the message was received on |

### Example

```xml
<flow name="handle-notifications">
    <!-- Listen for messages on the "notifications" channel -->
    <lettuce-redis:subscribe-channel
        config-ref="Redis_PubSub_Config"
        channels="#[['notifications']]"/>

    <!-- Log which channel the message came from -->
    <logger
        level="INFO"
        message="Message on #[attributes.channel]: #[payload]"/>

    <!-- Process the message -->
    <flow-ref name="process-notification"/>
</flow>
```

### Subscribing to Multiple Channels

A single SUBSCRIBE source can listen on multiple channels at once:

```xml
<lettuce-redis:subscribe-channel
    config-ref="Redis_PubSub_Config"
    channels="#[['orders', 'inventory', 'pricing']]"/>
```

Use `attributes.channel` in a `<choice>` router to handle each channel differently:

```xml
<flow name="multi-channel-handler">
    <lettuce-redis:subscribe-channel
        config-ref="Redis_PubSub_Config"
        channels="#[['orders', 'inventory', 'pricing']]"/>

    <choice>
        <when expression="#[attributes.channel == 'orders']">
            <flow-ref name="handle-order"/>
        </when>
        <when expression="#[attributes.channel == 'inventory']">
            <flow-ref name="handle-inventory-update"/>
        </when>
        <otherwise>
            <flow-ref name="handle-pricing-update"/>
        </otherwise>
    </choice>
</flow>
```

---

## PSUBSCRIBE

### What It Does

PSUBSCRIBE subscribes to channels by **glob pattern** rather than exact name. Any channel whose name matches the pattern will deliver messages to the flow.

Use PSUBSCRIBE when you need to listen on a family of related channels whose names are not known at design time, or when you want to avoid maintaining a large list of exact channel names.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `patterns` | List\<String\> | Yes | One or more glob patterns. Channels matching any pattern trigger the flow. |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `payload` | String | The message content |
| `attributes.channel` | String | The actual channel name the message was received on (not the pattern) |

### Pattern Matching Examples

| Pattern | Matches | Does Not Match |
|---------|---------|----------------|
| `user:*` | `user:123`, `user:abc` | `order:123`, `users:123` |
| `user:*:events` | `user:123:events`, `user:abc:events` | `user:events`, `user:123:logs` |
| `*:updated` | `order:updated`, `product:updated` | `order:update`, `updated` |
| `[io]*` | `orders`, `inventory` | `pricing`, `users` |
| `h?llo` | `hello`, `hallo` | `heello`, `hllo` |

::: tip Pattern Syntax
Redis pattern matching supports `*` (any sequence of characters), `?` (any single character), and `[...]` (character classes), same as shell globbing.
:::

### Example

```xml
<flow name="handle-user-events">
    <!-- Listen on any channel matching "user:*:events" -->
    <lettuce-redis:subscribe-channel-pattern
        config-ref="Redis_PubSub_Config"
        patterns="#[['user:*:events']]"/>

    <!-- attributes.channel contains the actual channel, e.g. "user:42:events" -->
    <logger
        level="INFO"
        message="Event on #[attributes.channel]: #[payload]"/>

    <!-- Extract user ID from the channel name -->
    <set-variable
        variableName="userId"
        value="#[attributes.channel splitBy ':' then [1]]"/>

    <flow-ref name="process-user-event"/>
</flow>
```

### PSUBSCRIBE vs SUBSCRIBE

| | SUBSCRIBE | PSUBSCRIBE |
|--|-----------|------------|
| Channel matching | Exact name | Glob pattern |
| `attributes.channel` | The subscribed channel | The actual channel that matched |
| Best for | Known, fixed channel names | Dynamic or family-of-channels scenarios |
| Multiple channels? | Yes — list multiple names | Yes — list multiple patterns |

---

## Common Patterns

### Publish and Subscribe in the Same Application

PUBLISH uses the **standard** config; SUBSCRIBE/PSUBSCRIBE use the **pub/sub** config. Both can coexist in the same application:

```xml
<!-- Standard config for PUBLISH and all other operations -->
<lettuce-redis:config name="Redis_Config">
    <lettuce-redis:connection
        host="${redis.host}"
        port="${redis.port}"
        tls="${redis.tls}"
        password="${secure::redis.password}"/>
</lettuce-redis:config>

<!-- Pub/Sub config for listening -->
<lettuce-redis:pubsub-config name="Redis_PubSub_Config">
    <lettuce-redis:pubsub-connection
        host="${redis.host}"
        port="${redis.port}"
        tls="${redis.tls}"
        password="${secure::redis.password}"/>
</lettuce-redis:pubsub-config>

<!-- Flow that RECEIVES messages -->
<flow name="message-receiver">
    <lettuce-redis:subscribe-channel
        config-ref="Redis_PubSub_Config"
        channels="#[['incoming']]"/>
    <logger level="INFO" message="Received: #[payload]"/>
    <!-- Transform and re-publish -->
    <lettuce-redis:publish
        config-ref="Redis_Config"
        channel="processed"
        message="#[upper(payload)]"/>
</flow>

<!-- Flow that SENDS messages (triggered by HTTP, scheduler, etc.) -->
<flow name="message-sender">
    <http:listener config-ref="HTTP_Config" path="/send"/>
    <lettuce-redis:publish
        config-ref="Redis_Config"
        channel="incoming"
        message="#[payload]"/>
</flow>
```

---

## Important Notes

- **Each source instance maintains its own dedicated Redis connection.** A Pub/Sub connection cannot be shared with regular operations — this is why the separate `lettuce-redis:pubsub-config` is required.
- **Messages are fire-and-forget.** If the subscriber's flow is not running when a message is published, that message is lost.
- **PUBLISH returns the subscriber count.** The output of the PUBLISH operation is a `Long` indicating how many subscribers received the message. A return value of `0` means no one was listening.
- **Pattern subscription delivers the actual channel name**, not the pattern, in `attributes.channel`. If you subscribed with `user:*:events` and a message arrived on `user:42:events`, `attributes.channel` is `"user:42:events"`.

## See Also

- [Set Up — Pub/Sub Configuration](./set-up#pub-sub-configuration)
- [Channel Operations — PUBLISH](./operations/channel#publish)
