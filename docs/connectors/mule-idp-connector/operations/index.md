---
title: Operations
description: Available operations for the MuleSoft IDP Connector
---

# Operations

![Operations Overview](/images/idp-connector/screenshot-2025-03-26-10-17-50.png)

## Specification for MuleSoft IDP Universal Connector Open-Source

---

**Purpose:**

To create a MuleSoft IDP Universal Connector (using Mule SDK for Java) that wraps **Two REST API** and adds value-add functionality such as Apache PDFBox®. Based on the MuleSoft IDP Universal 🌐 Rest Smart Connector 🔌

YES - unusual to expose Two rest endpoints in one connector but honestly they go hand in hand, arguably it could be said it was a design fault to have them separate so lets combine and simplify as a connector should be all about.

---

**Scope:**

| Runtime Platform | Connector Operation Name | Required Authentication | URL |
| ---------------- | ------------------------ | ----------------------- | --- |
| MuleSoft IDP Runtime Services | IDP Submit Doc Execution | OAuth 2.0 Client Credentials | https://idp-rt.us-east-1.anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/versions/{version}/executions |
| MuleSoft IDP Runtime Services | IDP Retrieve Execution Result | OAuth 2.0 Client Credentials | https://idp-rt.us-east-1.anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/versions/{version}/executions/{executionId}?valueOnly=true |
| MuleSoft IDP Runtime Services | IDP List Pending Review Tasks | Basic Authentication | https://idp-rt.us-east-1.anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/reviews?page=0&size=10 |
| MuleSoft IDP Runtime Services | IDP Delete a Review Task | Basic Authentication | https://idp-rt.us-east-1.anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/reviews/{executionId} |
| MuleSoft IDP Runtime Services | IDP Retrieve a Review Task | Basic Authentication | https://idp-rt.us-east-1.anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/reviews/{executionId} |
| MuleSoft IDP Runtime Services | IDP Update a Review Task | Basic Authentication | https://idp-rt.us-east-1.anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/reviews/{executionId} |
| MuleSoft Platform Services for IDP | Platform IDP List Actions | Basic Authentication | https://anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions?page=0&sort=updatedAt,desc |
| MuleSoft Platform Services for IDP | Platform IDP Retrieve Action Detail | Basic Authentication | https://anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId} |
| MuleSoft Platform Services for IDP | Platform IDP List Action's Versions | Basic Authentication | https://anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/versions?page=0&size=10&sort=version,desc |
| MuleSoft Platform Services for IDP | Platform IDP Retrieve Action's Version | Basic Authentication | https://anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/versions/{versionSemantic} |
| MuleSoft Platform Services for IDP | Platform IDP List Action's Reviewers | Basic Authentication | https://anypoint.mulesoft.com/idp/api/v1/organizations/{organizationId}/actions/{actionId}/reviewers |

---

**📣 Surface the MuleSoft IDP Runtime Services**

1. ** 🚀 Submit Document to MuleSoft IDP** see [Execute the Published Document Actions](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio#submit-a-document-to-idp)
   * Support [Base64 Interface](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#upload-base64-file) including [Input MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-input)
   * Support [Multipart Interface](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio#submit-a-document-to-idp) including [Input MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-input)
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)
   * Support optional Header [x-sfdc-core-tenant-id](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#use-a-different-salesforce-org-to-execute-your-document-actions)
   * Support optional [CallbackUrl](https://docs.mulesoft.com/idp/automate-document-processing-with-the-idp-api#callback-url) on both interfaces
   * Value Add: Add ability on submission to utilize [Apache PDFBox®](https://pdfbox.apache.org/)
     * Submit only selected pdf pages ie 1,3,10,11 or 1-3,6,8-12
     * Remove Blank Pages (Apache PDFBox may not support)
   * Value Add: Debate Validate for [Limits](https://docs.mulesoft.com/idp/quotas-and-limits) in Connector (hard coding really)
2. ** 🚀 Retrieve Results from MuleSoft IDP** see [Retrieve the Results of the Execution](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio#submit-a-document-to-idp)
   * Support valueOnly Query parameter - Only keep the extracted value of the given field, remove confidenceScore and geometry from the response body
   * Major Work: Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output) using MuleSoft Platform Services for IDP to interrogate Action Version schema at design time

---

**📣 Additional MuleSoft IDP Runtime Services**

See MuleSoft IDP Runtime Services

1. ** 🚀 List All Review Tasks from MuleSoft IDP**
   * Description: list of all executions requiring manual review, across all actions, that the **requesting user has permission to review** - So login details are important here
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)
2. ** 🚀 Delete a Review Task from MuleSoft IDP**
   * Description: Delete a Review Task by Execution Id (Execution Status is updated as SUCCEEDED without changing the execution result)
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)
3. ** 🚀 Get Low Confidence fields for an Execution in Review from MuleSoft IDP**
   * Description: Get a list of low-confidence fields by Execution Id
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)
4. ** 🚀 Update the Low Confidence fields for an Execution in Review from MuleSoft IDP**
   * Description: Patch a list of low-confidence fields by Execution Id
   * Support Request [Input MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-input)
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)

---

**⚙️ Surface the MuleSoft Platform Services for IDP**

1. ** 🚀 List All Document Actions for an Organization**
   * Description: Get a list of low-confidence fields by Execution Id
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)
2. ** 🚀 Get an Action Detail**
   * Description: Get a list of low-confidence fields by Execution Id
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)
3. ** 🚀 List an Action's Versions**
   * Description: Get a list of low-confidence fields by Execution Id
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)
4. ** 🚀 List an Action's Reviewers**
   * Description: Get a list of low-confidence fields by Execution Id
   * Support Response [Output MetaData](https://docs.mulesoft.com/mule-sdk/latest/metadata-output)

---

**⚙️ Universal Service for IDP**

1. ** 🚀 Universal Http Resource **
   * Experimental: How about we create a resource that can have json in json out and the developer configures the URL but reuses all the hard work of configuration/connectivity. Therefore the Connector does not become obsolete so quickly, ie we can support other services for the host.

---
