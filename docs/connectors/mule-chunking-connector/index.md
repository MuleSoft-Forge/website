---
title: Mule Chunking Connector
description: Process any stream in chunks, by size or by record, without holding the whole content in memory.
---

# Mule Chunking Connector

<AtAGlance id="chunking" />

The Chunking Connector lets a flow process any stream in chunks. Content of any size, from any source, arrives as a sequence of bounded pieces, cut by size or by record, so the flow never needs the whole of it in memory.

Mule 4 made [repeatable streams](https://docs.mulesoft.com/mule-runtime/latest/streaming-about) its default so that a stream can be read more than once and by more than one component at the same time. The connector is built to honor that principle for chunks: its streaming strategies give up as little of it as the memory you allow.

Uses include:

- sending content onward in parts, as storage and transfer services that accept multipart uploads expect;
- handing records to another system in batches, a set number of lines or records at a time;
- working through content larger than the memory available.

The connector has one operation, [read-chunked](./operations/read-chunked), and needs no global configuration element.

## Features

- `by-size` cuts chunks of a fixed number of bytes, 1 MB by default; the last chunk holds what is left. See [Chunking Strategies](./chunking-strategies#by-size).
- `by-delimiter` cuts chunks of a fixed number of records, each record ending with a delimiter you choose, a newline by default. A maximum chunk size bounds the memory a chunk needs, and it never cuts a record. See [Chunking Strategies](./chunking-strategies#by-delimiter).
- Four streaming strategies decide how the chunks are held. The chunks can be read once, in order (the default); by several readers at the same time, through a sliding window; or any number of times, from memory or from a temporary file. Every limit is counted in chunks. See [Streaming Strategies](./streaming-strategies).
- Every chunk is an exact slice of the content. The chunks' data, taken in order, reproduce the content byte for byte.
- Invalid settings raise `CHUNKING` errors before any chunk is read. A failure while the chunks are read is always raised, and the content is never reported as having ended early. See [Errors](./errors).

## Quick example

With no settings, `read-chunked` cuts the message payload into chunks of 1 MB, and `foreach` processes them one at a time:

```xml
<chunking:read-chunked/>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index): $(payload.length) bytes, last: $(payload.last)']"/>
</foreach>
```

To cut content into chunks of 1000 lines each, regardless of their size in bytes:

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

## Chunking and streaming strategies

`read-chunked` has two optional child elements. Leaving one unset means the default.

| Child element | What it decides | Options | Left unset |
|---------------|-----------------|---------|------------|
| `chunking-strategy` | How the content is cut into chunks | [`by-size`](./chunking-strategies#by-size), [`by-delimiter`](./chunking-strategies#by-delimiter) | By size, in chunks of 1 MB |
| `streaming-strategy` | How the chunks are held | [`non-repeatable`](./streaming-strategies#non-repeatable), [`sliding-window`](./sliding-window-readers), [`in-memory`](./streaming-strategies#in-memory), [`file-store`](./streaming-strategies#file-store) | `non-repeatable`: the chunks can be read once, in order |

In Anypoint Studio a strategy left as **None**, and in Anypoint Code Builder one whose box is left unticked, means the default.

## Chunk properties

Each chunk has these properties, read in a flow as shown:

| Property | Type | Description |
|----------|------|-------------|
| `payload.data` | binary (`byte[]`) | Exactly the chunk's bytes |
| `payload.index` | number | The chunk's position in the sequence, counting from 0 |
| `payload.offset` | number | The position of the chunk's first byte in the content, counting from 0 |
| `payload.length` | number | The number of bytes in the chunk |
| `payload.first` | boolean | `true` for the first chunk |
| `payload.last` | boolean | `true` for the last chunk, including when the content ends exactly at the end of this chunk |
| `payload.recordCount` | number | When chunking by delimiter, the number of records the chunk holds; empty (`null`) when chunking by size |

Empty content produces no chunks.

## Requirements

Mule Runtime 4.9.6 or later, and Java 17. No global configuration element is needed.

## Upgrading from 0.2.0

1.0.0 changes the operation's settings and the errors a flow can receive. The chunk's flags are read as `payload.first` and `payload.last`; 0.2.0's documentation showed `payload.isFirst` and `payload.isLast` instead. A 0.2.0 application needs changes before it runs on 1.0.0, and [Upgrade from 0.2.0](./upgrading) lists every one.

## Source code

The source code and the issue tracker are in the connector's [GitHub repository](https://github.com/MuleSoft-Forge/mule-chunking-connector).
