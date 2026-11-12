---
title: Mule Chunking Connector
description: Read content of any size as a sequence of chunks, cut by size or by delimited records, and process it one chunk at a time with foreach.
---

# Mule Chunking Connector

<AtAGlance id="chunking" />

The Chunking Connector reads content as a sequence of chunks, so that a flow can process content of any size one chunk at a time with `foreach`. Chunks are cut either by size, a number of bytes each, or by delimiter, a number of delimited records each, so that every chunk of a delimited file can be processed on its own.

The connector has one operation, [read-chunked](./operations/read-chunked), and needs no global configuration element.

## Features

- **Chunking by size**: chunks of a fixed number of bytes, 1 MB unless you say otherwise; the last chunk holds what is left. See [Chunking Strategies](./chunking-strategies#by-size).
- **Chunking by delimiter**: chunks of a fixed number of records, each record ending with a delimiter you choose (a newline by default). A maximum chunk size bounds the memory a chunk needs, and it never cuts a record. See [Chunking Strategies](./chunking-strategies#by-delimiter).
- **Four streaming strategies**: read the chunks once, in order (the default); by several readers at the same time, through a sliding window; or any number of times, from memory or from a temporary file. Every limit is counted in chunks. See [Streaming Strategies](./streaming-strategies).
- **Exact chunks**: every chunk is an exact slice of the content. The chunks' data, taken in order, reproduce the content byte for byte.
- **Errors you can handle**: invalid settings raise `CHUNKING` errors before any chunk is read, and a failure while the chunks are read is always raised, never reported as the content having ended early. See [Errors](./errors).

## Quick example

With no settings, `read-chunked` cuts the message payload into chunks of 1 MB, and `foreach` processes them one at a time:

```xml
<chunking:read-chunked/>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index): $(payload.length) bytes, last: $(payload.last)']"/>
</foreach>
```

To cut a delimited file into chunks of 1000 lines each, whatever number of bytes that is:

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

## Two choices

`read-chunked` has two optional child elements. Each is a choice, and leaving it unset means the default.

| Child element | What it decides | Options | Left unset |
|---------------|-----------------|---------|------------|
| `chunking-strategy` | How the content is cut into chunks | [`by-size`](./chunking-strategies#by-size), [`by-delimiter`](./chunking-strategies#by-delimiter) | By size, in chunks of 1 MB |
| `streaming-strategy` | How the chunks are held | [`non-repeatable`](./streaming-strategies#non-repeatable), [`sliding-window`](./sliding-window-readers), [`in-memory`](./streaming-strategies#in-memory), [`file-store`](./streaming-strategies#file-store) | `non-repeatable`: the chunks can be read once, in order |

In Anypoint Studio a strategy left as **None**, and in Anypoint Code Builder one whose box is left unticked, means the default.

## Each chunk

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

- **Mule Runtime**: 4.9.6 or later
- **Java**: 17
- **Global configuration**: none needed

## Upgrading from 0.2.0

1.0.0 changes the operation's settings and the errors a flow can receive, and the chunk's flags are read as `payload.first` and `payload.last`, not the `payload.isFirst` and `payload.isLast` that 0.2.0's documentation showed. A 0.2.0 application needs changes before it runs on 1.0.0: see [Upgrade from 0.2.0](./upgrading) for every one.

## Learn more

- [Set Up](./set-up): installation, the sample application and logging
- [read-chunked](./operations/read-chunked): the operation and every setting
- [Chunking Strategies](./chunking-strategies): by size and by delimiter
- [Streaming Strategies](./streaming-strategies): how the chunks are held, and how the settings compare with Mule's own streaming
- [Sliding Window Readers](./sliding-window-readers): what a reader is, and how to choose the sliding window's settings
- [Errors](./errors): the errors the operation raises, and failures while the chunks are read
- [Upgrade from 0.2.0](./upgrading): every change a 0.2.0 application must make
- [GitHub repository](https://github.com/MuleSoft-Forge/mule-chunking-connector): source code and issues
