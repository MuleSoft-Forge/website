---
title: MuleSoft IDP Connector
description: A Universal IDP Connector to rule them All
---

# mule-idp-connector

This connector provides a **unified interface** for interacting with **MuleSoft Intelligent Document Processing (IDP) actions**, mitigating challenges associated with connector sprawl and reconfiguration overhead when [integrating IDP with Anypoint Studio](#integrating-idp-with-anypoint-studio).

## **Key Benefits:**

* **Defeat Connector Sprawl**: Consolidates multiple IDP actions into a single connector interface.
* **Simplified Configuration**: Minimizes reconfiguration needs in Anypoint projects when action versions change.
* **Enhanced Flexibility**: Designed to support potentially undocumented functionalities.
* **Scalability:** Enables rapid onboarding of new document actions for enterprise scale.

### Integrating IDP with Anypoint Studio

<Hint type="success">

* How can reduce the number of connectors and mitigate the known issues with [Integrating IDP with Anypoint Studio](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio)
  * "Each document action version generates a different connector."
  * "Then, if you modify the document action and republish it as version `1.1.0`, it generates a different connector"
* **Yes** sure use [Service IDP - Execution - Submit](./operations/service-idp-execution-submit)

</Hint>

<Hint type="success">

* The [dateweave for Postdocumentactionexecution request data](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio#submit-a-document-to-idp) is so complicated and I keep on getting 400 Http Status. Is there a simpler way?
* **Yes** sure use [Service IDP - Execution - Submit](./operations/service-idp-execution-submit)

</Hint>

<Hint type="success">

* Test Connection fails with "**clientId cannot be blank"**
* **Yes** sure use our [connectivity test](./set-up) it works for both Basic and OAuth

</Hint>

### Value Adds

<Hint type="success">

* Can I notify (Email) reviewers on failure or manual review required?
* **Yes** sure use [Service IDP - Review Task - Delete](./operations/service-idp-review-task-delete)

</Hint>

<Hint type="success">

* Can I update a Review Task without requiring a human in the loop ie a daemon process
* **Yes** sure use [Service IDP - Review Task - Update](./operations/service-idp-review-task-update)

</Hint>

<Hint type="success">

* Can I list my current Document Actions  and their versions for a 3rd Party or Documentation?
* **Yes** sure use [Platform IDP - Actions - List](./operations/platform-idp-actions-list) & [Platform IDP - Action Versions - List](./operations/platform-idp-action-versions-list)

</Hint>

<Hint type="success">

* How do I **delete Review Tasks**?
* **Yes** sure use [Service IDP - Review Task - Delete](./operations/service-idp-review-task-delete) and most likely [Service IDP - Review Tasks - List](./operations/service-idp-review-tasks-list)

</Hint>

::: tabs

== Anypoint Code Builder

![Anypoint Code Builder Screenshot](/images/idp-connector/screenshot-2025-04-07-09-08-56.png)

== Anypoint Studio

![Anypoint Studio Screenshot](/images/idp-connector/screenshot-2025-04-07-09-07-12.png)

:::

## Background

## [Integrating IDP with Anypoint Studio / Anypoint Code Builder](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio)

> Execute a published document action and retrieve the results from Anypoint Studio using that document action's IDP Runtime Service API connector. This connector generates automatically when you publish a document action to Anypoint Exchange. Then, you can download it as a Mule connector from Exchange.
>
> Each document action version **generates a different connector**. For example, when you publish a document action for the first time, it generates a connector in Exchange that executes version `1.0.0` of this document action. Then, if you modify the document action and republish it as version `1.1.0`, it **generates a different connector** that you must download and install in Studio to execute this new document action version. Consider this behavior when building your integrations.

The **mule-idp-connector** was developed to address these key challenges, which are not criticisms

* Each MuleSoft IDP Document Action creates a REST Connector
* Each newly published version of a MuleSoft IDP Document Action creates another connector and  breaking change to existing Anypoint Studio/Code Builder project.
* Multipart input to [**postDocumentActionExecution**](https://docs.mulesoft.com/idp/integrating-idp-with-anypoint-studio#submit-a-document-to-idp) has no [datasense](https://docs.mulesoft.com/studio/latest/datasense-concept) and prone to tribal knowledge
