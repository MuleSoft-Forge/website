---
title: Service IDP - Execution Result - Retrieve
description: Get an execution of a published action by a given action Id, action version and execution Id
---

# Service IDP - Execution Result - Retrieve

Equivalent to [getDocumentActionExecution](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio#retrieve-the-results-of-the-execution)

### **Usage**:

* Retrieve the Results of **any** Execution
* After a document action successfully processes a document, or after a reviewer verifies and submits a document queued for review, the results are available for consumption.

### [Execution Results Reference](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#execution-status-reference)

When you query the results of an execution, the IDP API returns any of the following statuses:

* `ACKNOWLEDGED`: The document action execution request was received.
* `IN_PROGRESS`: The execution started.
* `RESULTS_PENDING`: The execution finished and IDP is processing the results.
* `MANUAL_VALIDATION_REQUIRED`: The execution finished but the results need manual validation.
* `FAILED`: The execution request finished unsuccessfully.
* `PARTIAL_SUCCESS`: The execution request finished but some sub-tasks failed.
* `SUCCEEDED`: The execution request finished successfully.

---

### Configuration:

::: tabs

== Anypoint Code Builder

![Anypoint Code Builder Configuration](/images/idp-connector/screenshot-2025-04-07-10-02-55.png)

== Anypoint Studio

![Anypoint Studio Configuration](/images/idp-connector/screenshot-2025-04-07-09-31-57.png)

:::

---

### Underlying API:

See the [IDP Runtime Service API specification](/assets/idp-connector/idp-runtime-service-api.yaml) for the full OpenAPI definition.

**Endpoint**: `GET /api/v1/organizations/{organizationId}/actions/{actionId}/versions/{versionSemantic}/executions/{executionId}`
