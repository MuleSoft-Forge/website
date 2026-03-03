---
title: Set Up
description: Installation and configuration guide for the MuleSoft IDP Connector
---

# Set Up

| Version | Min runtime version | Compatible Java versions | Description |
| ------- | ------------------- | ------------------------ | ----------- |
| [1.0.6](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/1.0.6) | 4.6.X | Java 17, Java 11, Java 8 | [Issue #21](https://github.com/MuleSoft-Forge/mule-idp-connector/issues/21#issue-3385498592) |
| [1.0.5](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/1.0.5) | 4.6.X | Java 17, Java 11, Java 8 | [Issue #18](https://github.com/MuleSoft-Forge/mule-idp-connector/issues/18) |
| [1.0.4](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/1.0.4) | 4.6.X | Java 17, Java 11, Java 8 | [Issue #15](https://github.com/MuleSoft-Forge/mule-idp-connector/issues/15) |
| [1.0.3](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/1.0.3) | 4.6.X | Java 17, Java 11, Java 8 | Java 17 support |
| [1.0.2](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/1.0.2) | 4.6.X | Java 11, Java 8 | Proxy support<br>Bug Fix - Action and Version drop-downs load all |
| [1.0.1](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/1.0.1) | 4.6.X | Java 11, Java 8 | Deprecated Utils PDFBox |
| [1.0.0](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/1.0.0) | 4.6.x | Java 11, Java 8 | Launch |

<details>

<summary><a href="https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/overview"><img src="https://img.shields.io/maven-central/v/io.github.mulesoft-forge/mule-idp-connector" alt="Maven Central"></a></summary>

[Serving Open Source Components Since 2002](https://central.sonatype.org/pages/about/) The Central Repository is the largest collection of Java and other open source components. It provides the easiest way to access and distribute your software components to millions of developers.

</details>

<details>

<summary>Step1: Maven Central Repository</summary>

PREFERRED METHOD TO ADD DEPENDENCY IS TO USE [Add Custom Modules to Your Project](https://docs.mulesoft.com/studio/add-custom-modules-in-studio-to)

![Add Custom Modules](/images/idp-connector/screenshot-2025-05-21-09-28-05.png)

#### (not preferred method use ABOVE) Edit Project File `pom.xml`

<Hint type="info">

The MuleSoft Forge connectors are constantly updated, and the version is regularly changed. Make sure to replace `{version}` with the latest release from [Maven Central](https://central.sonatype.com/artifact/io.github.mulesoft-forge/mule-idp-connector/overview).

</Hint>

Copy and paste the following Maven Dependency into your Mule application pom file.

```xml title="pom.xml"
<dependency>
    <groupId>io.github.mulesoft-forge</groupId>
    <artifactId>mule-idp-connector</artifactId>
    <version>{version}</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

See Anypoint Code Builder Example: Note xml `<dependencies>` tags if not present.

![Code Builder POM Example](/images/idp-connector/screenshot-2025-03-25-10-52-37.png)

</details>

<details>

<summary id="step2-access-management">Step2: Access Management</summary>

To access the following operations:

1. [Service IDP - Execution - Submit](./operations/service-idp-execution-submit)
2. [Service IDP - Execution Result - Retrieve](./operations/service-idp-execution-result-retrieve)

#### Create a Connected App with the following details:

* Type: `App acts on its own behalf (client credentials)`
* Scopes: `Execute Published Actions`

After you create the connected app, copy its **ID** and **Secret** for Connector Configuration.

---

#### To [access platform API](https://anypoint.mulesoft.com/exchange/portals/anypoint-platform/f1e97bc6-315a-4490-82a7-23abe036327a.anypoint-platform/access-management-api/minor/1.0/pages/Authentication/) you need to supply **Anypoint User Account** details with the following User details:

* Multi-factor auth: `Exempted`

![MFA Exemption](/images/idp-connector/image-5.png)

* Permissions: `Document Actions - Manage Actions`

![Document Actions Permission](/images/idp-connector/image-6.png)

</details>

::: tabs

== Step3: Test API

Learn API first at speed outside of MuleSoft - Postman ![Postman icon](/images/idp-connector/image-3.png)

If you are unfamiliar with the underlying API to a connector and **not sure you have permissions right** please fight those issues in Postman/SoapUI first.

Here is a complete Postman Collection:

[Download Postman Collection](/assets/idp-connector/mulesoft-idp-postman-collection.json)

:::

#### Step4: Connector Configuration

::: tabs

== Anypoint Studio

<Stepper>
<Step title="Create Global Element Connector Configuration">

Choose Global Type, restricting on "idp"

![Choose Global Type](/images/idp-connector/screenshot-2025-03-25-09-30-34.png)

</Step>

<Step title="Default Config Settings">

MuleSoft IDP Config default settings are as follows:

![Default Config Settings](/images/idp-connector/screenshot-2025-03-25-09-32-08.png)

</Step>

<Step title="Enter your Settings">

<Hint type="warning">

Tip - Enter OAuth first as the configuration UI validates that first! ![Validation tip](/images/idp-connector/screenshot-2025-04-11-13-20-08.png)

</Hint>

</Step>

</Stepper>

::: tabs

== OAuth 3️⃣

* **Client id**: ID of the connected app to call IDP
* **Client secret**: Secret of the connected app to call IDP
* **Token url**: URL to obtain the access token for your connected app

  Default: `https://anypoint.mulesoft.com/accounts/api/v2/oauth2/token`
* **Scopes**: Leave Empty

![OAuth Configuration](/images/idp-connector/screenshot-2025-03-26-09-25-20.png)

**Example Completed Region:**

![OAuth Completed](/images/idp-connector/screenshot-2025-03-25-09-36-29.png)

== IDP API 1️⃣

* **MuleSoft IDP Service Host**: Select your IDP service host. The drop down values are the currently supported regions

![IDP Service Host](/images/idp-connector/screenshot-2025-03-25-09-32-51.png)

* **MuleSoft Organization Id**: Enter your MuleSoft Organization Id (Org Id) that your MuleSoft IDP entitlement exists [https://help.salesforce.com/s/articleView?id=001115130&type=1](https://help.salesforce.com/s/articleView?id=001115130&type=1)

**Example Completed Region:**

![IDP API Completed](/images/idp-connector/screenshot-2025-03-25-09-33-48.png)

== Platform API 2️⃣

### **Mulesoft Account for Config Introspection and Platform API**

<Hint type="danger">

**Optional but if you want to have dynamic drop downs when configuring your operations at design time and or you want to call a Platform API operation it becomes mandatory**

**Introspection for what IDP document actions are published and what versions at Design Time!**

![Introspection](/images/idp-connector/image-10.png)

</Hint>

* **MuleSoft Platform Account Host**: Select your Anypoint region host. The drop down values are the most frequently set but feel free to enter manually your region such as Hyperforce

![Platform Account Host](/images/idp-connector/screenshot-2025-03-25-09-34-11.png)

* **MuleSoft Platform Account Username:** [MuleSoft login user name](#step2-access-management)
* **MuleSoft Platform Account Password:** [MuleSoft login password](#step2-access-management)

**Example Completed Region:**

![Platform API Completed](/images/idp-connector/screenshot-2025-03-25-09-34-38.png)

== ObjectStore 4️⃣

![ObjectStore Configuration](/images/idp-connector/image-14.png)

The IDP obtained access tokens are stored in an `ObjectStore`. By default, the SDK will store them in the apps's default store, but users can define their own custom one

**Example Completed Region:**

![ObjectStore Completed](/images/idp-connector/image-15.png)

:::

<Stepper>
<Step title="Test Connection">

![Test Connection](/images/idp-connector/screenshot-2025-03-25-09-36-58.png)

Of course you can use [Configuring Properties - Property Placeholders](https://docs.mulesoft.com/mule-runtime/latest/configuring-properties#property-placeholders)

![Property Placeholders](/images/idp-connector/screenshot-2025-04-11-13-27-12.png)

</Step>
</Stepper>

== Anypoint Code Builder

<Stepper>
<Step title="Create Global Element Connector Configuration">

Currently ACB does not have a dedicated Global Configuration Elements UI, so create the configuration as part of the configuration of the first IDP Operation configuration of the project

![ACB Global Config](/images/idp-connector/screenshot-2025-03-25-16-20-34.png)

</Step>

<Step title="Enter your Settings">

::: tabs

== OAuth 3️⃣

![ACB OAuth](/images/idp-connector/image-21.png)

* **Client id**: ID of the connected app to call IDP
* **Client secret**: Secret of the connected app to call IDP
* **Token url**: URL to obtain the access token for your connected app

  Default: `https://anypoint.mulesoft.com/accounts/api/v2/oauth2/token`
* **Scopes**: Leave Empty

![ACB OAuth Config](/images/idp-connector/screenshot-2025-03-26-09-25-20.png)

**Example Completed Region:**

![ACB OAuth Completed](/images/idp-connector/image-22.png)

== IDP API 1️⃣

![ACB IDP API](/images/idp-connector/screenshot-2025-03-25-16-55-06.png)

* **Name**: Enter `MuleSoft_IDP_Config`
* **Connection**: Leave as `Connection`
* **MuleSoft IDP Service Host**:
  * Press the Blue Refresh Icon (Value Provider)
  * The drop down values are the currently supported regions

  ![Value Provider](/images/idp-connector/image-17.png)

* **MuleSoft Organization Id**: Enter your MuleSoft Organization Id (Org Id) that your MuleSoft IDP entitlement exists [https://help.salesforce.com/s/articleView?id=001115130&type=1](https://help.salesforce.com/s/articleView?id=001115130&type=1)

**Example Completed Region:**

![ACB IDP API Completed](/images/idp-connector/screenshot-2025-03-25-17-00-37.png)

== Platform API 2️⃣

### **MuleSoft Account for Config Introspection and Platform API**

![ACB Platform API](/images/idp-connector/image-18.png)

<Hint type="danger">

**Optional but if you want to have dynamic drop downs when configuring your operations at design time and or you want to call a Platform API operation it becomes mandatory**

**Introspection for what IDP document actions are published and what versions at Design Time!**

![ACB Introspection](/images/idp-connector/image-4.png)

</Hint>

* **MuleSoft Platform Account Host**: Select your Anypoint region host. The drop down values are the most frequently set but feel free to enter manually your region such as Hyperforce

![ACB Platform Host](/images/idp-connector/image-19.png)

* **MuleSoft Platform Account Username:** [MuleSoft login user name](#step2-access-management)
* **MuleSoft Platform Account Password:** [MuleSoft login password](#step2-access-management)

**Example Completed Region:**

![ACB Platform API Completed](/images/idp-connector/image-20.png)

== ObjectStore 4️⃣

![ACB ObjectStore](/images/idp-connector/image-14.png)

The IDP obtained access tokens are stored in an `ObjectStore`. By default, the SDK will store them in the apps's default store, but users can define their own custom one

**Completed Region:**

![ACB ObjectStore Completed](/images/idp-connector/image-15.png)

:::

</Step>

<Step title="Test Connection">

![ACB Test Connection](/images/idp-connector/screenshot-2025-03-25-17-19-00.png)

</Step>
</Stepper>

:::
