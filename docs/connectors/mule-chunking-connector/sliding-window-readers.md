---
title: Sliding Window Readers
description: What counts as a reader under the Mule Chunking Connector's sliding window, what the readers setting changes, the failures a flow can meet, and when to choose another strategy.
---

# Sliding Window Readers

The `sliding-window` [streaming strategy](./streaming-strategies) lets several readers read the chunks while holding only a few of them in memory. Each chunk is let go once the readers no longer need it, and never more than `maxInMemoryChunks` are held. Nothing is written to disk.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `maxInMemoryChunks` | `3` | The most chunks held in memory, a positive number; a read that would hold more fails |
| `readers` | not set | How many readers read the chunks, a positive number |

`maxInMemoryChunks` is a hard limit: the window never holds more. Either setting given as zero or less fails with `CHUNKING:INVALID_PARAMETER`.

## What counts as a reader

A reader is anything that reads at least one of the chunks: a `foreach`, a route of a `scatter-gather` that reads them, a DataWeave expression such as `sizeOf(payload)` or `payload[0]`.

Each time the chunks are read from the start counts as one reader, so two `foreach` over the same chunks are two readers. Something that opens the chunks and reads none of them is not a reader and holds nothing back.

## With readers set

Say `readers` is 2. A chunk is let go as soon as 2 readers have read it, and never before.

- Readers that run at the same time keep memory to the chunks between the slowest and the fastest.
- A reader that starts late still finds every chunk, because none is let go until it has read it.
- But the others can get no more than `maxInMemoryChunks` ahead of it, and one that would fails with the [first message below](#failures-and-what-to-change).

This is the sample application's `streaming-sliding-window` flow: both routes of a `scatter-gather` read all the chunks, and with `readers="2"` each chunk is let go as soon as both routes have read it. The limit of 10 leaves room for one route to run ahead.

```xml
<chunking:read-chunked doc:name="Read chunked, sliding-window, two readers">
    <chunking:chunking-strategy>
        <chunking:by-delimiter recordsPerChunk="5"/>
    </chunking:chunking-strategy>
    <chunking:streaming-strategy>
        <chunking:sliding-window maxInMemoryChunks="10" readers="2"/>
    </chunking:streaming-strategy>
</chunking:read-chunked>
<set-variable variableName="read" value="#[0]" doc:name="Chunks read: 0"/>
<scatter-gather doc:name="Two readers at once">
    <route>
        <foreach doc:name="Route 1 reads">
            <logger level="INFO" message="#['Route 1, chunk $(payload.index)']" doc:name="Log the chunk"/>
            <set-variable variableName="read" value="#[vars.read + 1]" doc:name="Count"/>
        </foreach>
        <set-payload value="#[vars.read]" doc:name="Route 1's count"/>
    </route>
    <route>
        <foreach doc:name="Route 2 reads">
            <logger level="INFO" message="#['Route 2, chunk $(payload.index)']" doc:name="Log the chunk"/>
            <set-variable variableName="read" value="#[vars.read + 1]" doc:name="Count"/>
        </foreach>
        <set-payload value="#[vars.read]" doc:name="Route 2's count"/>
    </route>
</scatter-gather>
```

## With readers not set

The window does not know how many readers to wait for. It keeps chunks until `maxInMemoryChunks` are held, and only then lets go of the oldest that every reader seen so far has read, to make room for the next.

- A reader that starts within that many chunks of the first finds every chunk; one that starts later cannot.
- Memory then sits at the limit rather than at the minimum.

When you know how many readers there are, set `readers`: each chunk is then let go as soon as that many readers have read it, and a reader that starts late still finds every chunk, within the limit described [above](#with-readers-set).

## Failures and what to change

There are three failures. Each fails the reader that meets it, with a message that starts as shown and says what to change:

| Message starts | What happened | What to change |
|----------------|---------------|----------------|
| `sliding-window: reading chunk N would hold more than maxInMemoryChunks (M) chunks in memory` | The chunks held are still owed to a reader that has not read them, and reading one more would pass the limit. With `readers` set, a declared reader has fallen that far behind or has not started; with it not set, a reader that has started has fallen that far behind. | Raise `maxInMemoryChunks`, or use `file-store`. |
| `sliding-window: chunk N is no longer held. readers is not set` | A reader started after the chunks it needed were let go. | Set `readers` to the number of readers. |
| `sliding-window: chunk N was already let go, because readers is R` | More readers read the chunks than `readers` says, and this one needed a chunk the declared readers had all read. | Set `readers` to the number of readers, counting each pass. |

These failures happen while the chunks are read, after `read-chunked` has returned, so they do not carry a `CHUNKING` error type. Inside `foreach` they reach the flow as `MULE:UNKNOWN`, and inside a DataWeave expression as `MULE:EXPRESSION`; handle them with `ANY` and tell them apart by `error.description`, which ends with the message above. See [Failures while the chunks are read](./errors#failures-while-the-chunks-are-read).

## Readers in a scatter-gather

The routes of a `scatter-gather` inside a flow run at the same time, each on its own thread, so two `foreach` routes read the chunks together. They do not move in step: each reads at its own pace, and a route that does little work per chunk can get several chunks ahead of another.

- `maxInMemoryChunks` has to cover that gap, or the faster route fails with the first message above.
- Routes that do similar, substantial work for each chunk stay within a few chunks of each other.
- For routes that do little, allow more room than the default of 3.

### When the routes run one after another

The routes run one after another instead, and the second reader starts only when the first has finished, when:

- the `scatter-gather` has `maxConcurrency="1"`;
- it runs inside a transaction;
- it is not inside a flow, as when it is written directly in an MUnit test.

Then the content must fit within `maxInMemoryChunks`, as for any readers one after another.

## Readers one after another

Readers one after another, such as a `foreach` after a `foreach`, work while the content is no more than `maxInMemoryChunks` chunks: the first reader reads them all before the second starts, so all of them must be held. Beyond that the read fails cleanly; it never holds more.

## When to use in-memory or file-store instead

Use [`in-memory`](./streaming-strategies#in-memory) or [`file-store`](./streaming-strategies#file-store) instead of the sliding window:

- when the chunks are read one after another over content larger than `maxInMemoryChunks`;
- when a reader may start long after the others;
- when the readers' pace can differ widely;
- when the number of readers is not known.

`in-memory` holds every chunk; `file-store` holds a few and writes the rest to disk.
