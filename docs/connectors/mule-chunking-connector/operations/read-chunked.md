---
title: read-chunked
description: Read content as a sequence of chunks, by size or by delimited records, for processing one chunk at a time with foreach.
---

# read-chunked

Reads content as a sequence of chunks, so that a flow can process content of any size one chunk at a time with `foreach`. In Anypoint Studio the operation is shown as **Read Chunked**.

## XML shape

Both child elements are optional. This example, from the connector's sample application, cuts the content into chunks of 5 records and keeps up to 20 chunks in memory so that they can be read more than once:

```xml
<chunking:read-chunked doc:name="Read chunked, in-memory">
    <chunking:chunking-strategy>
        <chunking:by-delimiter recordsPerChunk="5"/>
    </chunking:chunking-strategy>
    <chunking:streaming-strategy>
        <chunking:in-memory maxInMemoryChunks="20"/>
    </chunking:streaming-strategy>
</chunking:read-chunked>
```

The operation needs no `config-ref`.

## Parameters

| Parameter | Studio name | Required | Default | Description |
|-----------|-------------|----------|---------|-------------|
| Content | Content | No | The message payload | The content to chunk |
| `chunking-strategy` | Chunking Strategy | No | By size, in chunks of 1 MB | How the content is cut into chunks: `by-size` or `by-delimiter`. See [Chunking Strategies](../chunking-strategies). |
| `streaming-strategy` | Streaming Strategy | No | `non-repeatable` | How the chunks are held: `non-repeatable`, `sliding-window`, `in-memory` or `file-store`. See [Streaming Strategies](../streaming-strategies). |

In Anypoint Studio a strategy left as **None**, and in Anypoint Code Builder one whose box is left unticked, means the default.

### Chunking strategy settings

| Element | Setting | Studio name | Default | Description |
|---------|---------|-------------|---------|-------------|
| `by-size` | `chunkSize` | Chunk Size | `1048576` (1 MB) | Bytes in each chunk but the last |
| `by-delimiter` | `delimiter` | Delimiter | a newline | The exact sequence that ends a record, as text or as a DataWeave expression |
| `by-delimiter` | `encoding` | Encoding | `UTF-8` | The character encoding that turns the delimiter into bytes |
| `by-delimiter` | `recordsPerChunk` | Records Per Chunk | required | The number of records in each chunk |
| `by-delimiter` | `maxChunkSize` | Max Chunk Size | `1048576` (1 MB) | The most bytes a chunk may hold; it never cuts a record |

### Streaming strategy settings

| Element | Setting | Studio name | Default | Description |
|---------|---------|-------------|---------|-------------|
| `non-repeatable` | none | | | The chunks can be read once, in order |
| `sliding-window` | `maxInMemoryChunks` | Max In-Memory Chunks | `3` | The most chunks held in memory, a positive number; a read that would hold more fails |
| `sliding-window` | `readers` | Readers | not set | How many readers read the chunks. See [Sliding Window Readers](../sliding-window-readers). |
| `in-memory` | `maxInMemoryChunks` | Max In-Memory Chunks | `10` | The most chunks held in memory, a positive number; reading one more fails the read |
| `file-store` | `maxInMemoryChunks` | Max In-Memory Chunks | `10` | The most chunks held in memory, a positive number; older chunks go to a temporary file |

Every size is in bytes, and every limit on what is held is counted in chunks. Every setting that is a number must be positive; nothing means "no limit".

## Output

The chunks, ready for `foreach` or another reader. Whether they can be read more than once, and by how many readers, depends on the [streaming strategy](../streaming-strategies).

Each chunk has these properties:

| Property | Type | Description |
|----------|------|-------------|
| `payload.data` | binary (`byte[]`) | Exactly the chunk's bytes |
| `payload.index` | number | The chunk's position in the sequence, counting from 0 |
| `payload.offset` | number | The position of the chunk's first byte in the content, counting from 0 |
| `payload.length` | number | The number of bytes in the chunk |
| `payload.first` | boolean | `true` for the first chunk |
| `payload.last` | boolean | `true` for the last chunk, including when the content ends exactly at the end of this chunk |
| `payload.recordCount` | number | When chunking by delimiter, the number of records the chunk holds; empty (`null`) when chunking by size |

Every chunk is an exact slice of the content: the chunks' `data`, taken in order, reproduce the content byte for byte. Empty content produces no chunks.

## Examples

### Default settings

With no settings, the operation cuts the message payload into chunks of 1 MB, and `foreach` processes them one at a time:

```xml
<chunking:read-chunked/>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index): $(payload.length) bytes, last: $(payload.last)']"/>
</foreach>
```

### By size

```xml
<chunking:read-chunked>
    <chunking:chunking-strategy>
        <chunking:by-size chunkSize="65536"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index): $(payload.length) bytes from byte $(payload.offset)']"/>
</foreach>
```

### By delimiter

With a newline delimiter, the default, and 1000 records per chunk, each chunk is 1000 lines, whatever number of bytes that is:

```xml
<chunking:read-chunked>
    <chunking:chunking-strategy>
        <chunking:by-delimiter recordsPerChunk="1000"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index) holds $(payload.recordCount) lines']"/>
</foreach>
```

More examples are on [Chunking Strategies](../chunking-strategies), [Streaming Strategies](../streaming-strategies) and [Sliding Window Readers](../sliding-window-readers).

## Errors

The operation raises these errors itself, before any chunk is read, so a flow can handle them by type:

| Error | When |
|-------|------|
| `CHUNKING:INVALID_PARAMETER` | A value is not valid. Parent of the three errors below. Raised itself for an `encoding` the runtime does not recognise and for a streaming strategy setting that is not positive. |
| `CHUNKING:INVALID_CHUNK_SIZE` | `chunkSize` or `maxChunkSize` is not a positive number of bytes |
| `CHUNKING:INVALID_RECORDS_PER_CHUNK` | `recordsPerChunk` is not positive |
| `CHUNKING:INVALID_DELIMITER` | The delimiter is empty |
| `CHUNKING:READ_ERROR` | There is no content to read: the content is `null` |

A failure while the chunks are read, after the operation has returned, reaches the flow with Mule's own error types instead. See [Errors](../errors) for both, with examples of handling them.

## See also

- [Operations overview](./index.md)
- [Set Up](../set-up.md)
- [Upgrade from 0.2.0](../upgrading.md)
- [Sample application](https://github.com/MuleSoft-Forge/mule-chunking-connector/tree/v1.0.0/examples/chunking-sample-app)
