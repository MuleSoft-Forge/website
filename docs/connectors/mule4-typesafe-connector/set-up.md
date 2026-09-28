---
title: Set Up the TypeSafe Connector
description: Install the TypeSafe Connector for Mule 4 with the Maven Central coordinates and configure a Jev route.
---

# Set Up

## Release coordinates

| Version | Distribution | Minimum Mule Runtime | Java |
| --- | --- | --- | --- |
| [1.0.0](https://central.sonatype.com/artifact/com.mulesoftforge/mule4-typesafe-connector/1.0.0) | Publishing to Maven Central | 4.9.0 | 17 |

## Install the connector

Maven Central is still publishing `1.0.0`. The dependency that will resolve is:

```xml
<dependency>
    <groupId>com.mulesoftforge</groupId>
    <artifactId>mule4-typesafe-connector</artifactId>
    <version>1.0.0</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

Those coordinates match the connector build: [`com.mulesoftforge:mule4-typesafe-connector:1.0.0`](https://central.sonatype.com/artifact/com.mulesoftforge/mule4-typesafe-connector/1.0.0) with the `mule-plugin` classifier.

While that publish finishes, install the same coordinates from the [GitHub repository](https://github.com/MuleSoft-Forge/mule4-typesafe-connector):

```bash
mvn clean install
```

In Anypoint Studio, run **Maven → Update Project** after the dependency is available.

## Configure a route

The connector supports six connection providers. Start with TypeSafe direct unless your deployment already routes AI traffic through another gateway.

### TypeSafe direct

```xml
<typesafe:config name="TypeSafe_Config">
    <typesafe:typesafe-connection
        apiKey="${typesafe.apiKey}"
        model="jev-latest" />
</typesafe:config>
```

Defaults:

- Base URL: `https://api.typesafe.ai`
- API version: `v1` (configuration; the path is `/{apiVersion}/…`)
- Model: `jev-latest` — see [TypeSafe models](https://docs.typesafe.ai/models)

### OpenRouter

```xml
<typesafe:config name="TypeSafe_Config">
    <typesafe:openrouter-connection
        apiKey="${openrouter.apiKey}"
        model="~typesafe/jev-latest"
        httpReferer="${app.url}"
        appTitle="${app.name}" />
</typesafe:config>
```

### Vercel AI Gateway

```xml
<typesafe:config name="TypeSafe_Config">
    <typesafe:vercel-connection
        apiKey="${vercel.aiGatewayKey}"
        model="typesafe-ai/jev" />
</typesafe:config>
```

### Other providers

- **Cloudflare Workers AI** requires an account ID, API token, and model.
- **Compatible Gateway** requires a base URL and can optionally declare model-list support.
- **Mock (testing)** requires no key and returns deterministic, type-correct answers without network traffic.

Every hosted route supports response timeout, idle timeout, connection-pool, custom-header, and ordered fallback settings. Fallback routes are used only for connectivity, timeout, rate-limit, and overload failures.

::: warning Connection test behavior
The current connection validation does not make a remote request. A successful **Test Connection** confirms that Mule created the connection object, not that the API key is accepted. Use [Connection List Models](./operations/connection-list-models) or a small Evaluate flow for an end-to-end check.
:::

## Protect credentials

Never hard-code keys in Mule XML. Use property placeholders or Secure Configuration Properties:

```properties
typesafe.apiKey=replace-at-deploy-time
```

```xml
<typesafe:typesafe-connection apiKey="${typesafe.apiKey}" model="jev-latest" />
```

Do not log state, raw provider responses, or keys. `includeRawResponse` is disabled by default.

## Add a reusable question set

Create `src/main/resources/questions/ticket-triage.json`:

```json
{
  "id": "ticket-triage",
  "version": "1.0.0",
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "Which team should own this ticket?",
      "criteria": {
        "billing": "Payments, invoices, refunds, or subscriptions.",
        "technical": "Product, integration, or API problems.",
        "other": "None of the listed categories apply."
      },
      "noMatchOption": "other"
    },
    "urgent": {
      "type": "noul",
      "instructions": "Does this ticket need a fast response?",
      "criteria": {
        "true": "An outage, deadline, lost revenue, or escalating customer.",
        "false": "A routine request with no time pressure."
      }
    }
  }
}
```

The default classpath folder is `questions/`. File-backed question sets populate the **Question set** selector and let DataSense describe named answers such as `payload.answers.team.choice`.

Run **[Util] Validate Question Set** before the first billed call to catch malformed questions and risky option sets.

## First flow

```xml
<flow name="triage">
    <http:listener config-ref="HTTP_Listener_config" path="/triage" />

    <typesafe:evaluate
        config-ref="TypeSafe_Config"
        questionSet="ticket-triage.json"
        step="triage">
        <typesafe:state>#[payload]</typesafe:state>
    </typesafe:evaluate>

    <logger message="#[payload.answers.team.choice]" />
</flow>
```

For an inline question set, leave **Question set** empty and provide the **Questions** JSON object instead.

## Optional governance

The global configuration can enable:

- Decision cache and cache TTL
- Maximum calls or input tokens per rolling budget window
- Estimated price per million input tokens
- Privacy-safe statistics used by the monitoring sources

State text is not stored in budget or drift statistics.

## Troubleshooting

### Connector does not appear in the palette

1. Confirm `com.mulesoftforge:mule4-typesafe-connector:1.0.0` is on the classpath. While [Maven Central](https://central.sonatype.com/artifact/com.mulesoftforge/mule4-typesafe-connector/1.0.0) is still publishing, that copy comes from a local `mvn clean install`.
2. Confirm the dependency includes `<classifier>mule-plugin</classifier>`.
3. Run **Maven → Update Project**, then clean the Mule application.

### Question set is missing from the selector

1. Place the JSON file directly under `src/main/resources/questions/`.
2. Confirm the file ends in `.json`.
3. Rebuild the application so Studio refreshes its design-time classpath.
4. Use the bare file name or the `.json` name; both are accepted at runtime.

### Request is unauthorized

Check the selected connection provider and key. Authorization errors are not retried and do not trigger provider failover.

### Model listing is unsupported

Cloudflare and compatible gateways with model-list support disabled cannot enumerate models. Configure a TypeSafe, OpenRouter, Vercel, or supporting compatible route.

## Next steps

- [Operations Reference](./operations/)
- [Sources](./sources)
- [Jev introduction](https://docs.typesafe.ai/introduction)
- [TypeSafe API](https://docs.typesafe.ai/api)
- [Demo application](https://github.com/MuleSoft-Forge/mule4-typesafe-connector/tree/main/demo/typesafe-dev)
