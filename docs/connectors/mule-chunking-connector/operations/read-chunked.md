---
title: read-chunked
description: Stream binary content into chunks for foreach iteration
---

# read-chunked

The `read-chunked` operation streams an InputStream into manageable chunks, enabling memory-efficient processing of large binary files.

## XML Signature

```xml
<chunking:read-chunked
    config-ref="Chunking_Config"
    chunkSize="1048576"
    content="#[payload]"/>
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `config-ref` | String | Yes | - | Reference to chunking configuration |
| `chunkSize` | Integer | No | 65536 | Size of each chunk in bytes (64 KB default) |
| `content` | InputStream | No | payload | Binary content to chunk (defaults to message payload) |

### chunkSize Guidelines

Choose chunk size based on your use case:

| Use Case | Recommended Size | Reason |
|----------|------------------|---------|
| S3 Multipart Upload | 5 MB - 10 MB | Meets S3 minimum part size (5 MB) |
| Network Transfer | 1 MB - 5 MB | Balances memory and throughput |
| Checksum Calculation | 64 KB - 1 MB | Responsive progress tracking |
| Memory-Constrained | 10 KB - 64 KB | Minimizes memory footprint |

::: warning
Chunk size directly determines memory usage. A 10 MB chunk size means ~10 MB RAM per concurrent flow execution.
:::

## Output

Returns a stream of chunk objects. The stream can be used with `<foreach>`, filtered with DataWeave, or transformed and passed to other components.

### Chunk Properties

Each chunk object in the `<foreach>` loop provides:

| Property | Type | Description |
|----------|------|-------------|
| `payload.data` | `byte[]` | Raw binary chunk data |
| `payload.index` | `int` | 0-based chunk number |
| `payload.offset` | `long` | Starting byte position in source stream |
| `payload.length` | `int` | Number of bytes in this chunk |
| `payload.isFirst` | `boolean` | `true` for the first chunk |
| `payload.isLast` | `boolean` | `true` for the final chunk |

## Examples

### Basic Usage

Stream a file into 1 MB chunks and log each one:

```xml
<flow name="basic-chunking">
    <!-- Read file as InputStream -->
    <file:read path="/data/large-file.bin"/>

    <!-- Chunk into 1 MB pieces -->
    <chunking:read-chunked
        config-ref="Chunking_Config"
        chunkSize="1048576"/>

    <!-- Process each chunk -->
    <foreach>
        <logger level="INFO"
                message="Processing chunk #[payload.index]: #[payload.length] bytes at offset #[payload.offset]"/>
    </foreach>
</flow>
```

### S3 Multipart Upload Pattern

Upload a large file to S3 using multipart upload (5 MB chunks):

```xml
<flow name="s3-multipart-upload">
    <file:read path="/data/video.mp4"/>

    <!-- Initialize multipart upload -->
    <s3:create-multipart-upload
        bucket="my-bucket"
        key="uploads/video.mp4"/>
    <set-variable
        variableName="uploadId"
        value="#[payload.uploadId]"/>

    <!-- Chunk file into 5 MB parts (S3 minimum) -->
    <chunking:read-chunked
        config-ref="Chunking_Config"
        chunkSize="5242880"/>

    <!-- Upload each part -->
    <foreach>
        <s3:upload-part
            bucket="my-bucket"
            key="uploads/video.mp4"
            uploadId="#[vars.uploadId]"
            partNumber="#[payload.index + 1]"
            content="#[payload.data]"/>

        <logger message="Uploaded part #[payload.index + 1]"/>
    </foreach>

    <!-- Complete multipart upload -->
    <s3:complete-multipart-upload
        bucket="my-bucket"
        key="uploads/video.mp4"
        uploadId="#[vars.uploadId]"/>
</flow>
```

### Progress Tracking

Track chunking progress with percentage calculation:

```xml
<flow name="progress-tracking">
    <file:read path="/data/archive.zip"/>

    <!-- Get total file size -->
    <file:read
        path="/data/archive.zip"
        lock="true"
        outputMimeType="application/java"
        target="totalSize"
        targetValue="#[sizeOf(payload)]"/>

    <chunking:read-chunked
        config-ref="Chunking_Config"
        chunkSize="1048576"/>

    <set-variable
        variableName="bytesProcessed"
        value="#[0]"/>

    <foreach>
        <!-- Update progress -->
        <set-variable
            variableName="bytesProcessed"
            value="#[vars.bytesProcessed + payload.length]"/>

        <set-variable
            variableName="percentComplete"
            value="#[(vars.bytesProcessed / vars.totalSize) * 100]"/>

        <logger level="INFO"
                message="Progress: #[vars.percentComplete as String {format: '0.00'}]% - Chunk #[payload.index]"/>

        <!-- Process chunk data -->
        <flow-ref name="process-chunk"/>
    </foreach>
</flow>
```

### Checksum Calculation

Calculate SHA-256 hash of a large file in chunks:

```xml
<flow name="calculate-checksum">
    <file:read path="/data/firmware.bin"/>

    <!-- Create MessageDigest instance -->
    <set-variable
        variableName="digest"
        value="#[java!java::security::MessageDigest::getInstance('SHA-256')]"/>

    <chunking:read-chunked
        config-ref="Chunking_Config"
        chunkSize="524288"/>

    <foreach>
        <!-- Update digest with chunk data -->
        <java:invoke-static
            class="java.security.MessageDigest"
            method="update(byte[])"
            args="#[payload.data]"
            target="digest"/>

        <logger message="Hashed chunk #[payload.index]"/>
    </foreach>

    <!-- Get final hash -->
    <set-payload
        value="#[vars.digest.digest() as String {format: 'hex'}]"/>
</flow>
```

## Error Types

The connector throws these error types:

| Error Type | Description | Cause |
|------------|-------------|-------|
| `CHUNKING:INVALID_CHUNK_SIZE` | Invalid chunk size parameter | chunkSize ≤ 0 |
| `CHUNKING:READ_ERROR` | Error reading from input stream | I/O failure, corrupt stream |
| `CHUNKING:CONNECTIVITY` | Connection/resource access failure | File not found, permission denied |

### Error Handling Example

```xml
<flow name="chunking-with-error-handling">
    <try>
        <file:read path="/data/file.dat"/>

        <chunking:read-chunked
            config-ref="Chunking_Config"
            chunkSize="1048576"/>

        <foreach>
            <flow-ref name="process-chunk"/>
        </foreach>

        <error-handler>
            <on-error-continue type="CHUNKING:INVALID_CHUNK_SIZE">
                <logger level="ERROR"
                        message="Invalid chunk size configuration"/>
            </on-error-continue>

            <on-error-continue type="CHUNKING:READ_ERROR">
                <logger level="ERROR"
                        message="Failed to read chunk: #[error.description]"/>
            </on-error-continue>

            <on-error-continue type="CHUNKING:CONNECTIVITY">
                <logger level="ERROR"
                        message="Cannot access file: #[error.description]"/>
            </on-error-continue>
        </error-handler>
    </try>
</flow>
```

## Memory Behavior

### Constant Memory Guarantee

The connector maintains **O(chunkSize)** memory usage using a PushbackInputStream with a 1-byte probe technique:

1. **Read**: Allocates a buffer of exactly `chunkSize` bytes
2. **Probe**: Reads 1 additional byte to detect EOF
3. **Pushback**: If byte exists, pushes it back for the next chunk
4. **Discard**: After `<foreach>` processes the chunk, the buffer is garbage collected

This ensures memory usage remains constant regardless of file size.

### Memory Examples

| File Size | Chunk Size | Memory Used | Chunks Created |
|-----------|------------|-------------|----------------|
| 10 MB | 1 MB | ~1 MB | 10 |
| 1 GB | 5 MB | ~5 MB | 200 |
| 10 GB | 5 MB | ~5 MB | 2,000 |
| 665 MB | 10 KB | ~10 KB | 66,500 |

The connector was validated processing a 665 MB file with 66,500 chunks using only 10 KB of memory.

### Lazy Evaluation

Chunks are created **on-demand** during `<foreach>` iteration:

```xml
<chunking:read-chunked chunkSize="1048576"/> <!-- No memory allocated yet -->

<foreach> <!-- Chunks created one at a time as loop iterates -->
    <logger message="Chunk #[payload.index]"/>
</foreach>
```

**What happens:**
1. Loop requests first chunk → Connector reads 1 MB
2. Loop processes chunk → Chunk becomes eligible for GC
3. Loop requests second chunk → Connector reads next 1 MB
4. Previous chunk is garbage collected
5. Process repeats for all chunks

## Anti-Patterns

::: danger Don't Collect All Chunks
**WRONG** - This defeats the purpose of streaming:

```xml
<foreach>
    <!-- ❌ Never do this! Loads entire file into memory -->
    <set-variable
        variableName="allChunks"
        value="#[vars.allChunks + [payload]]"/>
</foreach>
```

This will cause `OutOfMemoryError` for large files.
:::

::: tip Correct Pattern
**RIGHT** - Process and discard each chunk:

```xml
<foreach>
    <!-- ✅ Process chunk and let it be garbage collected -->
    <flow-ref name="process-chunk"/>
</foreach>
```

Each chunk is processed then discarded, maintaining constant memory.
:::

## Performance Considerations

### Chunk Size vs. Throughput

| Chunk Size | Memory | I/O Calls | Best For |
|------------|--------|-----------|----------|
| 10 KB | Low | High | Memory-constrained environments |
| 1 MB | Medium | Medium | Balanced performance |
| 10 MB | High | Low | High-throughput network transfers |

**Rule of Thumb:** Larger chunks = fewer I/O operations but higher memory usage.

### Concurrent Flows

Memory usage scales with concurrent executions:

| Chunk Size | 1 Flow | 10 Flows | 100 Flows |
|------------|--------|----------|-----------|
| 1 MB | 1 MB | 10 MB | 100 MB |
| 5 MB | 5 MB | 50 MB | 500 MB |
| 10 MB | 10 MB | 100 MB | 1 GB |

Configure chunk size based on expected concurrency and available heap memory.

## See Also

- [Operations Overview](./index.md) - All available operations
- [Set Up Guide](../set-up.md) - Installation and configuration
- [GitHub Examples](https://github.com/MuleSoft-Forge/mule-chunking-connector/tree/main/examples) - Sample applications
