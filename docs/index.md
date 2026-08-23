---
layout: home
title: MuleSoftForge
description: Community-Driven MuleSoft Assets

hero:
  name: MuleSoftForge
  text: Community-Driven MuleSoft Assets
  tagline: Open-source MuleSoft connectors and modules, built by the community for the community
  actions:
    - theme: brand
      text: Browse Connectors
      link: /connectors/mule-infa-mdm-connector/
    - theme: alt
      text: Get Involved
      link: /forge-initiative/how-to-contribute
    - theme: alt
      text: View on GitHub
      link: https://github.com/MuleSoft-Forge

features:
  - icon:
      src: /images/agent-network-studio-icon.png
      alt: Agent Network Studio
    title: "Agent Network Studio"
    details: "Build, ship, and observe MuleSoft Agent Networks from the browser — visually compose brokers, publish and deploy with the real Anypoint CLI lifecycle, then trace every task, hop, and LLM decision live."
    link: https://www.agentnetworktracer.com
    linkText: Launch Studio →

  - icon:
      src: /images/salesforce-userinfo-claims-enrichment-icon.png
      alt: Salesforce UserInfo Claims Enrichment Policy
    title: "Salesforce UserInfo Claims Enrichment Policy"
    details: "Flex Gateway PDK policy that enriches the Authentication principal with per-user Salesforce custom attributes from the UserInfo endpoint — the missing piece for per-user MCP tool authorization and ABAC, since Salesforce doesn't put custom attributes in access tokens."
    link: https://p4a.up.railway.app/dashboard/policies/bb58ed5d-6881-440a-a08b-69160eab5b37
    linkText: View on P4A →

  - icon:
      src: /images/infa-mdm-connector-icon.svg
      alt: Informatica MDM - B360 Connector
    title: "Informatica MDM - B360 Connector"
    details: "Native MuleSoft connector for Informatica MDM Business 360 REST API — Master Read, Search, Source Read, and Source Submit with full DataSense support"
    link: /connectors/mule-infa-mdm-connector/
    linkText: Learn More →

  - icon:
      src: /images/idp-connector-icon.svg
      alt: MuleSoft IDP Connector
    title: MuleSoft IDP Connector
    details: Intelligent Document Processing for extracting structured data from PDFs, images, and scanned documents using AI-powered classification and extraction
    link: /connectors/mule-idp-connector/
    linkText: Learn More →

  - icon:
      src: /images/pdfbox-module-icon.svg
      alt: MuleSoft PDFBox Module
    title: MuleSoft PDFBox Module
    details: Comprehensive PDF manipulation operations including text extraction, page filtering, rotation, splitting, merging, and conversion powered by Apache PDFBox
    link: /modules/mule-pdfbox-module/
    linkText: Learn More →

  - icon:
      src: /images/chunking-connector-icon.png
      alt: Mule Chunking Connector
    title: Mule Chunking Connector
    details: Stream large binary files into chunks for streaming processing in Mule, maintaining constant memory regardless of incoming stream size. Ideal for S3 multipart upload, ETL, and checksums.
    link: /connectors/mule-chunking-connector/
    linkText: Learn More →

  - icon:
      src: /images/lettuce-redis-connector-icon.png
      alt: Lettuce Redis Connector
    title: Lettuce Redis Connector
    details: Direct access to Redis commands from Mule applications, built on the Lettuce reactive client. Full coverage of strings, hashes, lists, sets, streams, Pub/Sub sources, and arbitrary commands.
    link: /connectors/mule-lettuce-redis-connector/
    linkText: Learn More →

  - icon:
      src: /images/community-icon.png
      alt: MuleSoft Community
    title: Open Source & Community-Driven
    details: All assets are open source and maintained by the MuleSoft community. Contributions, bug reports, and feature requests are welcome!
    link: /forge-initiative/overview
    linkText: Learn About Forge Initiative →
---

## Welcome to MuleSoftForge

<Hint type="success">

**New** — **[Salesforce UserInfo Claims Enrichment Policy](https://p4a.up.railway.app/dashboard/policies/bb58ed5d-6881-440a-a08b-69160eab5b37)** — Flex Gateway PDK policy enriching the Authentication principal with per-user Salesforce custom attributes, for MCP tool authorization and ABAC. [View on P4A →](https://p4a.up.railway.app/dashboard/policies/bb58ed5d-6881-440a-a08b-69160eab5b37)

</Hint>

<Stepper>
<Step title="Purpose: The one-stop shop for Community Assets">

MuleSoftForge is a centralized open-source repository for community-contributed MuleSoft assets. This hub consolidates connectors, modules, and other resources that have been scattered across the ecosystem, providing a single location for both existing and future community contributions.

</Step>

<Step title="Your invitation to Build">

Join us on [GitHub](https://github.com/MuleSoft-Forge). Your contributions help build a valuable resource for the entire MuleSoft community.

![We Need You](/images/weneedyou.png)

</Step>
</Stepper>

---

## Available Assets

### Connectors

- **[Informatica MDM - B360 Connector](./connectors/mule-infa-mdm-connector/)** — *New* — Informatica MDM Business 360 REST API integration
  - Master Read, Search, Source Read, and Source Submit operations
  - Dynamic DataSense with entity-aware metadata resolution
  - Automatic IICS authentication and JWT session management

- **[MuleSoft IDP Connector](./connectors/mule-idp-connector/)** - Intelligent Document Processing with AI-powered extraction and classification
  - Extract structured data from PDFs, images, and scans
  - Pre-built actions for common document types (invoices, receipts, forms)
  - Custom training for specialized document workflows

- **[Mule Chunking Connector](./connectors/mule-chunking-connector/)** - Stream large binary files into chunks for constant-memory processing
  - True streaming with lazy iteration and raw binary access
  - Use cases: S3 multipart upload, streaming ETL, checksum calculation

- **[Lettuce Redis Connector](./connectors/mule-lettuce-redis-connector/)** - Direct Redis access from Mule via the Lettuce reactive client
  - Dedicated operations for keys, hashes, lists, sets, sorted sets, streams, Pub/Sub
  - Send Command for arbitrary Redis commands; search operations with cursor handling

### Modules

- **[MuleSoft PDFBox Module](./modules/mule-pdfbox-module/)** - Complete PDF manipulation toolkit
  - Extract text and metadata from PDFs
  - Filter, rotate, split, and merge PDF documents
  - Convert images to PDF format
  - Built on Apache PDFBox 3.x

### Policies

- **[Salesforce UserInfo Claims Enrichment Policy](https://p4a.up.railway.app/dashboard/policies/bb58ed5d-6881-440a-a08b-69160eab5b37)** — *New* — Flex Gateway PDK policy for per-user authorization with Salesforce
  - Calls the Salesforce UserInfo endpoint to pull custom attributes not present in access tokens
  - Enriches `principal.properties` for downstream ABAC/Cedar rules (e.g. per-user MCP tool access)
  - Smart caching bounded by token expiry, fail-safe error handling, structured observability

---

## Get Started

<Hint type="success">

**Ready to contribute?** Check out our [How to Contribute](./forge-initiative/how-to-contribute) guide to learn how you can help build the future of MuleSoftForge!

</Hint>

<Hint type="info">

**Looking for documentation?** Each connector and module has comprehensive setup guides, operation references, and working examples to get you started quickly.

</Hint>

---

## Community

![MuleSoft Community](/images/community-icon.png)

MuleSoftForge is maintained by the MuleSoft community:

- **GitHub Organization**: [MuleSoft-Forge](https://github.com/MuleSoft-Forge)
- **Issues & Support**: Report issues or request features on the respective GitHub repositories
- **Contributions**: Pull requests are welcome! See our [contribution guidelines](./forge-initiative/how-to-contribute)

---

**Join us in building a comprehensive resource center for the MuleSoft community.**
