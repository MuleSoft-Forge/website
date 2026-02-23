---
title: Set Up
description: Installation and configuration guide for the Mule Lettuce Redis Connector.
---

# Set Up

| Version | Min runtime version | Compatible Java versions | Description |
| ------- | ------------------- | ------------------------ | ----------- |
| [0.1.24](https://central.sonatype.com/artifact/cloud.anypoint/mule-lettuce-redis-connector/0.1.24) | 4.6.0 | Java 8, Java 11, Java 17 | Latest release |

## Requirements

- **Mule Runtime**: 4.6.0 or later
- **Java**: 8, 11, or 17
- **Maven**: 3.9.8 or later
- **Redis server**: Any version supporting the commands you use

## Installation

### Step 1: Add Maven Dependency

Add the following dependency to your Mule application's `pom.xml`:

```xml
<dependency>
    <groupId>cloud.anypoint</groupId>
    <artifactId>mule-lettuce-redis-connector</artifactId>
    <version>0.1.24</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

### Step 2: Choose Your Configuration Type

The connector provides two configuration elements. Use the one that matches your use case:

| Configuration | XML element | Use for |
|--------------|-------------|---------|
| Standard | `lettuce-redis:config` | All operations (GET, SET, HSET, LPUSH, XADD, PUBLISH, Send Command, Search Operations, etc.) |
| Pub/Sub | `lettuce-redis:pubsub-config` | Sources only (SUBSCRIBE and PSUBSCRIBE event listeners) |

## Standard Configuration

Use `lettuce-redis:config` for all regular operations. This covers every command in the Key/Value, Hash, List, Set, Sorted Set, Geospatial, Stream, and Channel categories, as well as Send Command and Search Operations.

```xml
<lettuce-redis:config name="Redis_Config">
    <lettuce-redis:connection
        host="redis.example.com"
        port="6379"
        tls="false"
        password="${secure::redis.password}"/>
</lettuce-redis:config>
```

### Connection Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `host` | String | Yes | — | Redis server hostname or IP address |
| `tls` | boolean | Yes | — | Enable TLS/SSL encryption for the connection |
| `port` | int | Yes | — | Redis server port (Redis default is 6379) |
| `password` | String | Yes | — | Redis AUTH password. See note below about credential management. |
| `commandTimeout` | Integer | No | — | Fixed timeout for all commands. Used together with `commandTimeoutUnit`. |
| `commandTimeoutUnit` | TimeUnit | No | — | Time unit for `commandTimeout` (e.g., `MILLISECONDS`, `SECONDS`). Required when `commandTimeout` is set. |

::: warning Password Is Required and Does Not Support DataWeave Expressions
The `password` parameter currently accepts only a literal string or a Mule property placeholder. DataWeave expressions are not supported. Use Mule's secure configuration properties to keep credentials out of your flow XML.
:::

### Credential Management

Always store the Redis password in a secure properties file rather than hardcoding it in your flow XML:

**`src/main/resources/secure-config.yaml`** (encrypted, add to `.gitignore`):
```yaml
redis:
  password: "your-redis-password"
```

**Global configuration** (or `src/main/mule/global.xml`):
```xml
<!-- Secure properties loader -->
<secure-properties:config
    name="Secure_Properties"
    file="secure-config.yaml"
    key="${encryption.key}"/>

<!-- Redis configuration using secure property -->
<lettuce-redis:config name="Redis_Config">
    <lettuce-redis:connection
        host="${redis.host}"
        port="${redis.port}"
        tls="${redis.tls}"
        password="${secure::redis.password}"/>
</lettuce-redis:config>
```

### Command Timeout Configuration

To configure a fixed command timeout, provide both `commandTimeout` and `commandTimeoutUnit`:

```xml
<lettuce-redis:config name="Redis_Config">
    <lettuce-redis:connection
        host="redis.example.com"
        port="6379"
        tls="false"
        password="${secure::redis.password}"
        commandTimeout="5000"
        commandTimeoutUnit="MILLISECONDS"/>
</lettuce-redis:config>
```

Valid `commandTimeoutUnit` values: `NANOSECONDS`, `MICROSECONDS`, `MILLISECONDS`, `SECONDS`, `MINUTES`, `HOURS`, `DAYS`.

### TLS Configuration

To connect to a Redis server with TLS enabled, set `tls="true"`:

```xml
<lettuce-redis:config name="Redis_Config_TLS">
    <lettuce-redis:connection
        host="redis.example.com"
        port="6380"
        tls="true"
        password="${secure::redis.password}"/>
</lettuce-redis:config>
```

---

## Pub/Sub Configuration

Use `lettuce-redis:pubsub-config` **only** for the SUBSCRIBE and PSUBSCRIBE sources (event listeners). This is a separate configuration element from the standard one.

```xml
<lettuce-redis:pubsub-config name="Redis_PubSub_Config">
    <lettuce-redis:pubsub-connection
        host="redis.example.com"
        port="6379"
        tls="false"
        password="${secure::redis.password}"/>
</lettuce-redis:pubsub-config>
```

::: tip Why a Separate Configuration?
Redis Pub/Sub requires a different underlying connection type than regular commands. In the Lettuce client, these are `StatefulRedisConnection` (standard) and `StatefulRedisPubSubConnection` (pub/sub) — they are not interchangeable. The connector uses separate config elements to make this distinction explicit and prevent misconfiguration.
:::

**Connection parameters are identical** to the standard configuration — same host, port, tls, password, and timeout options.

### PUBLISH vs SUBSCRIBE

| Operation | Configuration to use |
|-----------|---------------------|
| `PUBLISH` (sending messages) | `lettuce-redis:config` (standard) |
| `SUBSCRIBE` source (receiving messages) | `lettuce-redis:pubsub-config` |
| `PSUBSCRIBE` source (pattern listening) | `lettuce-redis:pubsub-config` |

---

## Using Both Configurations in the Same Application

Applications that both publish and subscribe to Redis channels need both configurations:

```xml
<!-- Standard config — used by PUBLISH, GET, SET, and all other operations -->
<lettuce-redis:config name="Redis_Config">
    <lettuce-redis:connection
        host="${redis.host}"
        port="${redis.port}"
        tls="${redis.tls}"
        password="${secure::redis.password}"/>
</lettuce-redis:config>

<!-- Pub/Sub config — used only by SUBSCRIBE and PSUBSCRIBE sources -->
<lettuce-redis:pubsub-config name="Redis_PubSub_Config">
    <lettuce-redis:pubsub-connection
        host="${redis.host}"
        port="${redis.port}"
        tls="${redis.tls}"
        password="${secure::redis.password}"/>
</lettuce-redis:pubsub-config>

<!-- Flow that subscribes and re-publishes to another channel -->
<flow name="message-relay">
    <lettuce-redis:subscribe-channel
        config-ref="Redis_PubSub_Config"
        channels="#[['input-channel']]"/>

    <logger level="INFO" message="Received: #[payload] on #[attributes.channel]"/>

    <lettuce-redis:publish
        config-ref="Redis_Config"
        channel="output-channel"
        message="#[payload]"/>
</flow>
```

## Next Steps

- [Operations Reference](./operations/) — All available operations by category
- [Sources (Listeners)](./sources) — Setting up Pub/Sub event-driven flows
- [GitHub Repository](https://github.com/anypointcloud/mule-lettuce-redis-connector) — Source code and issues
