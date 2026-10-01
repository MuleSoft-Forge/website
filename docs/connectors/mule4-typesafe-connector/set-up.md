---
title: Set Up the TypeSafe Connector
description: Install TypeSafe Connector 1.0.2 from Maven Central and configure a Jev route.
---

# Set Up

## Release 1.0.2

| Version | Minimum Mule Runtime | Java |
| --- | --- | --- |
| **1.0.2** | 4.9.0 | 17 |
| 1.0.1 | 4.9.0 | 17 |

Full operation docs on this site are the source of truth. See the [GitHub 1.0.2 release](https://github.com/MuleSoft-Forge/mule4-typesafe-connector/releases/tag/v1.0.2) for the changelog.

## Install from Maven Central

Add the dependency to the Mule app `pom.xml`:

```xml
<dependency>
    <groupId>com.mulesoftforge</groupId>
    <artifactId>mule4-typesafe-connector</artifactId>
    <version>1.0.2</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

In Anypoint Studio, run **Maven → Update Project** after the dependency resolves.

### Local build (optional)

From the [GitHub repository](https://github.com/MuleSoft-Forge/mule4-typesafe-connector) on the `1.0.2` / `v1.0.2` release:

```bash
mvn clean install
```

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

::: tip Connection test behavior
**Test Connection** validates the API key with one vanilla Noul decision on the configured route. It does **not** use List Models (OpenRouter's catalog is public and returns HTTP 200 without a valid key).

Keyed routes (TypeSafe, OpenRouter, Vercel, Cloudflare, compatible) call `POST /{apiVersion}/systemone` — or the Cloudflare model path — with the connection's model, base URL, API version, and key, and a minimal ping question:

```json
{
  "state": {},
  "questions": {
    "ping": {
      "type": "noul",
      "instructions": "Is the connection accepted?",
      "criteria": { "true": "yes", "false": "no" }
    }
  }
}
```

A rejected or missing key fails with `UNAUTHORIZED (HTTP 401/403): …` and shows the credential-free method and URL (for example `POST https://openrouter.ai/api/v1/systemone`). A successful test logs the same target and spends one small decision. The mock route stays local and does not call a host.
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

Create `src/main/resources/questions/support-ticket-triage.json`:

```json
{
  "id": "support-ticket-triage",
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
  },
  "policy": {
    "routeQuestion": "team",
    "team": {
      "minProbability": 0.7,
      "minMargin": 0.15,
      "onNoMatch": "REVIEW",
      "options": {
        "other": { "action": "REVIEW", "minConfidence": 0.7 }
      }
    },
    "urgent": {
      "yesAbove": 0.7,
      "noBelow": 0.3,
      "onYes": "ACCEPT",
      "onNo": "ACCEPT",
      "onUncertain": "REVIEW"
    }
  }
}
```

The default classpath folder is `questions/`. File-backed question sets populate the **Question set** selector and let DataSense describe named answers such as `payload.answers.team.choice`. The optional `policy` block is what [Apply Policy](./operations/apply-policy) uses after Evaluate — three-band Noul so a clear “no” on urgency does not reject the whole ticket, and `routeQuestion` so `routeKey` stays on `team`. See [How Decisions Work](./how-decisions-work).

Run **[Util] Validate Question Set** before the first billed call to catch malformed questions, risky option sets, and invalid `policy` keys.

## First flow

This flow runs once when the application starts and then once per hour. Evaluate makes a billed provider call.

```xml
<flow name="triage">
    <scheduler>
        <scheduling-strategy>
            <fixed-frequency frequency="1" timeUnit="HOURS" />
        </scheduling-strategy>
    </scheduler>

    <set-payload
        mimeType="application/json"
        value='#[output application/json --- {
            id: "T-1001",
            subject: "Production checkout outage",
            body: "Customers cannot pay and revenue is being lost. Please respond immediately."
        }]' />

    <typesafe:evaluate
        config-ref="TypeSafe_Config"
        questionSet="support-ticket-triage.json"
        step="triage">
        <typesafe:state>#[payload]</typesafe:state>
    </typesafe:evaluate>

    <typesafe:apply-policy
        config-ref="TypeSafe_Config"
        questionSet="support-ticket-triage.json"
        target="policyResult">
        <typesafe:decision>#[payload]</typesafe:decision>
    </typesafe:apply-policy>

    <logger message="#['action=' ++ vars.policyResult.action ++ ' team=' ++ (vars.policyResult.routeKey default '')]" />
</flow>
```

For an inline question set, leave **Question set** empty and provide the **Questions** JSON object instead. Skip Apply Policy until the file includes a `policy` block (as in the sample above).

## Optional governance

The global configuration can enable:

- Decision cache and cache TTL
- Maximum calls or input tokens per rolling budget window
- Estimated price per million input tokens
- Privacy-safe statistics used by the monitoring sources

State text is not stored in budget or drift statistics.

## Troubleshooting

### Connector does not appear in the palette

1. Confirm `com.mulesoftforge:mule4-typesafe-connector:1.0.2` is on the classpath from [Maven Central](https://central.sonatype.com/artifact/com.mulesoftforge/mule4-typesafe-connector/1.0.2).
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
