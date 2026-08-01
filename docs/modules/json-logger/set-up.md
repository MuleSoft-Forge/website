---
title: Set Up
description: Installation and configuration guide for the MuleSoft JSON Logger
---

# Set Up

| Version | Min runtime version | Compatible Java versions | Description |
| ------- | ------------------- | ------------------------ | ----------- |
| [3.1.0](https://central.sonatype.com/artifact/cloud.anypoint/json-logger/3.1.0) | 4.3.0 | Java 17, Java 11 | Stable release with JSON Serializer for JDK 8 datatypes |
| [3.0.2](https://central.sonatype.com/artifact/cloud.anypoint/json-logger/3.0.2) | 4.3.0 | Java 17, Java 11 | Security and dependency fixes |
| [2.2.3](https://central.sonatype.com/artifact/cloud.anypoint/json-logger/2.2.3) | 4.3.0 | Java 17, Java 11 | Compatibility and stability updates |

[![Maven Central](https://img.shields.io/maven-metadata/v.svg?label=maven-central&metadataUrl=https://repo1.maven.org/maven2/cloud/anypoint/json-logger/maven-metadata.xml)](https://central.sonatype.com/artifact/cloud.anypoint/json-logger)

<Stepper>
  <Step title="Add Dependency to `pom.xml`">

<Hint type="info">

Use the latest JSON Logger version from Maven Central. Replace the version placeholder with the newest value available.

</Hint>

Copy and paste the following Maven dependency snippet into your Mule application `pom.xml` under `<dependencies>`:

```xml title="pom.xml"
<dependency>
    <groupId>cloud.anypoint</groupId>
    <artifactId>json-logger</artifactId>
    <version>{version}</version>
    <classifier>mule-plugin</classifier>
</dependency>
```
  </Step>

  <Step title="Configure JSON Logger Global Element">

Add a global JSON Logger configuration to your `global.xml` or flow file:

```xml title="global.xml"
<json-logger:config name="json-logger-config"
    environment="dev" applicationName="test-app" applicationVersion="1.0.0"
    disabledFields="content" contentFieldsDataMasking="password">
    
    <!-- Optional: Configure external destination -->
    <json-logger:external-destination>
        <json-logger:amq-destination queueOrExchangeDestination="logs-queue"
            clientId="{clientId}" clientSecret="{clientSecret}" />
    </json-logger:external-destination>
</json-logger:config>
```

**Configuration Options:**
 - **Identifiers**: Application name, version and environment
 - **Masking Rules**: Define fields to mask sensitive data in logs
 - **External Destinations**: Route logs to Anypoint MQ, JMS queues, or AMQP destinations
 - **JSON Output**: Customize JSON structure (simple changes)

  </Step>

  <Step title="Add JSON Logger Operation in Mule Flow">

1. Add a **JSON Logger** operation to your flow using Anypoint Studio, Anypoint Code Builder, or XML configuration.
2. Configure the required `message` parameter and optional parameters as needed.

  </Step>
</Stepper>
