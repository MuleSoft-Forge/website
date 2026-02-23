---
title: Operations
description: Complete reference of all operations in the Mule Lettuce Redis Connector, organized by Redis command category.
---

# Operations

The Mule Lettuce Redis Connector provides operations in two categories:

- **Category A — Redis Command Mirrors**: Operations that map directly to a single Redis command. These are reference-style: if you know the Redis command, the operation works the same way.
- **Category B — Value-Add Features**: Operations that go beyond a single command, providing automation or capabilities not available in raw Redis.

---

## Category A: Redis Command Operations

### Server

| Operation | Redis Command | Page |
|-----------|--------------|------|
| PING | [PING](https://redis.io/docs/latest/commands/ping/) | [Server](./server#ping) |

### Key / Value

| Operation | Redis Command | Page |
|-----------|--------------|------|
| APPEND | [APPEND](https://redis.io/docs/latest/commands/append/) | [Key / Value](./key-value#append) |
| COPY | [COPY](https://redis.io/docs/latest/commands/copy/) | [Key / Value](./key-value#copy) |
| DECR | [DECR](https://redis.io/docs/latest/commands/decr/) | [Key / Value](./key-value#decr) |
| DEL | [DEL](https://redis.io/docs/latest/commands/del/) | [Key / Value](./key-value#del) |
| EXPIRE | [EXPIRE](https://redis.io/docs/latest/commands/expire/) | [Key / Value](./key-value#expire) |
| GET | [GET](https://redis.io/docs/latest/commands/get/) | [Key / Value](./key-value#get) |
| GETDEL | [GETDEL](https://redis.io/docs/latest/commands/getdel/) | [Key / Value](./key-value#getdel) |
| GETEX | [GETEX](https://redis.io/docs/latest/commands/getex/) | [Key / Value](./key-value#getex) |
| GETRANGE | [GETRANGE](https://redis.io/docs/latest/commands/getrange/) | [Key / Value](./key-value#getrange) |
| GETSET | [GETSET](https://redis.io/docs/latest/commands/getset/) | [Key / Value](./key-value#getset) |
| INCR | [INCR](https://redis.io/docs/latest/commands/incr/) | [Key / Value](./key-value#incr) |
| MGET | [MGET](https://redis.io/docs/latest/commands/mget/) | [Key / Value](./key-value#mget) |
| MSET | [MSET](https://redis.io/docs/latest/commands/mset/) | [Key / Value](./key-value#mset) |
| PERSIST | [PERSIST](https://redis.io/docs/latest/commands/persist/) | [Key / Value](./key-value#persist) |
| PEXPIRE | [PEXPIRE](https://redis.io/docs/latest/commands/pexpire/) | [Key / Value](./key-value#pexpire) |
| PTTL | [PTTL](https://redis.io/docs/latest/commands/pttl/) | [Key / Value](./key-value#pttl) |
| SCAN | [SCAN](https://redis.io/docs/latest/commands/scan/) | [Key / Value](./key-value#scan) |
| SET | [SET](https://redis.io/docs/latest/commands/set/) | [Key / Value](./key-value#set) |
| TOUCH | [TOUCH](https://redis.io/docs/latest/commands/touch/) | [Key / Value](./key-value#touch) |
| TTL | [TTL](https://redis.io/docs/latest/commands/ttl/) | [Key / Value](./key-value#ttl) |

### Hash

| Operation | Redis Command | Page |
|-----------|--------------|------|
| HEXISTS | [HEXISTS](https://redis.io/docs/latest/commands/hexists/) | [Hash](./hash#hexists) |
| HGET | [HGET](https://redis.io/docs/latest/commands/hget/) | [Hash](./hash#hget) |
| HGETALL | [HGETALL](https://redis.io/docs/latest/commands/hgetall/) | [Hash](./hash#hgetall) |
| HINCRBY | [HINCRBY](https://redis.io/docs/latest/commands/hincrby/) | [Hash](./hash#hincrby) |
| HLEN | [HLEN](https://redis.io/docs/latest/commands/hlen/) | [Hash](./hash#hlen) |
| HMGET | [HMGET](https://redis.io/docs/latest/commands/hmget/) | [Hash](./hash#hmget) |
| HSCAN | [HSCAN](https://redis.io/docs/latest/commands/hscan/) | [Hash](./hash#hscan) |
| HSET | [HSET](https://redis.io/docs/latest/commands/hset/) | [Hash](./hash#hset) |

### List

| Operation | Redis Command | Page |
|-----------|--------------|------|
| BLMOVE | [BLMOVE](https://redis.io/docs/latest/commands/blmove/) | [List](./list#blmove) |
| BLPOP | [BLPOP](https://redis.io/docs/latest/commands/blpop/) | [List](./list#blpop) |
| BRPOP | [BRPOP](https://redis.io/docs/latest/commands/brpop/) | [List](./list#brpop) |
| LMOVE | [LMOVE](https://redis.io/docs/latest/commands/lmove/) | [List](./list#lmove) |
| LPOP | [LPOP](https://redis.io/docs/latest/commands/lpop/) | [List](./list#lpop) |
| LPUSH | [LPUSH](https://redis.io/docs/latest/commands/lpush/) | [List](./list#lpush) |
| LSET | [LSET](https://redis.io/docs/latest/commands/lset/) | [List](./list#lset) |
| RPOP | [RPOP](https://redis.io/docs/latest/commands/rpop/) | [List](./list#rpop) |
| RPUSH | [RPUSH](https://redis.io/docs/latest/commands/rpush/) | [List](./list#rpush) |

### Set

| Operation | Redis Command | Page |
|-----------|--------------|------|
| SADD | [SADD](https://redis.io/docs/latest/commands/sadd/) | [Set](./set#sadd) |
| SCARD | [SCARD](https://redis.io/docs/latest/commands/scard/) | [Set](./set#scard) |
| SDIFF | [SDIFF](https://redis.io/docs/latest/commands/sdiff/) | [Set](./set#sdiff) |
| SISMEMBER | [SISMEMBER](https://redis.io/docs/latest/commands/sismember/) | [Set](./set#sismember) |
| SMEMBERS | [SMEMBERS](https://redis.io/docs/latest/commands/smembers/) | [Set](./set#smembers) |
| SMISMEMBER | [SMISMEMBER](https://redis.io/docs/latest/commands/smismember/) | [Set](./set#smismember) |
| SPOP | [SPOP](https://redis.io/docs/latest/commands/spop/) | [Set](./set#spop) |
| SRANDMEMBER | [SRANDMEMBER](https://redis.io/docs/latest/commands/srandmember/) | [Set](./set#srandmember) |
| SREM | [SREM](https://redis.io/docs/latest/commands/srem/) | [Set](./set#srem) |
| SSCAN | [SSCAN](https://redis.io/docs/latest/commands/sscan/) | [Set](./set#sscan) |

### Sorted Set

| Operation | Redis Command | Page |
|-----------|--------------|------|
| ZADD | [ZADD](https://redis.io/docs/latest/commands/zadd/) | [Sorted Set](./sorted-set#zadd) |
| ZINCRBY | [ZINCRBY](https://redis.io/docs/latest/commands/zincrby/) | [Sorted Set](./sorted-set#zincrby) |
| ZRANK | [ZRANK](https://redis.io/docs/latest/commands/zrank/) | [Sorted Set](./sorted-set#zrank) |
| ZSCAN | [ZSCAN](https://redis.io/docs/latest/commands/zscan/) | [Sorted Set](./sorted-set#zscan) |
| ZSCORE | [ZSCORE](https://redis.io/docs/latest/commands/zscore/) | [Sorted Set](./sorted-set#zscore) |

### Geospatial

| Operation | Redis Command | Page |
|-----------|--------------|------|
| GEOADD | [GEOADD](https://redis.io/docs/latest/commands/geoadd/) | [Geospatial](./geospatial#geoadd) |
| GEODIST | [GEODIST](https://redis.io/docs/latest/commands/geodist/) | [Geospatial](./geospatial#geodist) |
| GEOPOS | [GEOPOS](https://redis.io/docs/latest/commands/geopos/) | [Geospatial](./geospatial#geopos) |
| GEOSEARCH | [GEOSEARCH](https://redis.io/docs/latest/commands/geosearch/) | [Geospatial](./geospatial#geosearch) |

### Stream

| Operation | Redis Command | Page |
|-----------|--------------|------|
| XACK | [XACK](https://redis.io/docs/latest/commands/xack/) | [Stream](./stream#xack) |
| XADD | [XADD](https://redis.io/docs/latest/commands/xadd/) | [Stream](./stream#xadd) |
| XDEL | [XDEL](https://redis.io/docs/latest/commands/xdel/) | [Stream](./stream#xdel) |
| XGROUP CREATE | [XGROUP CREATE](https://redis.io/docs/latest/commands/xgroup-create/) | [Stream](./stream#xgroup-create) |
| XGROUP DESTROY | [XGROUP DESTROY](https://redis.io/docs/latest/commands/xgroup-destroy/) | [Stream](./stream#xgroup-destroy) |
| XINFO GROUPS | [XINFO GROUPS](https://redis.io/docs/latest/commands/xinfo-groups/) | [Stream](./stream#xinfo-groups) |
| XRANGE | [XRANGE](https://redis.io/docs/latest/commands/xrange/) | [Stream](./stream#xrange) |
| XREAD | [XREAD](https://redis.io/docs/latest/commands/xread/) | [Stream](./stream#xread) |
| XREADGROUP | [XREADGROUP](https://redis.io/docs/latest/commands/xreadgroup/) | [Stream](./stream#xreadgroup) |
| XTRIM | [XTRIM](https://redis.io/docs/latest/commands/xtrim/) | [Stream](./stream#xtrim) |

### Channel

| Operation | Redis Command | Page |
|-----------|--------------|------|
| PUBLISH | [PUBLISH](https://redis.io/docs/latest/commands/publish/) | [Channel](./channel#publish) |

---

## Category B: Value-Add Operations

| Operation | Description | Page |
|-----------|-------------|------|
| Send Command | Execute any Redis command dynamically by name. Use for commands not yet available as dedicated operations. | [Send Command](./send-command) |
| Search Keys | Stream all keys matching a pattern via automated SCAN cursor iteration | [Search Operations](./search-operations#search-keys) |
| Search Hash Fields | Stream all fields in a hash via automated HSCAN cursor iteration | [Search Operations](./search-operations#search-hash-fields) |
| Search Set Members | Stream all members in a set via automated SSCAN cursor iteration | [Search Operations](./search-operations#search-set-members) |
| Search Sorted Set Members | Stream all members and scores in a sorted set via automated ZSCAN cursor iteration | [Search Operations](./search-operations#search-sorted-set-members) |

---

## Sources (Event Listeners)

Sources are not operations — they are Mule event listeners that trigger flows when Redis delivers a message. See the [Sources](../sources) page for SUBSCRIBE and PSUBSCRIBE.
