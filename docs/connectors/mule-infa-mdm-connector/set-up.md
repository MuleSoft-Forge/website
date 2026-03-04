---
title: Set Up
description: Installation and configuration guide for the Informatica MDM - Business 360 Connector
---

# Set Up

| Version | Min runtime version | Compatible Java versions | Description |
| ------- | ------------------- | ------------------------ | ----------- |
| [1.0.0](https://central.sonatype.com/artifact/com.mulesoftforge/mule-infa-b360-connector/1.0.0) | 4.6.0 | Java 17, Java 11, Java 8 | Initial release |

## Requirements

- **Mule Runtime**: 4.6.0 or later
- **Java**: 8, 11, or 17
- **Maven**: 3.9.x or later
- **Informatica Cloud (IICS)**: Active account with MDM Business 360 entitlement

## Installation

### Step 1: Add Maven Dependency

<Hint type="info">

The MuleSoft Forge connectors are constantly updated, and the version is regularly changed. Make sure to replace `{version}` with the latest release from [Maven Central](https://central.sonatype.com/artifact/com.mulesoftforge/mule-infa-b360-connector).

</Hint>

Add the following dependency to your Mule application's `pom.xml`:

```xml
<dependency>
    <groupId>com.mulesoftforge</groupId>
    <artifactId>mule-infa-b360-connector</artifactId>
    <version>{version}</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

### Step 2: Configure the Connector

The connector authenticates via the [Informatica Cloud (IICS) V3 Login API](https://docs.informatica.com/cloud-common-services/administrator/current-version/rest-api-reference/platform-rest-api-version-3-resources/login.html) using username and password credentials.

![Global Element Properties — Informatica MDM Business 360 Configuration](/images/infa-mdm-connector/global-element-properties.png)

```xml
<b360:config name="Informatica_MDM_Business_360_Configuration"
        doc:name="Informatica MDM - Business 360 Configuration"
        doc:id="9cd76a86-6b67-4edb-bf97-81bcaf01fa88">
    <b360:basic-connection
        baseUrl="https://dmp-us.informaticacloud.com/saas/public/core/v3/login"
        username="${iics.username}"
        password="${iics.password}" />
</b360:config>
```

#### Connection Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Login URL** | String | Yes | — | The IICS V3 Login API URL — see [Login URL](#login-url) below |
| **Username** | String | Yes | — | IICS username (max 255 characters) |
| **Password** | String | Yes | — | IICS password (max 255 characters) |

#### Login URL

<Hint type="danger">

**This is the Login URL from the [Informatica Authentication method](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Authentication_method.html) — NOT the B360 API base URL.** The connector calls this URL to authenticate and then automatically derives the B360 API base URL from the login response. See [Base URL Transformation](#base-url-transformation) for details.

</Hint>

The default Login URL format is:

```
https://<Regional Hostname>/saas/public/core/v3/login
```

For example: `https://dmp-us.informaticacloud.com/saas/public/core/v3/login`

The regional hostname depends on the POD (Point of Deployment) your organization uses. Use the following table to find your Login URL:

| POD name | Login URL |
|----------|-----------|
| USW1 | `https://dm-us.informaticacloud.com/saas/public/core/v3/login` |
| USE2 | `https://dm-us.informaticacloud.com/saas/public/core/v3/login` |
| USW3 | `https://dm-us.informaticacloud.com/saas/public/core/v3/login` |
| USE4 | `https://dm-us.informaticacloud.com/saas/public/core/v3/login` |
| USW5 | `https://dm-us.informaticacloud.com/saas/public/core/v3/login` |
| USE6 | `https://dm-us.informaticacloud.com/saas/public/core/v3/login` |
| USW1-1 | `https://dm1-us.informaticacloud.com/saas/public/core/v3/login` |
| USW3-1 | `https://dm1-us.informaticacloud.com/saas/public/core/v3/login` |
| USW1-2 | `https://dm2-us.informaticacloud.com/saas/public/core/v3/login` |
| CAC1 | `https://dm-na.informaticacloud.com/saas/public/core/v3/login` |
| APSE1 | `https://dm-ap.informaticacloud.com/saas/public/core/v3/login` |
| APSE2 | `https://dm1-apse.informaticacloud.com/saas/public/core/v3/login` |
| APNE1 | `https://dm1-ap.informaticacloud.com/saas/public/core/v3/login` |
| APNE2 | `https://dm-apne.informaticacloud.com/saas/public/core/v3/login` |
| APAUC1 | `https://dm1-apau.informaticacloud.com/saas/public/core/v3/login` |
| EMW1 | `https://dm-em.informaticacloud.com/saas/public/core/v3/login` |
| EMC1 | `https://dm1-em.informaticacloud.com/saas/public/core/v3/login` |
| UK1 | `https://dm-uk.informaticacloud.com/saas/public/core/v3/login` |

If you don't know the name of the POD that your organization uses, contact your organization administrator or Informatica Global Customer Support. See the [Product Availability Matrix (PAM)](https://knowledge.informatica.com/s/article/DOC-17579?language=en_US) for the full list.

#### TLS Configuration (Optional)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `protocol` | String | No | HTTPS | Protocol — `HTTP` or `HTTPS` |
| `tlsContext` | TlsContextFactory | No | — | Custom TLS context for certificate management |

#### Advanced Settings

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `connectionTimeout` | Integer | No | 30 | Connection timeout value |
| `connectionTimeoutUnit` | TimeUnit | No | SECONDS | Unit for connection timeout |
| `usePersistentConnections` | boolean | No | true | Reuse HTTP connections |
| `maxConnections` | Integer | No | -1 (unlimited) | Maximum concurrent connections |
| `connectionIdleTimeout` | Integer | No | 30 | Idle connection timeout value |
| `connectionIdleTimeoutUnit` | TimeUnit | No | SECONDS | Unit for idle timeout |
| `streamResponse` | boolean | No | false | Stream HTTP responses |
| `responseBufferSize` | Integer | No | -1 (default) | Response buffer size in bytes |
| `bypassMetadataCache` | boolean | No | false | Skip the datamodel metadata cache |

#### Proxy Configuration (Optional)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `host` | String | Yes (if proxy used) | — | Proxy hostname |
| `port` | Integer | Yes (if proxy used) | — | Proxy port |
| `username` | String | No | — | Proxy authentication username |
| `password` | String | No | — | Proxy authentication password |
| `nonProxyHosts` | String | No | — | Comma-separated list of hosts to bypass the proxy |

### Step 3: Test Connection

::: tabs

== Anypoint Studio

1. Open your Mule project
2. Navigate to **Global Elements** → **Create** → search for `b360`
3. Enter your IICS credentials
4. Click **Test Connection**

== Anypoint Code Builder

1. Add the connector configuration XML to your flow
2. Use the connection test feature in the ACB UI to validate connectivity

:::

## Authentication Flow

The connector handles authentication automatically:

1. **Login**: Calls the IICS V3 Login API (`/saas/public/core/v3/login`) with your username and password
2. **Session**: Extracts the session ID or JWT from the login response
3. **Base URL**: Derives the B360 MDM API host from the `baseApiUrl` in the login response (see [Base URL Transformation](#base-url-transformation) below)
4. **Header**: Sends the session ID or JWT in the **IDS-SESSION-ID** header on all subsequent requests
5. **Refresh**: Monitors JWT expiration and re-authenticates proactively (see [Session ID vs JWT](#session-id-vs-jwt) below)

<Hint type="warning">

This connector does not store the session in Object Store — the session is held in the connection instance and refreshed when the connection is re-established. The connector does not call the logout resource; sessions end when the connection is disposed or when they expire on the server.

</Hint>

### Base URL Transformation

The login response returns a `baseApiUrl` (e.g. `https://use4.dm-us.informaticacloud.com/saas`). For Business 360 REST API calls, the connector automatically:

1. Removes `/saas` from the path
2. Replaces the first host segment with `{segment}-mdm`

| Login `baseApiUrl` | B360 API base URL |
|---------------------|-------------------|
| `https://use4.dm-us.informaticacloud.com/saas` | `https://use4-mdm.dm-us.informaticacloud.com` |
| `https://usw1.dmp-us.informaticacloud.com/saas` | `https://usw1-mdm.dmp-us.informaticacloud.com` |

See [Authentication method — Modifying the baseApiUrl](https://onlinehelp.informatica.com/IICS/prod/b360/en/index.htm#page/wz-b360-rest-api/Authentication_method.html) in the Informatica docs.

### Session ID vs JWT

Login can return either a **session ID** or a **JSON Web Token (JWT)**. Both are sent in the same `IDS-SESSION-ID` header.

| Mode | Expiry | Notes |
|------|--------|-------|
| **Session ID** | 30 minutes of inactivity (up to 2 min grace) | Default for most organizations |
| **JWT** | Configurable by admin (15, 30, 60, 120, 180, or 240 min) | Available since November 2025 |

The connector supports both modes transparently. When your organization uses JWT, the connector **refreshes the token proactively**: if the JWT expires within 5 minutes, validation fails so the connection is re-established and a fresh login is performed. This avoids service interruption.

<Hint type="danger">

**Do not enable JWT** if your organization uses **B2B Gateway**, as that service does not support JWT authentication. See [JWT Support](https://knowledge.informatica.com/s/article/JWT-Support?language=en_US) on the Informatica Knowledge Base.

</Hint>

## Credential Management

Always use Mule property placeholders or secure configuration properties to keep credentials out of your flow XML:

```xml
<secure-properties:config
    name="Secure_Properties"
    file="secure-config.yaml"
    key="${encryption.key}" />

<b360:config name="B360_Config">
    <b360:basic-connection
        baseUrl="${iics.loginUrl}"
        username="${secure::iics.username}"
        password="${secure::iics.password}" />
</b360:config>
```

## Troubleshooting

### Test Connection Fails

**Problem**: Cannot connect to IICS

**Solutions**:
1. Verify the **Login URL** is correct for your IICS region and includes the full path `/saas/public/core/v3/login` (e.g. `https://dmp-us.informaticacloud.com/saas/public/core/v3/login`)
2. Confirm your IICS credentials are valid by logging in to the IICS web console
3. Check network connectivity and proxy settings if behind a corporate firewall

### DataSense Not Loading

**Problem**: Business Entity Internal Id or Source System drop-downs are empty

**Solutions**:
1. Ensure the IICS user has permissions to access the MDM Business 360 datamodel
2. Try setting `bypassMetadataCache="true"` in the advanced settings to force a fresh fetch
3. Verify the B360 tenant has at least one published business entity

### "Failed to retrieve Exchange asset"

**Problem**: Anypoint Studio shows "Failed to retrieve Exchange asset" or "no asset matching given parameters"

**Cause**: Studio is trying to resolve the connector from Anypoint Exchange, but this connector is not published there.

**Solutions**:
1. In the connector project, run `mvn clean install` to install to your local Maven repository
2. In your Mule app's `pom.xml`, ensure the dependency uses the same `groupId`/`artifactId` and the version you built (e.g. `1.0.0`)
3. Studio will resolve it from the local repository
4. If the app was created from Exchange, replace the Exchange dependency with the local artifact coordinates

### Timeout Errors

**Problem**: Operations fail with `B360:TIMEOUT`

**Solutions**:
1. Increase `connectionTimeout` in the advanced settings
2. Check network latency to the IICS/B360 API endpoints
3. Verify the B360 service is healthy and not under maintenance

## Next Steps

- [Operations Reference](./operations/) — All available operations
- [Master Read](./operations/master-read) — Read master records
- [Search](./operations/search) — Search across business entities
- [Source Read](./operations/source-read) — Read source/cross-reference records
- [Source Submit](./operations/source-submit) — Create or update source records
