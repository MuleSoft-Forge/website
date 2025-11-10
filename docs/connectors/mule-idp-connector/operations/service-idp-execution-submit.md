---
title: Service IDP - Execution - Submit
description: Submits a document to IDP for processing
---

# Service IDP - Execution - Submit

Equivalent to [postDocumentActionExecution](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio#submit-a-document-to-idp)

### **Usage**:

* Compatible with **any** Document Action Version.
* No more multipart which in itself highlights the confusion as it need only be Output Java.

![Service IDP Execution Submit](/images/idp-connector/screenshot-2025-03-26-10-32-52.png)

* Support for [Different Salesforce Org to Execute Your Document Actions](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#use-a-different-salesforce-org-to-execute-your-document-actions)
* Dynamic Design Time Action Id and Version prompting from your published services. No need to know what Action UUID or Semantic Version are published and typos

![Dynamic Drop Downs](/images/idp-connector/dynamic-dropdowns.gif)

---

### Configuration:

::: tabs

== Anypoint Studio

![Anypoint Studio Configuration](/images/idp-connector/screenshot-2025-04-07-09-07-12-alt.png)

== Anypoint Code Builder

![Anypoint Code Builder Configuration](/images/idp-connector/screenshot-2025-04-07-09-08-56-alt.png)

:::

<Stepper>
<Step title="Input - Mule Message - Payload">

![Input Payload 1](/images/idp-connector/image-25.png)

![Input Payload 2](/images/idp-connector/image-26.png)

![Input Payload 3](/images/idp-connector/image-30.png)

</Step>

<Step title="Configuration Panel">

**General Region**

* **Action id**: If Basic Authentication configured you can expect dynamic loading of your org's actions. Action Id is the UUID found in the published exchange asset for your Document Action Version

```
https://idp-rt.us-east-1.anypoint.mulesoft.com/api/v1/organizations/{YOUR_ORG_ID}/actions/{YOUR_ACTION_ID}/versions/1.0.0/executions
```

* **Version semantic**: If Basic Authentication configured you can expect dynamic loading of your org's action's versions. Version semantic is the version found in the published exchange asset for your Document Action Version

```
https://idp-rt.us-east-1.anypoint.mulesoft.com/api/v1/organizations/{YOUR_ORG_ID}/actions/{YOUR_ACTION_ID}/versions/{VERSION}/executions
```

* **File content**: [The Binary data format handles binary content, such as an image or PDF](https://docs.mulesoft.com/dataweave/latest/dataweave-formats-binary)

**Submission Options**

* **Filename**: Name and Extension of your doc to be submitted
* **Callback URL**: [You can define a callback URL](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#callback-url) when you call IDP to execute your document actions. If defined, IDP calls the callback URL when the document action execution finishes with state `SUCCEEDED`, `FAILED`, or `MANUAL_VALIDATION_REQUIRED`.
* **Override Salesforce Org ID**: [If you have multiple Salesforce Orgs connected](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#retrieve-the-results-of-the-execution) with your Anypoint Platform organization, you can specify the Org to use when executing your document actions.

</Step>

<Step title="Output - Mule Message - Payload">

The response from this operation contains the execution ID that you can use to retrieve the execution results.

![Output Payload 1](/images/idp-connector/image-27.png)

![Output Payload 2](/images/idp-connector/image-31.png)

```json
{
   "id":"{YOUR_EXECUTION_ID}",
   "documentName":"IDP-PO-CD656092-BurlingtonTextiles.pdf"
}
```

</Step>
</Stepper>

---

### Underlying API:

See the [IDP Runtime Service API specification](/assets/idp-connector/idp-runtime-service-api.yaml) for the full OpenAPI definition.

**Endpoint**: `POST /api/v1/organizations/{organizationId}/actions/{actionId}/versions/{versionSemantic}/executions`
