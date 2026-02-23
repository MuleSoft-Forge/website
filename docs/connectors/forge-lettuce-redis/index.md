---
title: Mule Lettuce Redis Connector
description: Direct access to Redis commands from Mule applications, built on the Lettuce reactive Redis client.
---

# forge-lettuce-redis

A low-level connector providing Mule applications with direct access to Redis commands, built on the [Lettuce](https://lettuce.io/) reactive Redis client library. Published on Maven Central under `cloud.anypoint`.

The connector's goal is to provide full coverage of all documented Redis commands, organized by Redis data structure. For commands not yet implemented as dedicated operations, the [Send Command](./operations/send-command) operation lets you execute any arbitrary Redis command.

## Features

- **Broad command coverage**: Dedicated operations for strings, hashes, lists, sets, sorted sets, geospatial indexes, and streams
- **Pub/Sub event sources**: Trigger Mule flows in real time from Redis channels using SUBSCRIBE and PSUBSCRIBE
- **Dynamic command execution**: [Send Command](./operations/send-command) executes any Redis command not yet available as a dedicated operation
- **Automated SCAN iteration**: [Search Operations](./operations/search-operations) handle Redis cursor management internally, streaming full result sets without manual loop logic
- **Maven Central**: Install with a single Maven dependency — no local builds required

## Quick Example

```xml
<!-- Standard Redis configuration -->
<lettuce-redis:config name="Redis_Config">
    <lettuce-redis:connection
        host="localhost"
        port="6379"
        tls="false"
        password="${secure::redis.password}"/>
</lettuce-redis:config>

<!-- Store a value -->
<lettuce-redis:set config-ref="Redis_Config" key="greeting" value="hello"/>

<!-- Retrieve it -->
<lettuce-redis:get config-ref="Redis_Config" key="greeting"/>

<!-- payload is now "hello" -->
<logger level="INFO" message="#[payload]"/>
```

## Supported Command Categories

| Category | Operations | Page |
|----------|-----------|------|
| Server | PING | [Server](./operations/server) |
| Key / Value | APPEND, COPY, DECR, DEL, EXPIRE, GET, GETDEL, GETEX, GETRANGE, GETSET, INCR, MGET, MSET, PERSIST, PEXPIRE, PTTL, SCAN, SET, TOUCH, TTL | [Key / Value](./operations/key-value) |
| Hash | HEXISTS, HGET, HGETALL, HINCRBY, HLEN, HMGET, HSCAN, HSET | [Hash](./operations/hash) |
| List | BLMOVE, BLPOP, BRPOP, LMOVE, LPOP, LPUSH, LSET, RPOP, RPUSH | [List](./operations/list) |
| Set | SADD, SCARD, SDIFF, SISMEMBER, SMEMBERS, SMISMEMBER, SPOP, SRANDMEMBER, SREM, SSCAN | [Set](./operations/set) |
| Sorted Set | ZADD, ZINCRBY, ZRANK, ZSCAN, ZSCORE | [Sorted Set](./operations/sorted-set) |
| Geospatial | GEOADD, GEODIST, GEOPOS, GEOSEARCH | [Geospatial](./operations/geospatial) |
| Stream | XACK, XADD, XDEL, XGROUP CREATE, XGROUP DESTROY, XINFO GROUPS, XRANGE, XREAD, XREADGROUP, XTRIM | [Stream](./operations/stream) |
| Channel | PUBLISH | [Channel](./operations/channel) |
| Send Command | Any Redis command (dynamic) | [Send Command](./operations/send-command) |
| Search Operations | Automated SCAN, HSCAN, SSCAN, ZSCAN iteration | [Search Operations](./operations/search-operations) |
| Sources (Listeners) | SUBSCRIBE, PSUBSCRIBE | [Sources](./sources) |

## Requirements

- **Mule Runtime**: 4.6.0 or later
- **Java**: 8, 11, or 17
- **Redis**: Any version supporting the commands you use

## Learn More

- [Set Up Guide](./set-up) — Installation and connection configuration
- [Operations Reference](./operations/) — All operations by category
- [Sources (Listeners)](./sources) — Pub/Sub event-driven flows
- [GitHub Repository](https://github.com/anypointcloud/mule-lettuce-redis-connector) — Source code and issues
