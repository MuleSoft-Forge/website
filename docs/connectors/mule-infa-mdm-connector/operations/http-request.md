---
title: INFA MDM - Http Request
description: Send an HTTP request to any Informatica B360 / MDM API endpoint using the connector's session
---

# INFA MDM - Http Request

Send an HTTP request to any Informatica B360 / MDM API endpoint, reusing the connector's authenticated session. Use this when no dedicated operation exists or when you need raw control over method, path, headers, and body (e.g. new B360 resources, batch jobs, custom headers).

## Why use Http Request?

- **New APIs:** Call new Informatica resources immediately without waiting for a connector update.
- **Full coverage:** Access admin, metadata, or one-off endpoints that don't have a dedicated operation.
- **Prototyping:** Experiment with any endpoint in Anypoint Studio.

The connector injects **IDS-SESSION-ID** and **Accept: application/json** automatically; you specify method, path, and optionally query parameters, custom headers, and body.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| **HTTP Method** | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Yes | HTTP method. |
| **Path** | String | Yes | Relative path (must start with `/`). Example: `/business-entity/public/api/v1/entity/Person`. |
| **Query Parameters** | Map&lt;String, String&gt; | No | Key-value query params (e.g. `sourceSystem` = `CRM`). |
| **Custom Headers** | Map&lt;String, String&gt; | No | Extra headers. Do not duplicate IDS-SESSION-ID or Accept. |
| **Request Body** | Object / InputStream / String | No | Optional JSON body. Omit for GET/DELETE. |

## Output

- **Payload:** Raw response body as `InputStream`. Parse in DataWeave or pass through. May be `null` (e.g. 204).
- **Attributes** — `HttpRequestResponseAttributes`:

| Attribute | Type | Description |
|-----------|------|-------------|
| `statusCode` | int | HTTP status (200, 400, 404, 500, etc.). |
| `reasonPhrase` | String | Reason phrase (e.g. OK, Not Found). |
| `requestId` | String | Informatica request/tracing ID from headers. |
| `headers` | Map&lt;String, String&gt; | All response headers. |

## Error handling

- **2xx:** Body and attributes returned normally.
- **3xx / 4xx / 5xx:** Body and attributes returned — **no exception**. Check `attributes.statusCode` in DataWeave.
- **Network / timeout:** Throws `B360:CONNECTIVITY` or `B360:TIMEOUT`.

### Transparent 401 reconnect

With **Basic Auth**, if the API returns **401**, the connector re-authenticates and replays the request once with the new session. With **Passthrough**, 401 is returned as-is; the caller must supply a fresh token.

## Mule XML examples

**GET — Read a master record:**

```xml
<b360:http-request config-ref="B360_Config"
    method="GET"
    path="/business-entity/public/api/v1/entity/Person/123456789">
    <b360:query-parameters>
        <b360:query-parameter key="_showContentMeta" value="true" />
    </b360:query-parameters>
</b360:http-request>
```

**POST — Submit source record:**

```xml
<b360:http-request config-ref="B360_Config"
    method="POST"
    path="/business-entity/public/api/v1/entity/Person">
    <b360:query-parameters>
        <b360:query-parameter key="sourceSystem" value="CRM" />
    </b360:query-parameters>
    <b360:request-body><![CDATA[#[payload]]]></b360:request-body>
</b360:http-request>
```

**Batch job:**

```xml
<b360:http-request config-ref="B360_Config"
    method="POST"
    path="/batch-job/public/api/v1/jobs/run">
    <b360:request-body><![CDATA[#[{ "jobId": vars.jobId, "parameters": {} }]]]></b360:request-body>
</b360:http-request>
```

## When to use Http Request vs dedicated operations

| Use case | Prefer |
|----------|--------|
| Search, Master Read, Source Read, Source Submit, MetaData Read | Use the dedicated operation (typed attributes, value providers). |
| Any other endpoint, custom headers, or non-2xx handling | Use **INFA MDM - Http Request**. |

## See Also

- [Operations Overview](./) — All available operations
- [MetaData Read](./metadata-read) — Schema and relationship metadata
- [Set Up Guide](../set-up) — Authentication and configuration
