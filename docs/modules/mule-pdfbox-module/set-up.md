---
title: Set Up
description: Installation and configuration guide for the MuleSoft PDFBox Module
---

# Set Up

| Version | Min runtime version | Compatible Java versions | Description |
| ------- | ------------------- | ------------------------ | ----------- |
| [1.0.2](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-pdfbox-module/1.0.2) | 4.6.0 | Java 17, Java 11, Java 8 | Add Image to PDF |
| [1.0.1](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-pdfbox-module/1.0.1) | 4.6.0 | Java 17, Java 11, Java 8 | Add Merge PDFs |
| [1.0.0](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-pdfbox-module/1.0.0) | 4.6.0 | Java 17, Java 11, Java 8 | Launch |

[![Maven Central](https://img.shields.io/maven-metadata/v.svg?label=maven-central&metadataUrl=https://repo1.maven.org/maven2/io/github/mulesoft-forge/mule-pdfbox-module/maven-metadata.xml)](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-pdfbox-module)

<details>

<summary>Step1: Maven Central Repository</summary>

#### Edit Project File `pom.xml`

<Hint type="info">

The MuleSoft Forge connectors are constantly updated, and the version is regularly changed. Make sure to replace `{version}` with the latest release from [Maven Central](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-pdfbox-module).

</Hint>

Copy and paste the following Maven Dependency Snippet into your Mule application pom file.

```xml title="pom.xml"
<dependencies>

    <dependency>
        <groupId>io.github.mulesoft-forge</groupId>
        <artifactId>mule-pdfbox-module</artifactId>
        <version>1.0.2</version>
        <classifier>mule-plugin</classifier>
    </dependency>

</dependencies>
```

See Anypoint Code Builder Example: Note xml `<dependencies>` tags if not present.

![Code Builder POM Example](/images/pdfbox-module/screenshot-2025-05-06-22-58-02.png)

</details>
