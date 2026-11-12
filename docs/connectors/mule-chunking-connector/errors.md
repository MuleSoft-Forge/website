---
title: Errors
description: The errors the Mule Chunking Connector's read-chunked operation raises, the failures that can happen while the chunks are read, and how a flow handles each.
---

# Errors

A flow can meet two kinds of failure from the Chunking Connector.

[Errors the operation raises](#errors-the-operation-raises) happen when `read-chunked` runs, before any chunk is read. They carry the connector's `CHUNKING` error types, and a flow handles them by type.

[Failures while the chunks are read](#failures-while-the-chunks-are-read) happen after `read-chunked` has returned, while `foreach` or an expression reads the chunks. Mule reports them with its own error types, and a flow handles them with `ANY`.

## Errors the operation raises

These are raised by `read-chunked` itself, before any chunk is read, so a flow can handle them by type:

| Error | When |
|-------|------|
| `CHUNKING:INVALID_PARAMETER` | A value is not valid. Parent of the three errors below, so handling it catches all of them. Raised itself for an `encoding` the runtime does not recognise and for a streaming strategy setting that is not positive (`maxInMemoryChunks`, `readers`). |
| `CHUNKING:INVALID_CHUNK_SIZE` | `chunkSize` or `maxChunkSize` is not a positive number of bytes |
| `CHUNKING:INVALID_RECORDS_PER_CHUNK` | `recordsPerChunk` is not positive |
| `CHUNKING:INVALID_DELIMITER` | The delimiter is empty. An empty delimiter written as text is rejected when the application loads, so in practice this comes from an expression that gives empty text. |
| `CHUNKING:READ_ERROR` | There is no content to read: the content is `null` |

Each message says what was wrong and ends with the value received, for example `recordsPerChunk must be a positive number of records (got: 0)`.

### Handling CHUNKING errors

A handler for `CHUNKING:INVALID_PARAMETER` catches it and its three children:

```xml
<try>
    <chunking:read-chunked>
        <chunking:chunking-strategy>
            <chunking:by-delimiter recordsPerChunk="0"/>
        </chunking:chunking-strategy>
    </chunking:read-chunked>
    <error-handler>
        <on-error-continue type="CHUNKING:INVALID_PARAMETER">
            <logger level="ERROR" message="#[error.errorType.identifier ++ ': ' ++ error.description]"/>
        </on-error-continue>
    </error-handler>
</try>
```

Or handle one type alone. This is the sample application's `error-invalid-chunk-size` flow, without its HTTP listener and summary:

```xml
<try doc:name="Try">
    <chunking:read-chunked doc:name="chunkSize 0">
        <chunking:chunking-strategy>
            <chunking:by-size chunkSize="0"/>
        </chunking:chunking-strategy>
    </chunking:read-chunked>
    <set-variable variableName="caught" value="nothing" doc:name="No error"/>
    <error-handler>
        <on-error-continue type="CHUNKING:INVALID_CHUNK_SIZE" doc:name="On CHUNKING:INVALID_CHUNK_SIZE">
            <set-variable variableName="caught" value="#[error.errorType.namespace ++ ':' ++ error.errorType.identifier]" doc:name="Error type"/>
            <set-variable variableName="description" value="#[error.description]" doc:name="Description"/>
        </on-error-continue>
    </error-handler>
</try>
```

The sample application has a flow for each of these errors; see [Set Up](./set-up#sample-application).

## Failures while the chunks are read

The content is read while the flow reads the chunks, after `read-chunked` has returned. A failure then is raised to the flow at once, after the chunks before it, and the content is never reported as having ended early. Mule reports these failures with its own error types:

- inside `foreach`, `MULE:UNKNOWN`;
- inside a DataWeave expression that reads the chunks, `MULE:EXPRESSION`.

::: warning Handle failures while reading with ANY
An error handler cannot name `MULE:UNKNOWN`: an application that does fails to build. Handle these failures with `ANY`, as in the example below, and use `error.description` to tell them apart.
:::

The error's `description` ends with the connector's message, which says what happened. The failures are:

- the content cannot be read, for example the source stream fails part-way;
- a record is larger than `maxChunkSize` (by delimiter; see [A record larger than the maximum](./chunking-strategies#a-record-larger-than-the-maximum));
- one of the three `sliding-window` failures under [Failures and what to change](./sliding-window-readers#failures-and-what-to-change);
- `in-memory` reaches its limit;
- `file-store` cannot write or read its temporary file;
- the chunks are read after they were released (see [When the chunks are released](./streaming-strategies#when-the-chunks-are-released)).

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

The sample application's `error-failure-while-reading` flow shows this with a record larger than `maxChunkSize`.

## Logging

Failures a flow must handle are raised as errors and are not logged. What the connector logs is described under [Logging](./set-up#logging).
