---
title: Operations
description: Available operations for the Mule Chunking Connector
---

# Operations

The Chunking Connector has one operation. It needs no global configuration element.

## Available operations

| Operation | Studio name | Description | Output |
|-----------|-------------|-------------|--------|
| [read-chunked](./read-chunked) | Read Chunked | Reads content as a sequence of chunks, by size or by delimited records | The chunks, for `foreach` or another reader |

## How the operation is shaped

`read-chunked` takes the content to chunk, the message payload by default, and two optional child elements:

- **`chunking-strategy`**: how the content is cut into chunks, [`by-size`](../chunking-strategies#by-size) or [`by-delimiter`](../chunking-strategies#by-delimiter). Left unset, by size in chunks of 1 MB.
- **`streaming-strategy`**: how the chunks are held, [`non-repeatable`](../streaming-strategies#non-repeatable), [`sliding-window`](../sliding-window-readers), [`in-memory`](../streaming-strategies#in-memory) or [`file-store`](../streaming-strategies#file-store). Left unset, `non-repeatable`: the chunks can be read once, in order.

A flow reads the chunks after the operation, usually with `foreach`:

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

**Learn more:** [read-chunked operation reference](./read-chunked)
