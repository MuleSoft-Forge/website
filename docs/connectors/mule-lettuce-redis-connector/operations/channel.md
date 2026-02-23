---
title: Channel Commands — Lettuce Redis Connector
description: Reference for channel (Pub/Sub) Redis commands in the Mule Lettuce Redis Connector
---

# Channel Commands

Channel commands are used to send messages to Redis Pub/Sub channels. To receive messages, see [Sources (Listeners)](../sources).

This page covers: **PUBLISH**

---

## PUBLISH

Publish a message to a Redis Pub/Sub channel.

> 📘 **Redis Reference**: [PUBLISH](https://redis.io/docs/latest/commands/publish/)

### XML Example

```xml
<lettuce-redis:publish doc:name="Publish notification"
    config-ref="Redis_Config"
    channel="order-events"
    message='{"orderId": "12345", "status": "shipped"}'/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `channel` | String | Yes | — | The name of the channel to publish to |
| `message` | String | Yes | — | The message content to publish |

### Output

**Type**: `Long`

The number of subscribers that received the message. A return value of `0` means no clients were subscribed to the channel when the message was published.

::: warning Message Delivery
Redis Pub/Sub is fire-and-forget. If no subscriber is listening when PUBLISH is called, the message is lost. For durable messaging, consider using [Redis Streams](./stream) instead.
:::

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | Connection failure or server error |

### Usage

::: info Configuration
PUBLISH uses the **standard configuration** (`lettuce-redis:config`), not the pub/sub configuration. Only the SUBSCRIBE and PSUBSCRIBE sources require the pub/sub configuration.
:::

**Common pattern: Publish and subscribe in the same application**

```xml
<!-- Standard config for PUBLISH -->
<lettuce-redis:config name="Redis_Config">
    <lettuce-redis:connection
        host="${redis.host}"
        port="${redis.port}"
        tls="false"
        password="${secure::redis.password}"/>
</lettuce-redis:config>

<!-- Pub/Sub config for SUBSCRIBE sources -->
<lettuce-redis:pubsub-config name="Redis_PubSub_Config">
    <lettuce-redis:pubsub-connection
        host="${redis.host}"
        port="${redis.port}"
        tls="false"
        password="${secure::redis.password}"/>
</lettuce-redis:pubsub-config>

<!-- Publish messages when orders are placed -->
<flow name="order-publisher">
    <http:listener config-ref="HTTP_Config" path="/orders"/>

    <lettuce-redis:publish
        config-ref="Redis_Config"
        channel="order-events"
        message="#[payload]"/>

    <set-variable variableName="subscriberCount" value="#[payload]"/>

    <logger level="INFO"
        message="Published to #[vars.subscriberCount] subscribers"/>
</flow>

<!-- Subscribe to order events and process them -->
<flow name="order-subscriber">
    <lettuce-redis:subscribe-channel
        config-ref="Redis_PubSub_Config"
        channels="#[['order-events']]"/>

    <logger level="INFO"
        message="Received order event: #[payload]"/>

    <flow-ref name="process-order-event"/>
</flow>
```

### See Also

- [Sources (Listeners)](../sources) — SUBSCRIBE and PSUBSCRIBE for receiving messages
- [Redis Streams](./stream) — Durable, persistent messaging with consumer groups
