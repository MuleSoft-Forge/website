// Single source of truth for every MuleSoftForge asset.
// `maven.version` is the fallback used when Maven Central cannot be reached at build time.

export const ASSET_TYPES = {
  connector: 'Connector',
  module: 'Module',
  tool: 'Tool',
  policy: 'Policy',
  app: 'App'
}

export const ASSET_TYPES_PLURAL = {
  connector: 'Connectors',
  module: 'Modules',
  tool: 'Tools',
  policy: 'Policies',
  app: 'Apps'
}

/** Named people referenced by asset `owners` (display order is the owners array). */
export const PEOPLE = {
  jeffcock: {
    login: 'jeffcock',
    name: 'George Jeffcock',
    avatar: 'https://avatars.githubusercontent.com/u/203402018?v=4',
    url: 'https://github.com/jeffcock'
  },
  'amirkhan-ak-sf': {
    login: 'amirkhan-ak-sf',
    name: 'Amir Khan',
    avatar: 'https://avatars.githubusercontent.com/u/86777111?v=4',
    url: 'https://github.com/amirkhan-ak-sf'
  },
  rlexen: {
    login: 'rlexen',
    name: 'Reza Lexén',
    avatar: 'https://avatars.githubusercontent.com/u/94212824?v=4',
    url: 'https://github.com/rlexen'
  },
  rhoegg: {
    login: 'rhoegg',
    name: 'Ryan Hoegg',
    avatar: 'https://avatars.githubusercontent.com/u/44559?v=4',
    url: 'https://github.com/rhoegg'
  },
  mtransier: {
    login: 'mtransier',
    name: 'Matthias Transier',
    avatar: 'https://avatars.githubusercontent.com/u/6918951?v=4',
    url: 'https://github.com/mtransier'
  }
}

export function resolveOwners(logins = []) {
  return logins.map((login) => PEOPLE[login]).filter(Boolean)
}

export const assets = [
  {
    id: 'studio-ai',
    name: 'MuleSoftForge Studio AI',
    type: 'tool',
    isNew: true,
    owners: ['jeffcock'],
    icon: '/images/favicon.png',
    summary: 'AI helper for Anypoint Studio. Ask about flows, DataWeave, Problems and Console, then review proposed edits before anything is written.',
    link: '/studio-ai/',
    repo: 'https://github.com/MuleSoft-Forge/mulesoftforge-studio-ai',
    install: { kind: 'update-site', url: 'https://docs.mulesoftforge.com/studio-ai/updates/', versionsDir: 'studio-ai/updates', version: '0.4.6' },
    requires: 'Anypoint Studio 7.28+',
    java: 'Java 17',
    tags: ['AI', 'Anypoint Studio', 'DataWeave']
  },
  {
    id: 'typesafe',
    name: 'TypeSafe Connector for Mule 4',
    type: 'connector',
    isNew: true,
    owners: ['jeffcock', 'amirkhan-ak-sf'],
    icon: '/images/typesafe-connector-icon.svg',
    summary: 'Think: Smart If Statements. Jev turns JSON state into a typed decision your flow can branch on: Yes/No, Choice, Score and Box.',
    link: '/connectors/mule4-typesafe-connector/',
    repo: 'https://github.com/MuleSoft-Forge/mule4-typesafe-connector',
    maven: { groupId: 'com.mulesoftforge', artifactId: 'mule4-typesafe-connector', version: '1.0.3' },
    requires: 'Mule 4.9.0+',
    java: 'Java 17',
    license: 'Apache-2.0',
    tags: ['AI', 'Decisions', 'DataSense']
  },
  {
    id: 'infa-mdm',
    name: 'Informatica MDM - B360 Connector',
    type: 'connector',
    owners: ['jeffcock'],
    icon: '/images/infa-mdm-connector-icon.svg',
    summary: 'Informatica MDM Business 360 REST API: Master Read, Search, Source Read and Source Submit with entity-aware DataSense.',
    link: '/connectors/mule-infa-mdm-connector/',
    repo: 'https://github.com/MuleSoft-Forge/mule-infa-mdm-connector',
    maven: { groupId: 'com.mulesoftforge', artifactId: 'mule-infa-b360-connector', version: '1.0.5' },
    requires: 'Mule 4.6.0+',
    java: 'Java 8, 11, 17',
    license: 'CPAL-1.0',
    tags: ['MDM', 'Informatica', 'DataSense']
  },
  {
    id: 'idp',
    name: 'MuleSoft IDP Connector',
    type: 'connector',
    owners: ['rlexen', 'jeffcock'],
    icon: '/images/idp-connector-icon.svg',
    summary: 'Intelligent Document Processing: submit documents, retrieve extraction results and manage review tasks from your flows.',
    link: '/connectors/mule-idp-connector/',
    repo: 'https://github.com/MuleSoft-Forge/mule-idp-connector',
    maven: { groupId: 'io.github.mulesoft-forge', artifactId: 'mule-idp-connector', version: '1.0.6' },
    requires: 'Mule 4.6.0+',
    java: 'Java 8, 11, 17',
    license: 'CPAL-1.0',
    tags: ['AI', 'Documents', 'IDP']
  },
  {
    id: 'chunking',
    name: 'Mule Chunking Connector',
    type: 'connector',
    owners: ['rhoegg'],
    icon: '/images/chunking-connector-icon.png',
    summary: 'Stream large binary files into fixed-size chunks with constant memory. Built for S3 multipart upload, streaming ETL and checksums.',
    link: '/connectors/mule-chunking-connector/',
    repo: 'https://github.com/MuleSoft-Forge/mule-chunking-connector',
    maven: { groupId: 'com.mulesoftforge', artifactId: 'mule-chunking-connector', version: '0.2.0' },
    requires: 'Mule 4.9.0+',
    java: 'Java 17',
    license: 'Apache-2.0',
    tags: ['Streaming', 'Files']
  },
  {
    id: 'lettuce-redis',
    name: 'Lettuce Redis Connector',
    type: 'connector',
    owners: ['rhoegg'],
    icon: '/images/lettuce-redis-connector-icon.png',
    summary: 'Direct Redis access on the Lettuce reactive client: keys, hashes, lists, sets, sorted sets, streams, Pub/Sub sources and raw commands.',
    link: '/connectors/mule-lettuce-redis-connector/',
    repo: 'https://github.com/MuleSoft-Forge/mule-lettuce-redis-connector',
    maven: { groupId: 'cloud.anypoint', artifactId: 'mule-lettuce-redis-connector', version: '0.1.24' },
    requires: 'Mule 4.6.0+',
    java: 'Java 8, 11, 17',
    license: 'Apache-2.0',
    tags: ['Redis', 'Caching', 'Pub/Sub']
  },
  {
    id: 'json-logger',
    name: 'JSON Logger',
    type: 'module',
    owners: ['mtransier'],
    icon: '/images/json-logger/json-logger.svg',
    summary: 'Drop-in logger replacement that writes structured JSON and can forward logs to Anypoint MQ, JMS or AMQP.',
    link: '/modules/json-logger/',
    repo: 'https://github.com/anypointcloud/json-logger',
    maven: { groupId: 'cloud.anypoint', artifactId: 'json-logger', version: '3.1.2' },
    requires: 'Mule 4.6.0+',
    java: 'Java 11, 17',
    license: 'Apache-2.0',
    tags: ['Logging', 'Observability']
  },
  {
    id: 'pdfbox',
    name: 'MuleSoft PDFBox Module',
    type: 'module',
    owners: ['jeffcock'],
    icon: '/images/pdfbox-module-icon.svg',
    summary: 'PDF toolkit on Apache PDFBox: extract text and metadata, filter, rotate, split and merge pages, and convert images to PDF.',
    link: '/modules/mule-pdfbox-module/',
    repo: 'https://github.com/MuleSoft-Forge/mule-pdfbox-module',
    maven: { groupId: 'io.github.mulesoft-forge', artifactId: 'mule-pdfbox-module', version: '1.0.2' },
    requires: 'Mule 4.6.0+',
    java: 'Java 8, 11, 17',
    license: 'CPAL-1.0',
    tags: ['PDF', 'Documents']
  },
  {
    id: 'salesforce-userinfo',
    name: 'Salesforce UserInfo Claims Enrichment Policy',
    type: 'policy',
    isNew: true,
    owners: ['jeffcock'],
    icon: '/images/salesforce-userinfo-claims-enrichment-icon.png',
    summary: 'Flex Gateway PDK policy that adds per-user Salesforce custom attributes to the Authentication principal for MCP tool authorization and ABAC.',
    link: 'https://p4a.up.railway.app/dashboard/policies/bb58ed5d-6881-440a-a08b-69160eab5b37',
    repo: 'https://github.com/MuleSoft-Forge/salesforce-userinfo-claims-enrichment',
    requires: 'Flex Gateway',
    tags: ['Security', 'Salesforce', 'MCP']
  },
  {
    id: 'agent-network-studio',
    name: 'Agent Network Studio',
    type: 'app',
    owners: ['jeffcock'],
    icon: '/images/agent-network-studio-icon.png',
    summary: 'Build, ship and observe MuleSoft Agent Networks from the browser, then trace every task, hop and LLM decision live.',
    link: 'https://www.agentnetworktracer.com',
    repo: 'https://github.com/MuleSoft-Forge/mulesoftforge-agent-network-tracer',
    requires: 'Browser',
    license: 'Apache-2.0',
    tags: ['AI', 'Agents', 'Observability']
  }
]

export function isExternal(link) {
  return /^https?:\/\//.test(link)
}

export function mavenUrl(maven, version) {
  const base = `https://central.sonatype.com/artifact/${maven.groupId}/${maven.artifactId}`
  return version ? `${base}/${version}` : base
}
