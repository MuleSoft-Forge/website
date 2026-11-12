---
title: Upgrade from 0.2.0
description: Every change a Mule application using Chunking Connector 0.2.0 must make to use 1.0.0, and what else behaves differently.
---

# Upgrade from 0.2.0

1.0.0 changes the operation's settings. This page lists every change a 0.2.0 application must make, then what else behaves differently. 1.0.0 also includes the changes made after 0.2.0 that were never released as 0.2.1. The full record is the connector's [changelog](https://github.com/MuleSoft-Forge/mule-chunking-connector/blob/v1.0.0/CHANGELOG.md).

Before you start, check that the application runs on Mule 4.9.6 or later with Java 17, then change the dependency's version to `1.0.0` (see [Set Up](./set-up)).

## Changes a 0.2.0 application must make

### Move chunkSize into a by-size element

`chunkSize` is no longer an attribute of `read-chunked`. It moves into a `by-size` element under `chunking-strategy`:

```xml
<chunking:read-chunked>
    <chunking:chunking-strategy>
        <chunking:by-size chunkSize="65536"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
```

Without a `chunking-strategy` the content is cut by size into 1 MB chunks, as before.

### Remove the global configuration

`<chunking:config>` no longer accepts `<chunking:connection/>` or `defaultChunkSize`; remove them. `read-chunked` needs no `config-ref`, so the configuration element and every `config-ref` to it can go.

### Give every setting a positive value

Invalid values now fail instead of being replaced:

- A `chunkSize` of zero or less used to be replaced silently with 1 MB; it now fails with `CHUNKING:INVALID_CHUNK_SIZE`.
- Every streaming strategy setting must be a positive number; zero or less fails with `CHUNKING:INVALID_PARAMETER`. Zero no longer means "no limit" anywhere.

### Rename the streaming strategy settings

There is now one name for chunks held in memory, `maxInMemoryChunks`, and the settings now take effect:

| Strategy | 0.2.0 setting | 1.0.0 setting | 1.0.0 default |
|----------|---------------|---------------|---------------|
| `sliding-window` | `maxCachedChunks` | `maxInMemoryChunks`, now a hard limit | `3` |
| `in-memory` | `maxBufferSize` | `maxInMemoryChunks` | `10` |
| `in-memory` | `initialBufferSize`, `bufferSizeIncrement` | removed; remove them from the element | |
| `file-store` | `maxInMemoryInstances` | `maxInMemoryChunks` | `10` |

### Check what in-memory and file-store will hold

In 0.2.0 both handed the chunks to the runtime's default repeatable streaming and ignored their settings. They now do what their settings say:

- `in-memory` fails the read when it would hold more than `maxInMemoryChunks` chunks (10 by default, about 10 MB at 1 MB chunks). An application that reads more chunks than that must raise the setting or use `file-store`.
- `file-store` keeps `maxInMemoryChunks` chunks in memory and writes the rest to a temporary file.

See [Streaming Strategies](./streaming-strategies).

### Check the sliding window's readers

In 0.2.0 a chunk was let go as soon as every reader reading at that moment had passed it, so a reader that started a moment later, such as the second route of a `scatter-gather`, found the chunks gone. Now:

- with `readers` not set, chunks are kept up to `maxInMemoryChunks`, and only the oldest that every reader so far has read are then let go;
- with `readers` set, a chunk is let go once that many readers have read it.

A flow whose readers start further apart than `maxInMemoryChunks` chunks must set `readers`. A read that would hold more than `maxInMemoryChunks` chunks now fails instead of growing. See [Sliding Window Readers](./sliding-window-readers).

### Replace handlers for CHUNKING:CACHE_OVERFLOW

`CHUNKING:CACHE_OVERFLOW` is no longer declared; it was never raised. A failure while the chunks are being read, such as the source failing or a streaming strategy's limit being reached, reaches the flow as `MULE:UNKNOWN` inside `foreach` (`MULE:EXPRESSION` inside a DataWeave expression). Replace a handler for `CHUNKING:CACHE_OVERFLOW` with one for `ANY` around the `foreach`, since an error handler cannot name `MULE:UNKNOWN`:

```xml
<chunking:read-chunked>
    <chunking:chunking-strategy>
        <chunking:by-delimiter recordsPerChunk="1000" maxChunkSize="65536"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
<try>
    <foreach>
        <logger level="INFO" message="#['Chunk $(payload.index) holds $(payload.recordCount) records']"/>
    </foreach>
    <error-handler>
        <on-error-continue type="ANY">
            <logger level="ERROR" message="#['Reading the chunks failed: ' ++ error.description]"/>
        </on-error-continue>
    </error-handler>
</try>
```

`CHUNKING:READ_ERROR` is now raised only when there is no content. See [Errors](./errors).

### Read the chunk's flags as payload.first and payload.last

The 0.2.0 documentation showed `payload.isFirst` and `payload.isLast`, which give `null` in a flow. Use `payload.first` and `payload.last`.

### Java code using the Chunk type

The `Chunk` Java type is now read-only: its public constructor and `update(...)` method are gone.

## What else behaves differently

These need no change to an application, but you may notice them.

- **Chunking by delimiter is new.** `by-delimiter` cuts the content into chunks of `recordsPerChunk` delimited records, and each chunk's `recordCount` says how many it holds. See [Chunking Strategies](./chunking-strategies).
- **New error types.** `CHUNKING:INVALID_PARAMETER` is the parent of `CHUNKING:INVALID_CHUNK_SIZE` and of the new `CHUNKING:INVALID_RECORDS_PER_CHUNK` and `CHUNKING:INVALID_DELIMITER`. A flow that already handles `CHUNKING:INVALID_CHUNK_SIZE` is unaffected.
- **Chunks are released when the event ends.** What `sliding-window`, `in-memory` and `file-store` hold is released when the event that read the chunks ends, and `file-store` deletes its temporary file then. A read after that fails rather than finding no chunks.
- **`file-store` no longer needs the Mule Enterprise runtime.**
- **A reader is only what reads a chunk.** The sliding window counts as a reader only what has read a chunk, so a cursor that DataWeave opens to check the chunks' type, and never reads, no longer holds chunks back, and no warning is logged for it.
- **Nothing is logged at INFO.** The line each invocation writes with its settings is now at DEBUG, with the detail of each chunk; 0.2.0 wrote it at INFO. See [Logging](./set-up#logging).
- **Fixes.**
  - Under the non-repeatable strategy, a chunk shorter than the chunk size (such as the last) had `data` holding bytes left over from the chunk before. Every chunk's `data` now holds exactly its bytes.
  - A failure of the source while `foreach` read the chunks under the non-repeatable strategy left the flow waiting forever. It is now raised to the flow.
  - A failure while checking for more data was taken for the end of the data, so the chunks stopped early with no error. It is now raised.
  - Under the sliding window, the second route of a `scatter-gather` could find the chunks gone because it started a moment after the first.
