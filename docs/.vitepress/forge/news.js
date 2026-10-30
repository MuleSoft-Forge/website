// Newest first. Feeds the What's New page and /feed.xml.

export const news = [
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.3: every suggested change arrives as a diff',
    summary: 'In Agent mode, code the model writes in its answer is turned into proposed changes in the same turn, so you review diffs instead of copying code. Buttons under answers now say Draft, because nothing is written until you accept.',
    link: '/studio-ai/use-the-chat#modes'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.2: Auto picks the model for you',
    summary: 'Choose Auto and each message goes to a fast model for simple questions or a strong one for changes, reviews, fixes and images. If the chosen model is rate-limited or down, Auto tries the other. Ask mode now only lists fixes when you ask for a review or a fix.',
    link: '/studio-ai/use-the-chat#auto'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.1: see the raw request and response of every turn',
    summary: 'Tick Raw in the chat view and each answer gets a collapsed section with every model call it made: method, URL, HTTP status and the exact request and response bodies. Headers and API keys are never recorded.',
    link: '/studio-ai/use-the-chat#see-exactly-what-was-sent'
  },
  {
    date: '2026-10-30',
    asset: 'studio-ai',
    title: 'Studio AI 0.5.0: passwords and secrets scrubbed before the model sees them',
    summary: 'Passwords, API keys, tokens and client ids in properties, YAML, Mule XML, URLs, console output and your messages are hidden from the model as «masked-N». Proposed edits still apply with the real values. .env files, private keys and keystores are never sent.',
    link: '/studio-ai/update'
  },
  {
    date: '2026-10-28',
    asset: 'studio-ai',
    title: 'Studio AI 0.4: proposal checks, connector lookup and Send to MuleSoftForge AI everywhere',
    summary: 'Proposed edits are checked before you apply them, the helper can look up connectors, and you can send a selection to the chat from DataWeave editors and the flow canvas. 0.4.6 tidies the chat composer onto one row.',
    link: '/studio-ai/update'
  },
  {
    date: '2026-10-28',
    asset: 'studio-ai',
    title: 'MuleSoftForge Studio AI launches',
    summary: 'An AI helper inside Anypoint Studio for Mule XML, DataWeave, Problems and Console output. Bring your own key for OpenRouter, MuleSoft AI Gateway, OpenAI, Anthropic, Ollama or any OpenAI-compatible endpoint.',
    link: '/studio-ai/'
  },
  {
    date: '2026-10-26',
    asset: 'json-logger',
    title: 'JSON Logger documentation',
    summary: 'Set-up, the Logger operation and the Logger Scope are now documented, including forwarding to Anypoint MQ, JMS and AMQP.',
    link: '/modules/json-logger/'
  },
  {
    date: '2026-10-25',
    asset: 'typesafe',
    title: 'TypeSafe Connector 1.0.3: Locate, Why a Connector and the playground',
    summary: 'Locate returns a bounding box for image questions, and a new sample app playground runs every operation from the browser.',
    link: '/connectors/mule4-typesafe-connector/operations/locate'
  },
  {
    date: '2026-10-01',
    asset: 'typesafe',
    title: 'TypeSafe Connector 1.0.2: per-option Choice and three-band policies',
    summary: 'Apply Policy now fails closed and validates policies, Choice supports per-option thresholds, and Yes/No policies gain a REVIEW band.',
    link: '/connectors/mule4-typesafe-connector/how-decisions-work'
  },
  {
    date: '2026-09-28',
    asset: 'typesafe',
    title: 'TypeSafe Connector for Mule 4 on Maven Central',
    summary: 'Typed decisions with Jev from a Mule flow: Evaluate, Ask Yes/No, Choose and Score with native DataSense.',
    link: '/connectors/mule4-typesafe-connector/'
  },
  {
    date: '2026-08-23',
    asset: 'salesforce-userinfo',
    title: 'Agent Network Studio and the Salesforce UserInfo Claims Enrichment Policy',
    summary: 'A browser studio for MuleSoft Agent Networks, and a Flex Gateway policy that brings per-user Salesforce attributes to MCP tool authorization.',
    link: 'https://www.agentnetworktracer.com'
  },
  {
    date: '2026-03-13',
    asset: 'infa-mdm',
    title: 'Informatica MDM Connector 1.0.5: non-blocking re-authentication',
    summary: 'A 401 now triggers asynchronous re-login and retry, so the HTTP requester thread is no longer blocked.',
    link: '/connectors/mule-infa-mdm-connector/set-up'
  },
  {
    date: '2026-03-07',
    asset: 'infa-mdm',
    title: 'Informatica MDM Connector 1.0.4: MetaData Read and Http Request',
    summary: 'Passthrough authentication, automatic reconnect on 401, a MetaData Read operation and the renamed Http Request operation.',
    link: '/connectors/mule-infa-mdm-connector/operations/'
  },
  {
    date: '2026-02-22',
    asset: 'lettuce-redis',
    title: 'Lettuce Redis Connector documentation',
    summary: 'Every operation group, Pub/Sub sources and Send Command are now documented.',
    link: '/connectors/mule-lettuce-redis-connector/'
  },
  {
    date: '2026-01-23',
    asset: 'chunking',
    title: 'Mule Chunking Connector 0.2.0',
    summary: 'Released to Maven Central under com.mulesoftforge.',
    link: '/connectors/mule-chunking-connector/set-up'
  },
  {
    date: '2025-09-08',
    asset: 'pdfbox',
    title: 'PDFBox Module 1.0.2: Image to PDF',
    summary: 'Convert images into PDF documents inside a flow.',
    link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-image-to-pdf'
  },
  {
    date: '2025-09-07',
    asset: 'idp',
    title: 'IDP Connector 1.0.6',
    summary: 'Maintenance release on Maven Central.',
    link: '/connectors/mule-idp-connector/set-up'
  }
]
