---
title: IDP Runtime Service REST API
description: OpenAPI specification for the IDP Runtime Service REST connector
---

# MuleSoft IDP Universal 🌐 REST Smart Connector 🔌

This page documents the REST API connector for MuleSoft IDP Runtime Service, based on the [REST Connect Connector Generator](https://docs.mulesoft.com/exchange/to-deploy-using-rest-connect).

## Overview

The IDP Runtime Service provides a REST API for interacting with intelligent document processing capabilities. This connector wraps **two REST APIs** and adds value-add functionality:

- **MuleSoft IDP Runtime Services** - Document execution and review operations
- **Anypoint Platform IDP Services** - Action management and introspection

### Key Benefits

* **Reduced Connector Sprawl**: Consolidates multiple IDP actions into a single connector interface
* **Simplified Configuration**: Minimizes reconfiguration needs when action versions change
* **Enhanced Flexibility**: Designed to support potentially undocumented functionalities
* **Scalability**: Enables rapid onboarding of new document actions for enterprise scale

## API Specification

**Full OpenAPI 3.0.4 Specification**: [Download YAML](/assets/idp-connector/idp-runtime-service-api.yaml)

**Additional Resources**: [REST Connect Documentation (PDF)](/assets/idp-connector/community-restconnect.pdf)

### Architecture

The connector consolidates two distinct API services:

#### IDP Runtime Services
**Base URL**: `https://{region}.anypoint.mulesoft.com/api/v1/organizations/{YOUR_ORG_ID}`

**Regions**:
- `idp-rt.us-east-1` (US East)
- `idp-rt.eu-central-1` (EU Central)

**Key Endpoints**:
- `POST /actions/{actionId}/versions/{version}/executions` - Submit document for processing
- `GET /actions/{actionId}/versions/{version}/executions/{executionId}` - Retrieve execution results
- `GET /reviews` - List pending review tasks
- `DELETE /actions/{actionId}/reviews/{executionId}` - Delete review task
- `PATCH /actions/{actionId}/reviews/{executionId}` - Update review task

#### Anypoint Platform IDP Services
**Base URL**: `https://{controlPlane}/idp/api/v1/organizations/{YOUR_ORG_ID}`

**Control Planes**:
- `anypoint.mulesoft.com` (US)
- `eu1.anypoint.mulesoft.com` (EU)

**Key Endpoints**:
- `GET /actions` - List all document actions
- `GET /actions/{actionId}` - Get action details
- `GET /actions/{actionId}/versions` - List action versions
- `GET /actions/{actionId}/reviewers` - List action reviewers

## Authentication

The connector supports multiple authentication methods:

### OAuth 2.0 Client Credentials (Recommended)
Used for IDP Runtime Services execution operations.

**Token URL**: `https://anypoint.mulesoft.com/accounts/api/v2/oauth2/token`

**Required Scopes**: `Execute Published Actions`

**Example Token Request**:
```bash
curl --location --request POST 'https://anypoint.mulesoft.com/accounts/api/v2/oauth2/token' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "grant_type": "client_credentials",
    "client_id": "<your-connected-app-client-id>",
    "client_secret": "<your-connected-app-client-secret>"
  }'
```

See: [Create a Connected App](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#create-a-connected-app)

### Basic Authentication
Used for Platform API operations and review task management.

Requires Anypoint Platform username and password with:
- **MFA**: Exempted
- **Permissions**: Document Actions - Manage Actions

## Usage Examples

### Example 1: Submit Document for Processing

**Endpoint**: `POST /api/v1/organizations/{YOUR_ORG_ID}/actions/{YOUR_ACTION_ID}/versions/{VERSION}/executions`

**DataWeave Example** (Multipart):
```dataweave
%dw 2.0
output java
---
{
  parts: {
    callback: {
      headers: {
        "Content-Type": "text/plain"
      },
      content: '{"noAuthUrl": "https://your-callback-url.com/"}'
    },
    file: {
      headers: {
        "Content-Disposition": {
          name: "file",
          filename: "invoice.pdf",
          subtype: "form-data"
        },
        "Content-Type": "application/octet-stream"
      },
      content: payload
    }
  }
}
```

**Response**:
```json
{
  "id": "{YOUR_EXECUTION_ID}",
  "documentName": "invoice.pdf",
  "status": "ACKNOWLEDGED"
}
```

### Example 2: Retrieve Execution Results

**Endpoint**: `GET /api/v1/organizations/{YOUR_ORG_ID}/actions/{YOUR_ACTION_ID}/versions/{VERSION}/executions/{EXECUTION_ID}`

**Query Parameters**:
- `valueOnly=true` - Only return extracted values (removes confidence scores and geometry)

**Response Structure**:
```json
{
  "id": "{YOUR_EXECUTION_ID}",
  "documentName": "invoice.pdf",
  "status": "SUCCEEDED",
  "pages": [
    {
      "page": 1,
      "fields": {
        "invoice_number": {
          "value": "INV-12345",
          "confidenceScore": 95.5
        }
      },
      "prompts": {
        "total_amount": {
          "prompt": "What is the total amount?",
          "answer": {
            "value": "$1,234.56",
            "confidenceScore": 98.2
          }
        }
      }
    }
  ]
}
```

### Example 3: List Available Actions

**Endpoint**: `GET /idp/api/v1/organizations/{YOUR_ORG_ID}/actions`

**Query Parameters**:
- `page=0` - Page number (zero-based)
- `size=20` - Items per page (max 100)
- `sort=updatedAt,desc` - Sorting criteria

**Response**:
```json
{
  "actions": [
    {
      "id": "{YOUR_ACTION_ID}",
      "name": "Invoice Processing",
      "type": "INVOICE",
      "description": "Extract data from invoices",
      "createdAt": "2024-06-24T16:56:37.372612Z",
      "updatedAt": "2024-06-24T17:03:55.950227Z"
    }
  ],
  "total": 6
}
```

## Execution Status Reference

When querying execution results, the API returns one of these statuses:

| Status | Description |
|--------|-------------|
| `ACKNOWLEDGED` | The document action execution request was received |
| `IN_PROGRESS` | The execution started |
| `RESULTS_PENDING` | The execution finished and IDP is processing the results |
| `MANUAL_VALIDATION_REQUIRED` | The execution finished but the results need manual validation |
| `FAILED` | The execution request finished unsuccessfully |
| `PARTIAL_SUCCESS` | The execution request finished but some sub-tasks failed |
| `SUCCEEDED` | The execution request finished successfully |

See: [Execution Status Reference](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#execution-status-reference)

## Security Schemes

### OAuth 2.0 Client Credentials
- **Type**: oauth2
- **Flow**: clientCredentials
- **Token URL**: `/accounts/api/v2/oauth2/token`
- **Use Case**: Runtime execution operations

### Basic Authentication
- **Type**: http
- **Scheme**: basic
- **Use Case**: Platform API operations and review tasks

## Key Schema Components

The OpenAPI specification includes detailed schemas for:

- **Execution Requests**: Both multipart and Base64 formats
- **Execution Responses**: Full extraction results with confidence scores
- **Review Tasks**: Low-confidence fields requiring manual validation
- **Action Configuration**: Prompts, fields, and table definitions
- **Pagination**: Standard page/size/sort parameters
- **Error Responses**: RFC 7807 Problem Details format

## Additional Resources

- **Download OpenAPI Specification**: [idp-runtime-service-api.yaml](/assets/idp-connector/idp-runtime-service-api.yaml)
- **Postman Collection**: [Download Collection](/assets/idp-connector/mulesoft-idp-postman-collection.json)
- **REST Connect Documentation**: [Community REST Connect PDF](/assets/idp-connector/community-restconnect.pdf)
- **Official MuleSoft IDP Documentation**: [docs.mulesoft.com/idp](https://docs.mulesoft.com/idp/)
- **IDP API Guide**: [Automate Document Processing](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api)
- **Integrating with Anypoint Studio**: [Integration Guide](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio)

## See Also

- [Set Up](./set-up) - Installation and configuration guide
- [Operations](./operations/) - Detailed operation documentation
- [DataWeave Examples](./dataweave) - DataWeave transformation examples
