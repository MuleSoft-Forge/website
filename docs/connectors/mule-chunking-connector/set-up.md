---
title: Set Up
description: Installation, requirements, the sample application and logging for the Mule Chunking Connector.
---

# Set Up

| Version | Min runtime version | Compatible Java versions | Description |
| ------- | ------------------- | ------------------------ | ----------- |
| [1.0.0](https://central.sonatype.com/artifact/com.mulesoftforge/mule-chunking-connector/1.0.0) | 4.9.6 | Java 17 | Latest release: chunking by delimiter, streaming strategies with limits in chunks, and typed errors |

Earlier versions remain on [Maven Central](https://central.sonatype.com/artifact/com.mulesoftforge/mule-chunking-connector). 1.0.0-beta1 was a preview of 1.0.0; the one change since it is the connector's icon. To move an application from 0.2.0, see [Upgrade from 0.2.0](./upgrading).

## Requirements

- **Mule Runtime**: 4.9.6 or later
- **Java**: 17

## Installation

### Step 1: Add the Maven dependency

Add the following dependency to your Mule application's `pom.xml`:

```xml
<dependency>
    <groupId>com.mulesoftforge</groupId>
    <artifactId>mule-chunking-connector</artifactId>
    <version>@forge:version:chunking@</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

::: tip
The snippet above always shows the latest release on [Maven Central](https://central.sonatype.com/artifact/com.mulesoftforge/mule-chunking-connector), currently `@forge:version:chunking@`. To build from source instead, see the [GitHub repository](https://github.com/MuleSoft-Forge/mule-chunking-connector).
:::

### Step 2: Use the operation

The connector needs no global configuration element and no `config-ref`. Add `read-chunked` to a flow; with no settings it cuts the message payload into chunks of 1 MB, and `foreach` processes them one at a time:

```xml
<chunking:read-chunked/>
<foreach>
    <logger level="INFO" message="#['Chunk $(payload.index): $(payload.length) bytes, last: $(payload.last)']"/>
</foreach>
```

To choose how the content is cut and how the chunks are held, see [read-chunked](./operations/read-chunked).

## Sample application

The connector repository includes a [sample application](https://github.com/MuleSoft-Forge/mule-chunking-connector/tree/v1.0.0/examples/chunking-sample-app) with one flow for each feature. It needs no external system, credential or network service: its input data is bundled with it, and each flow is started by an HTTP request to `localhost`.

- **Anypoint Studio**: **File > Import > Anypoint Studio > Anypoint Studio project from File System**, and choose the `examples/chunking-sample-app` directory.
- **Anypoint Code Builder**: open the `examples/chunking-sample-app` directory as a folder; it is recognised as a Mule project.

Run the application, then open `http://localhost:8081/<flow name>` in a browser. Each flow answers with a JSON summary of what it saw, and logs each chunk at INFO. Each flow also has an MUnit test.

| Flow | What it shows |
|------|---------------|
| `bare-operation` | The operation with no settings: 1 MB chunks, non-repeatable |
| `by-size` | Chunks of 256 bytes |
| `by-delimiter-default-newline` | Ten lines per chunk, the newline delimiter being the default |
| `by-delimiter-expression` | A delimiter that cannot be typed (the record separator, 0x1E), given as an expression |
| `short-chunk-max-chunk-size` | A chunk ended early by `maxChunkSize`, seen through `recordCount`, with no error |
| `streaming-non-repeatable` | Read once: a second pass sees no chunks |
| `streaming-sliding-window` | Both routes of a scatter-gather read every chunk, with `readers="2"`; each chunk is let go once both have read it |
| `streaming-in-memory` | Fully repeatable: two passes, at most 20 chunks in memory |
| `streaming-file-store` | 2 chunks in memory and the rest on disk, read by both routes of a scatter-gather |
| `error-invalid-chunk-size` | `CHUNKING:INVALID_CHUNK_SIZE` caught by type |
| `error-invalid-records-per-chunk` | `CHUNKING:INVALID_RECORDS_PER_CHUNK` caught by type |
| `error-invalid-delimiter` | `CHUNKING:INVALID_DELIMITER` caught by type |
| `error-invalid-parameter` | `CHUNKING:INVALID_PARAMETER` for an unknown encoding |
| `error-parent-type` | A handler for `CHUNKING:INVALID_PARAMETER` catching `CHUNKING:INVALID_CHUNK_SIZE` |
| `error-no-content` | `CHUNKING:READ_ERROR` when there is no content |
| `error-failure-while-reading` | A record larger than `maxChunkSize`, failing while `foreach` reads, handled with `ANY` |

## Logging

The connector logs nothing at INFO: what is worth an INFO line is for your application's flow to decide.

- **DEBUG**: one line for each invocation of `read-chunked`, with its chunking and streaming strategies and their settings; a line for each chunk read; when `file-store` starts writing to its temporary file, and when it deletes it; and what `sliding-window` held when it lets go of the chunks.
- **WARN**: the content could not be closed after reading, or `file-store` could not delete its temporary file.
- Failures a flow must handle are raised as errors, not logged. See [Errors](./errors).

To see the DEBUG lines, set the logger `com.mulesoftforge.mule.extension.chunking` to DEBUG in your application's `log4j2.xml`.

## Next steps

- [read-chunked](./operations/read-chunked): the operation and every setting
- [Chunking Strategies](./chunking-strategies): by size and by delimiter
- [Streaming Strategies](./streaming-strategies): how the chunks are held
- [Errors](./errors): handling the operation's errors and failures while reading
