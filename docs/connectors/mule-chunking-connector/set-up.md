---
title: Set Up
description: Installation and configuration guide for the MuleSoft Chunking Connector
---

# Set Up

| Version | Min runtime version | Compatible Java versions | Description |
| ------- | ------------------- | ------------------------ | ----------- |
| [0.1.0](https://github.com/MuleSoft-Forge/mule-chunking-connector/releases/tag/v0.1.0) | 4.9.0 | Java 17 | Initial release |

## Requirements

- **Mule Runtime**: 4.9.0 or later
- **Java**: 17
- **Maven**: 3.9.8 or later

## Installation

### Step 1: Add Maven Dependency

Add the following dependency to your Mule application's `pom.xml`:

```xml
<dependency>
    <groupId>com.mulesoftforge</groupId>
    <artifactId>mule-chunking-connector</artifactId>
    <version>0.1.0</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

::: tip
The connector will be published to Maven Central soon. Until then, you can build and install it locally from the [GitHub repository](https://github.com/MuleSoft-Forge/mule-chunking-connector).
:::

### Step 2: Configure the Connector

Add the connector configuration to your Mule flow XML:

```xml
<chunking:config name="Chunking_Config">
    <chunking:connection/>
</chunking:config>
```

The configuration is lightweight as the connector is stateless and requires no authentication or connection parameters.

## Chunk Size Guidelines

Choose chunk size based on your use case:

| Use Case | Recommended Chunk Size | Reason |
|----------|----------------------|---------|
| S3 Multipart Upload | 5 MB - 10 MB | S3 minimum part size is 5 MB |
| Network Transfer | 1 MB - 5 MB | Balance between memory and network efficiency |
| Checksum Calculation | 64 KB - 1 MB | Smaller chunks for responsive progress tracking |
| Memory-Constrained Environments | 10 KB - 64 KB | Minimize memory footprint |

::: warning Memory Consideration
Chunk size directly determines memory usage. A 10 MB chunk size means ~10 MB of memory per concurrent flow execution.
:::

## Verification Flow

Test your setup with this simple verification flow:

```xml
<flow name="test-chunking">
    <!-- Create test data -->
    <set-payload value='#["A" * 1000]'/>

    <!-- Chunk into 100-byte pieces -->
    <chunking:read-chunked config-ref="Chunking_Config" chunkSize="100"/>

    <!-- Count chunks -->
    <set-variable variableName="chunkCount" value="#[0]"/>
    <foreach>
        <set-variable variableName="chunkCount" value="#[vars.chunkCount + 1]"/>
        <logger level="INFO" message="Chunk #[payload.index]: #[payload.length] bytes"/>
    </foreach>

    <logger level="INFO" message="Total chunks: #[vars.chunkCount]"/>
</flow>
```

Expected output: 10 chunks of 100 bytes each.

## Troubleshooting

### Connector Not Found

**Problem**: Studio cannot find the connector in the palette

**Solution**:
1. Verify the dependency is in `pom.xml` with the correct `<classifier>mule-plugin</classifier>`
2. Right-click project → Mule → Update Project
3. Clean and rebuild the project

### Out of Memory Errors

**Problem**: `OutOfMemoryError` when processing large files

**Solutions**:
1. **Reduce chunk size**: Lower the `chunkSize` parameter
2. **Don't collect chunks**: Never use `vars.chunks + [payload]` to collect all chunks into a variable
3. **Process and discard**: Handle each chunk in `<foreach>` and let it be garbage collected

::: danger Anti-Pattern
```xml
<!-- WRONG: Don't do this! -->
<foreach>
    <set-variable variableName="allChunks" value="#[vars.allChunks + [payload]]"/>
</foreach>
```

This defeats the entire purpose of streaming and will load the entire file into memory.
:::

### Empty Chunks

**Problem**: Chunks have zero length or null data

**Possible Causes**:
1. Input stream is empty or null
2. Stream was already consumed by another component
3. File doesn't exist at the specified path

**Solution**: Verify the input source provides a valid, unconsumed `InputStream`.

## Next Steps

- [Operations Reference](./operations/) - Learn about available operations
- [Read Chunked Operation](./operations/read-chunked) - Detailed operation documentation
- [GitHub Examples](https://github.com/MuleSoft-Forge/mule-chunking-connector/tree/main/examples) - Sample applications
