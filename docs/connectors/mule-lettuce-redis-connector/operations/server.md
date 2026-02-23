---
title: Server Commands — Lettuce Redis Connector
description: Reference for server Redis commands in the Mule Lettuce Redis Connector
---

# Server Commands

Server commands are used to check the health and responsiveness of the Redis server.

This page covers: **PING**

---

## PING

Test connectivity to the Redis server and optionally echo a custom message.

> 📘 **Redis Reference**: [PING](https://redis.io/docs/latest/commands/ping/)

### XML Example

```xml
<!-- Simple ping (returns "PONG") -->
<lettuce-redis:ping doc:name="Ping" config-ref="Redis_Config"/>

<!-- Ping with custom message (echoes the message back) -->
<lettuce-redis:ping doc:name="Ping with message"
    config-ref="Redis_Config"
    message="health-check"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | String | No | — | If provided, Redis echoes this message back instead of "PONG" |

### Output

**Type**: `String` (media type: `text/plain`)

- When no `message` parameter is provided: returns `"PONG"`
- When a `message` is provided: returns the message string

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | Connection failure or server error |

### Usage

PING is commonly used for:
- Health checks in monitoring flows
- Verifying connectivity before executing operations
- Validating configuration changes

```xml
<flow name="redis-health-check">
    <scheduler>
        <scheduling-strategy>
            <fixed-frequency frequency="30" timeUnit="SECONDS"/>
        </scheduling-strategy>
    </scheduler>

    <try>
        <lettuce-redis:ping config-ref="Redis_Config"/>
        <logger level="INFO" message="Redis is healthy: #[payload]"/>

        <error-handler>
            <on-error-continue>
                <logger level="ERROR" message="Redis health check failed"/>
            </on-error-continue>
        </error-handler>
    </try>
</flow>
```
