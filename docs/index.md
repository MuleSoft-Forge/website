---
layout: home
title: MuleSoftForge
description: Community-Driven MuleSoft Assets

hero:
  name: MuleSoftForge
  text: Community-Driven MuleSoft Assets
  tagline: Open-source MuleSoft connectors, modules and tools, built by the community for the community
  actions:
    - theme: brand
      text: Browse All Assets
      link: /assets
    - theme: alt
      text: What's New
      link: /whats-new
    - theme: alt
      text: Get Involved
      link: /forge-initiative/how-to-contribute

features:
  - icon:
      src: /images/favicon.png
      alt: MuleSoftForge Studio AI
    title: "MuleSoftForge Studio AI"
    details: "Broken DataWeave? Right-click and choose <strong>Fix with MuleSoftForge AI</strong>. It explains what went wrong and hands back the fix, and you review the diff before anything changes."
    media:
      heading: AI inside Anypoint Studio
      frames:
        - src: /images/studio-ai/fix-with-ai-menu-card.png
          alt: "Right-click menu in the Anypoint Studio DataWeave editor showing Send to MuleSoftForge AI and Fix with MuleSoftForge AI"
          caption: Right-click
        - src: /images/studio-ai/fix-with-ai-result.png
          alt: "MuleSoftForge AI returns the corrected DataWeave, explains the missing comma, and offers Review diff and Apply to the DataWeave editor"
          caption: Fixed
    link: /studio-ai/install
    linkText: Install in Studio

  - icon:
      src: /images/typesafe-connector-icon.svg
      alt: TypeSafe Connector for Mule 4
    title: "TypeSafe Connector for Mule 4"
    details: "Think: Smart If Statements. Jev turns JSON state into a typed value your flow can branch on — Noul, Choice, and Score across TypeSafe, OpenRouter, Vercel, Cloudflare, compatible gateways, or a local mock."
    video:
      heading: Why Jev
      src: https://www.youtube.com/embed/FJ5od66CSEs
      title: "Rick & Morty Explain Jev AI: Stop Using LLMs for Tiny Decisions!"
    link: /connectors/mule4-typesafe-connector/
    linkText: Learn More

  - icon:
      src: /images/agent-network-studio-icon.png
      alt: Agent Network Studio
    title: "Agent Network Studio"
    details: "Build, ship, and observe MuleSoft Agent Networks from the browser — visually compose brokers, publish and deploy with the real Anypoint CLI lifecycle, then trace every task, hop, and LLM decision live."
    link: https://www.agentnetworktracer.com
    linkText: Launch Studio

  - icon:
      src: /images/salesforce-userinfo-claims-enrichment-icon.png
      alt: Salesforce UserInfo Claims Enrichment Policy
    title: "Salesforce UserInfo Claims Enrichment Policy"
    details: "Flex Gateway PDK policy that enriches the Authentication principal with per-user Salesforce custom attributes from the UserInfo endpoint — the missing piece for per-user MCP tool authorization and ABAC, since Salesforce doesn't put custom attributes in access tokens."
    link: https://p4a.up.railway.app/dashboard/policies/bb58ed5d-6881-440a-a08b-69160eab5b37
    linkText: View on P4A

  - icon:
      src: /images/infa-mdm-connector-icon.svg
      alt: Informatica MDM - B360 Connector
    title: "Informatica MDM - B360 Connector"
    details: "Native MuleSoft connector for Informatica MDM Business 360 REST API — Master Read, Search, Source Read, and Source Submit with full DataSense support"
    link: /connectors/mule-infa-mdm-connector/
    linkText: Learn More

  - icon:
      src: /images/idp-connector-icon.svg
      alt: MuleSoft IDP Connector
    title: MuleSoft IDP Connector
    details: Intelligent Document Processing for extracting structured data from PDFs, images, and scanned documents using AI-powered classification and extraction
    link: /connectors/mule-idp-connector/
    linkText: Learn More

  - icon:
      src: /images/pdfbox-module-icon.svg
      alt: MuleSoft PDFBox Module
    title: MuleSoft PDFBox Module
    details: Comprehensive PDF manipulation operations including text extraction, page filtering, rotation, splitting, merging, and conversion powered by Apache PDFBox
    link: /modules/mule-pdfbox-module/
    linkText: Learn More

  - icon:
      src: /images/chunking-connector-icon.png
      alt: Mule Chunking Connector
    title: Mule Chunking Connector
    details: Stream large binary files into chunks for streaming processing in Mule, maintaining constant memory regardless of incoming stream size. Ideal for S3 multipart upload, ETL, and checksums.
    link: /connectors/mule-chunking-connector/
    linkText: Learn More

  - icon:
      src: /images/lettuce-redis-connector-icon.png
      alt: Lettuce Redis Connector
    title: Lettuce Redis Connector
    details: Direct access to Redis commands from Mule applications, built on the Lettuce reactive client. Full coverage of strings, hashes, lists, sets, streams, Pub/Sub sources, and arbitrary commands.
    link: /connectors/mule-lettuce-redis-connector/
    linkText: Learn More

  - icon:
      src: /images/json-logger/json-logger.svg
      alt: JSON Logger
    title: JSON Logger
    details: Drop-in replacement for the standard MuleSoft logger, enabling unified logging in JSON format. Also supports seamless log forwarding to Anypoint MQ, JMS, or AMQP destinations.
    link: /modules/json-logger/
    linkText: Learn More

  - icon:
      src: /images/community-icon.png
      alt: MuleSoft Community
    title: Open Source & Community-Driven
    details: All assets are open source and maintained by the MuleSoft community. Contributions, bug reports, and feature requests are welcome!
    link: /forge-initiative/overview
    linkText: Learn About Forge Initiative
---

## Welcome to MuleSoftForge

<Hint type="success">

**New** — **[MuleSoftForge Studio AI](./studio-ai/)**: an AI helper inside Anypoint Studio for flows, DataWeave, Problems and Console. You review every proposed edit before it is written. [Install and set up →](./studio-ai/install)

</Hint>

MuleSoftForge is the one-stop shop for community-built MuleSoft assets. Connectors, modules and tools that used to be scattered across personal and partner repositories live here, documented the same way, with versions straight from Maven Central.

## All Assets

Filter by type or search by purpose. Every card opens the asset's docs, with its own sidebar for set-up and operations.

<AssetCatalog />

## What's New

<WhatsNew :limit="5" />

[See every release →](./whats-new) · [Subscribe via RSS](/feed.xml){target="_self"}

## Built by the Community

These are the people who build and maintain MuleSoftForge assets. Your face could be here.

<Contributors />

<Stepper>
<Step title="Use an asset">

Pick an asset above, copy its Maven dependency from the **At a glance** box, and follow its Set Up page.

</Step>
<Step title="Report or improve">

Found a bug or a gap in the docs? Open an issue on the asset's GitHub repository, or use **Edit this page on GitHub** at the bottom of any page.

</Step>
<Step title="Build the next one">

Have an asset the community needs? [Propose a new asset](./forge-initiative/how-to-contribute#propose-a-new-asset) and we will help you publish it.

![We Need You](/images/weneedyou.png)

</Step>
</Stepper>
