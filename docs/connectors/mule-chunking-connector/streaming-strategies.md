---
title: Streaming Strategies
description: How the Mule Chunking Connector holds chunks, when it releases them, and how its settings correspond to Mule's own streaming strategies.
---

# Streaming Strategies

The `streaming-strategy` child element of [read-chunked](./operations/read-chunked) says how the chunks are held: whether they can be read more than once, by how many readers, and how many are kept in memory. Left unset (**None** in Anypoint Studio, the box left unticked in Anypoint Code Builder), the chunks are `non-repeatable`.

| Strategy | The chunks can be read | Chunks held in memory |
|----------|------------------------|-----------------------|
| [`non-repeatable`](#non-repeatable) (default) | once, in order | one between reads; up to about three while one is read |
| [`sliding-window`](#sliding-window) | by several readers at the same time | at most `maxInMemoryChunks` |
| [`in-memory`](#in-memory) | any number of times | every chunk, at most `maxInMemoryChunks` |
| [`file-store`](#file-store) | any number of times | at most `maxInMemoryChunks`; the rest on disk |

A chunk is at most `chunkSize` bytes when chunking by size, and at most `maxChunkSize` bytes when chunking by delimiter, so memory follows from the number of chunks held. `maxInMemoryChunks` must be a positive number on every strategy that has it; zero or less fails with `CHUNKING:INVALID_PARAMETER`.

## When the chunks are released

What `sliding-window`, `in-memory` and `file-store` hold is released when the event that read the chunks ends: after the flow's last processor, after any asynchronous work the event started, and whether the flow succeeded or failed. `file-store` deletes its temporary file then. A read after that fails with a message saying the chunks were released.

## non-repeatable

The default. The chunks can be read once, in order, as `foreach` does; a second pass over them finds none.

```xml
<chunking:read-chunked>
    <chunking:streaming-strategy>
        <chunking:non-repeatable/>
    </chunking:streaming-strategy>
</chunking:read-chunked>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index)']"/>
</foreach>
```

Memory does not grow with the size of the content. Between reads the connector holds one chunk; while it reads a chunk it needs up to about three times the chunk size (the maximum chunk size when chunking by delimiter).

The strategy has no settings.

## sliding-window

Several readers read the chunks, and each chunk is let go once the readers no longer need it, with never more than `maxInMemoryChunks` held in memory. Nothing is written to disk. Here both routes of a `scatter-gather` read every chunk, and a chunk is let go as soon as both have read it:

```xml
<chunking:read-chunked>
    <chunking:streaming-strategy>
        <chunking:sliding-window maxInMemoryChunks="10" readers="2"/>
    </chunking:streaming-strategy>
</chunking:read-chunked>
<scatter-gather>
    <route>
        <foreach>
            <logger level="INFO" message="#['Route 1, chunk $(payload.index)']"/>
        </foreach>
    </route>
    <route>
        <foreach>
            <logger level="INFO" message="#['Route 2, chunk $(payload.index)']"/>
        </foreach>
    </route>
</scatter-gather>
```

| Setting | Default | Description |
|---------|---------|-------------|
| `maxInMemoryChunks` | `3` | The most chunks held in memory, a positive number; a read that would hold more fails |
| `readers` | not set | How many readers read the chunks |

::: warning Read about readers before using the sliding window
How the sliding window decides when a chunk can go is the thing to understand before using it: what counts as a reader, what `readers` changes, the three failures a flow can meet, and how a `scatter-gather`'s routes behave. See **[Sliding Window Readers](./sliding-window-readers)**.
:::

## in-memory

The chunks can be read any number of times, by any number of readers, because every chunk read is kept in memory, up to `maxInMemoryChunks`. When the next chunk would be one more than that, the read fails with a message giving the limit; no chunk is dropped. With the default of 10 and 1 MB chunks, up to about 10 MB is held.

```xml
<chunking:read-chunked>
    <chunking:streaming-strategy>
        <chunking:in-memory maxInMemoryChunks="100"/>
    </chunking:streaming-strategy>
</chunking:read-chunked>
<foreach>
    <logger level="INFO" message="#['First pass, chunk $(payload.index)']"/>
</foreach>
<foreach>
    <logger level="INFO" message="#['Second pass, chunk $(payload.index)']"/>
</foreach>
```

| Setting | Default | Description |
|---------|---------|-------------|
| `maxInMemoryChunks` | `10` | The most chunks held in memory, a positive number; reading one more fails the read |

## file-store

The chunks can be read any number of times, by any number of readers, with at most `maxInMemoryChunks` of them in memory. The most recently read chunks stay in memory; older chunks are written to a temporary file and read back when a reader needs them. Here a second loop reads every chunk again, most of them from the file:

```xml
<chunking:read-chunked>
    <chunking:streaming-strategy>
        <chunking:file-store maxInMemoryChunks="2"/>
    </chunking:streaming-strategy>
</chunking:read-chunked>
<foreach>
    <logger level="INFO" message="#['First pass, chunk $(payload.index)']"/>
</foreach>
<foreach>
    <logger level="INFO" message="#['Second pass, chunk $(payload.index)']"/>
</foreach>
```

| Setting | Default | Description |
|---------|---------|-------------|
| `maxInMemoryChunks` | `10` | The most chunks held in memory, a positive number; older chunks go to the temporary file |

- The file is created in the directory named by the `java.io.tmpdir` system property, named `mule-chunking-file-store-*.chunks`, only when a chunk has to be written. It needs as much disk space as the content less what is held in memory.
- The file is deleted when the event that read the chunks ends, as described under [When the chunks are released](#when-the-chunks-are-released).
- The connector writes the file itself, so this strategy does not need the Mule Enterprise runtime.

## The strategies beside Mule's own

The connector's strategies and settings have the connector's own names. Where one corresponds to a Mule streaming setting, it works like it, with these differences:

| Connector | Mule | How it differs |
|-----------|------|----------------|
| `non-repeatable` | `non-repeatable-iterable` | The same idea: read once, in order. |
| `in-memory` `maxInMemoryChunks` | `maxBufferSize` on `repeatable-in-memory-iterable` | Counted in chunks, in the connector's own buffer, not Mule's. Default 10; MuleSoft's documentation states no default for `maxBufferSize`. The buffer grows as chunks arrive, so there is nothing like `initialBufferSize` or `bufferSizeIncrement` to set. |
| `file-store` `maxInMemoryChunks` | `inMemoryObjects` on `repeatable-file-store-iterable` | Counted in chunks, in the connector's own store, not Mule's. The most recent chunks stay in memory and each older one is written to disk as the next arrives. Default 10, where Mule's is 500. No Enterprise runtime needed. |
| `sliding-window` `maxInMemoryChunks`, `readers` | none | No Mule counterpart. |

## Choosing a strategy

- Read the chunks once, in order, with one `foreach`: `non-repeatable`, the default.
- Read them with several readers at the same time, such as the routes of a `scatter-gather`, holding only a few in memory: `sliding-window`. See [Sliding Window Readers](./sliding-window-readers).
- Read them more than once, one reader after another, or by readers whose number or pace you cannot predict: `in-memory` while every chunk fits within `maxInMemoryChunks`, otherwise `file-store`.
