---
title: Operations
description: Available operations for the MuleSoft Chunking Connector
---

# Operations

The Chunking Connector provides operations for streaming large binary files into manageable chunks.

## Available Operations

| Operation | Description | Output |
|-----------|-------------|--------|
| [read-chunked](./read-chunked) | Streams binary content into chunks | Stream of chunk objects |

## Planned Future Operations

The connector is designed to support additional chunking strategies in future releases:

| Planned Operation | Description | Status |
|-------------------|-------------|--------|
| `reassemble` | Combine chunks back into original binary content | Planned |
| `read-lines` | Stream text files line-by-line | Planned |
| `read-delimited` | Split text by custom delimiter | Planned |

::: tip Contribution Welcome
Interested in contributing? Check out our [GitHub repository](https://github.com/MuleSoft-Forge/mule-chunking-connector) for contribution guidelines.
:::

## Operation Details

### read-chunked

The primary operation for binary streaming. It reads an InputStream and returns a PagingProvider that yields Chunk objects lazily.

**Key Features:**
- Constant memory usage (O(chunkSize))
- Lazy evaluation - chunks created on-demand
- 1-byte probe technique for accurate last chunk detection
- Compatible with Mule's `<foreach>` component

**Learn More:** [read-chunked Operation Reference](./read-chunked)

## Usage Pattern

All operations follow a consistent pattern:

```xml
<!-- 1. Get input stream (from file, HTTP, etc.) -->
<file:read path="/path/to/file"/>

<!-- 2. Apply chunking operation -->
<chunking:read-chunked chunkSize="1048576"/>

<!-- 3. Process chunks with foreach -->
<foreach>
    <!-- Handle each chunk -->
    <logger message="Processing chunk #[payload.index]"/>
</foreach>
```

This pattern ensures:
- Memory-efficient processing
- Consistent error handling
- Progress tracking capabilities
- Interoperability with other Mule connectors
