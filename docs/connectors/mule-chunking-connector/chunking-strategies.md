---
title: Chunking Strategies
description: How the Mule Chunking Connector cuts content into chunks, by size or by delimited records, and how the maximum chunk size works.
---

# Chunking Strategies

The `chunking-strategy` child element of [read-chunked](./operations/read-chunked) says how the content is cut into chunks. There are two: `by-size` and `by-delimiter`. Left unset (**None** in Anypoint Studio, the box left unticked in Anypoint Code Builder), the content is cut by size into chunks of 1 MB.

## By size

`by-size` cuts the content into chunks of `chunkSize` bytes; the last chunk holds what is left. This is what happens when no chunking strategy is given.

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

| Setting | Default | Description |
|---------|---------|-------------|
| `chunkSize` | `1048576` (1 MB) | Bytes in each chunk but the last |

When chunking by size, each chunk's `recordCount` is empty (`null`).

## By delimiter

`by-delimiter` cuts the content into chunks of `recordsPerChunk` records, where a record ends with the delimiter. With a newline delimiter, the default, and 1000 records per chunk, each chunk is 1000 lines, whatever number of bytes that is:

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

| Setting | Default | Description |
|---------|---------|-------------|
| `delimiter` | a newline | The exact sequence that ends a record, as text or as a DataWeave expression |
| `encoding` | `UTF-8` | The character encoding that turns the delimiter into bytes |
| `recordsPerChunk` | required | The number of records in each chunk |
| `maxChunkSize` | `1048576` (1 MB) | The most bytes a chunk may hold |

Each chunk's `recordCount` is the number of records it holds.

### How records are cut

- **The delimiter stays in the data.** A chunk ends with the delimiter that ends its last record.
- **Two delimiters in a row are an empty record**, and it counts.
- **Content that ends with a delimiter** does not produce an extra, empty chunk. **Content that ends without one** still has its final record, and it counts.
- **The last chunk holds whatever is left**, usually fewer records than `recordsPerChunk`.
- **The delimiter is matched exactly.** Escape sequences are not interpreted: `delimiter="\n"` is a backslash followed by `n`. A character that cannot be typed is written as an expression.

### Delimiter as text

```xml
<chunking:read-chunked>
    <chunking:chunking-strategy>
        <chunking:by-delimiter delimiter="|" recordsPerChunk="100"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index) holds $(payload.recordCount) records']"/>
</foreach>
```

### Delimiter as an expression

Here a carriage return and line feed:

```xml
<chunking:read-chunked>
    <chunking:chunking-strategy>
        <chunking:by-delimiter delimiter="#['\r\n']" encoding="UTF-8" recordsPerChunk="1000"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index) holds $(payload.recordCount) lines']"/>
</foreach>
```

The sample application's `by-delimiter-expression` flow uses the ASCII record separator (0x1E), which cannot be typed:

```xml
<chunking:read-chunked doc:name="Read chunked, records end with RS">
    <chunking:chunking-strategy>
        <chunking:by-delimiter delimiter="#['\u001e']" recordsPerChunk="5"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
```

An empty delimiter fails with `CHUNKING:INVALID_DELIMITER`. Written as text it is rejected when the application loads, so in practice this comes from an expression that gives empty text. An `encoding` the runtime does not recognise fails with `CHUNKING:INVALID_PARAMETER`. See [Errors](./errors).

## The maximum chunk size never cuts a record

`maxChunkSize` bounds the memory a chunk needs, and it never cuts a record. When the next record would take a chunk past `maxChunkSize` bytes, counting the delimiter that ends the record, the chunk ends before that record, and the record starts the next chunk whole.

::: warning A chunk can hold fewer records than recordsPerChunk
A chunk can hold fewer records than `recordsPerChunk` even when more records follow, and this is not an error. If `recordsPerChunk` records add up to more than `maxChunkSize`, most chunks will be short. `recordCount` is how a flow sees it.
:::

Here 1000 records of 100 bytes do not fit in 64 KB, so each chunk but the last holds 655:

```xml
<chunking:read-chunked>
    <chunking:chunking-strategy>
        <chunking:by-delimiter recordsPerChunk="1000" maxChunkSize="65536"/>
    </chunking:chunking-strategy>
</chunking:read-chunked>
<foreach>
    <choice>
        <when expression="#[not payload.last and payload.recordCount &lt; 1000]">
            <logger level="WARN" message="#['Chunk $(payload.index) holds only $(payload.recordCount) records']"/>
        </when>
    </choice>
</foreach>
```

### A record larger than the maximum

A single record larger than `maxChunkSize` cannot fit in any chunk. When the reading reaches it, the read fails, after the chunks before it have been delivered. Content with no delimiter in it is one record, so it fails the same way once it is larger than `maxChunkSize`. This failure happens while the chunks are read, so a flow handles it as described under [Failures while the chunks are read](./errors#failures-while-the-chunks-are-read).

## Chunk size and memory

A chunk is at most `chunkSize` bytes when chunking by size, and at most `maxChunkSize` bytes when chunking by delimiter. The memory the connector needs follows from that and from the number of chunks the [streaming strategy](./streaming-strategies) holds.
