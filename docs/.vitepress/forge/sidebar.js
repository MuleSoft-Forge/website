const typesafe = {
  text: 'TypeSafe Connector',
  icon: '/images/typesafe-connector-icon.svg',
  base: '/connectors/mule4-typesafe-connector/',
  items: [
    { text: 'Overview', link: '/connectors/mule4-typesafe-connector/' },
    { text: 'Why a Connector', link: '/connectors/mule4-typesafe-connector/why-a-connector' },
    { text: 'How Decisions Work', link: '/connectors/mule4-typesafe-connector/how-decisions-work' },
    { text: 'Set Up', link: '/connectors/mule4-typesafe-connector/set-up' },
    {
      text: 'Operations',
      collapsed: false,
      items: [
        { text: 'Operations Overview', link: '/connectors/mule4-typesafe-connector/operations/' },
        { text: '[Decide] Evaluate', link: '/connectors/mule4-typesafe-connector/operations/evaluate' },
        { text: '[Decide] Ask Yes/No', link: '/connectors/mule4-typesafe-connector/operations/ask-noul' },
        { text: '[Decide] Choose', link: '/connectors/mule4-typesafe-connector/operations/choose' },
        { text: '[Decide] Score', link: '/connectors/mule4-typesafe-connector/operations/score' },
        { text: '[Decide] Locate', link: '/connectors/mule4-typesafe-connector/operations/locate' },
        { text: '[Select] Candidate', link: '/connectors/mule4-typesafe-connector/operations/select-candidate' },
        { text: '[Decide] Evaluate Batch', link: '/connectors/mule4-typesafe-connector/operations/evaluate-batch' },
        { text: '[Select] Filter', link: '/connectors/mule4-typesafe-connector/operations/filter' },
        { text: '[Policy] Apply', link: '/connectors/mule4-typesafe-connector/operations/apply-policy' },
        { text: '[Util] Connection Get Capabilities', link: '/connectors/mule4-typesafe-connector/operations/connection-get-capabilities' },
        { text: '[Util] Connection List Models', link: '/connectors/mule4-typesafe-connector/operations/connection-list-models' },
        { text: '[Util] Validate Question Set', link: '/connectors/mule4-typesafe-connector/operations/validate-question-set' }
      ]
    },
    { text: 'Sources', link: '/connectors/mule4-typesafe-connector/sources' }
  ]
}

const chunking = {
  text: 'Chunking Connector',
  icon: '/images/chunking-connector-icon.png',
  base: '/connectors/mule-chunking-connector/',
  items: [
    { text: 'Overview', link: '/connectors/mule-chunking-connector/' },
    { text: 'Set Up', link: '/connectors/mule-chunking-connector/set-up' },
    {
      text: 'Operations',
      collapsed: false,
      items: [
        { text: 'Operations Overview', link: '/connectors/mule-chunking-connector/operations/' },
        { text: 'read-chunked', link: '/connectors/mule-chunking-connector/operations/read-chunked' }
      ]
    }
  ]
}

const idp = {
  text: 'IDP Connector',
  icon: '/images/idp-connector-icon.svg',
  base: '/connectors/mule-idp-connector/',
  items: [
    { text: 'Overview', link: '/connectors/mule-idp-connector/' },
    { text: 'Set Up', link: '/connectors/mule-idp-connector/set-up' },
    {
      text: 'Operations',
      collapsed: false,
      items: [
        { text: 'Operations Overview', link: '/connectors/mule-idp-connector/operations/' },
        { text: 'Service IDP - Execution - Submit', link: '/connectors/mule-idp-connector/operations/service-idp-execution-submit' },
        { text: 'Service IDP - Execution Result - Retrieve', link: '/connectors/mule-idp-connector/operations/service-idp-execution-result-retrieve' },
        { text: 'Service IDP - Review Tasks - List', link: '/connectors/mule-idp-connector/operations/service-idp-review-tasks-list' },
        { text: 'Service IDP - Review Task - Delete', link: '/connectors/mule-idp-connector/operations/service-idp-review-task-delete' },
        { text: 'Service IDP - Review Task - Update', link: '/connectors/mule-idp-connector/operations/service-idp-review-task-update' },
        { text: 'Platform IDP - Actions - List', link: '/connectors/mule-idp-connector/operations/platform-idp-actions-list' },
        { text: 'Platform IDP - Action Versions - List', link: '/connectors/mule-idp-connector/operations/platform-idp-action-versions-list' },
        { text: 'Deprecated 1.0.1 - Utils IDP - PDF - ExtractText', link: '/connectors/mule-idp-connector/operations/deprecated-1.0.1-utils-idp-pdf-extracttext' },
        { text: 'Deprecated 1.0.1 - Utils IDP - PDF - RemovePages', link: '/connectors/mule-idp-connector/operations/deprecated-1.0.1-utils-idp-pdf-removepages' }
      ]
    },
    { text: 'Official Documentation', link: 'https://docs.mulesoft.com/idp/' },
    { text: 'Universal REST Smart Connector', link: '/connectors/mule-idp-connector/mulesoft-idp-universal-rest-smart-connector' },
    { text: 'Dataweave', link: '/connectors/mule-idp-connector/dataweave' }
  ]
}

const infaMdm = {
  text: 'Informatica MDM Connector',
  icon: '/images/infa-mdm-connector-icon.svg',
  base: '/connectors/mule-infa-mdm-connector/',
  items: [
    { text: 'Overview', link: '/connectors/mule-infa-mdm-connector/' },
    { text: 'Design Concept', link: '/connectors/mule-infa-mdm-connector/concept' },
    { text: 'Set Up', link: '/connectors/mule-infa-mdm-connector/set-up' },
    {
      text: 'Operations',
      collapsed: false,
      items: [
        { text: 'Operations Overview', link: '/connectors/mule-infa-mdm-connector/operations/' },
        { text: 'INFA MDM - Master Read', link: '/connectors/mule-infa-mdm-connector/operations/master-read' },
        { text: 'INFA MDM - Master Search', link: '/connectors/mule-infa-mdm-connector/operations/search' },
        { text: 'INFA MDM - Source Read', link: '/connectors/mule-infa-mdm-connector/operations/source-read' },
        { text: 'INFA MDM - Source Submit', link: '/connectors/mule-infa-mdm-connector/operations/source-submit' },
        { text: 'INFA MDM - MetaData Read', link: '/connectors/mule-infa-mdm-connector/operations/metadata-read' },
        { text: 'INFA MDM - Http Request', link: '/connectors/mule-infa-mdm-connector/operations/http-request' }
      ]
    }
  ]
}

const lettuceRedis = {
  text: 'Lettuce Redis Connector',
  icon: '/images/lettuce-redis-connector-icon.png',
  base: '/connectors/mule-lettuce-redis-connector/',
  items: [
    { text: 'Overview', link: '/connectors/mule-lettuce-redis-connector/' },
    { text: 'Set Up', link: '/connectors/mule-lettuce-redis-connector/set-up' },
    {
      text: 'Operations',
      collapsed: false,
      items: [
        { text: 'Operations Overview', link: '/connectors/mule-lettuce-redis-connector/operations/' },
        { text: 'Server', link: '/connectors/mule-lettuce-redis-connector/operations/server' },
        { text: 'Key / Value', link: '/connectors/mule-lettuce-redis-connector/operations/key-value' },
        { text: 'Hash', link: '/connectors/mule-lettuce-redis-connector/operations/hash' },
        { text: 'List', link: '/connectors/mule-lettuce-redis-connector/operations/list' },
        { text: 'Set', link: '/connectors/mule-lettuce-redis-connector/operations/set' },
        { text: 'Sorted Set', link: '/connectors/mule-lettuce-redis-connector/operations/sorted-set' },
        { text: 'Geospatial', link: '/connectors/mule-lettuce-redis-connector/operations/geospatial' },
        { text: 'Stream', link: '/connectors/mule-lettuce-redis-connector/operations/stream' },
        { text: 'Channel', link: '/connectors/mule-lettuce-redis-connector/operations/channel' },
        { text: 'Send Command', link: '/connectors/mule-lettuce-redis-connector/operations/send-command' },
        { text: 'Search Operations', link: '/connectors/mule-lettuce-redis-connector/operations/search-operations' }
      ]
    },
    { text: 'Sources (Listeners)', link: '/connectors/mule-lettuce-redis-connector/sources' }
  ]
}

const jsonLogger = {
  text: 'JSON Logger',
  icon: '/images/json-logger/json-logger.svg',
  base: '/modules/json-logger/',
  items: [
    { text: 'Overview', link: '/modules/json-logger/' },
    { text: 'Set Up', link: '/modules/json-logger/set-up' },
    {
      text: 'Operations',
      collapsed: false,
      items: [
        { text: 'Operations Overview', link: '/modules/json-logger/operations/' },
        { text: 'JSON Logger - Logger', link: '/modules/json-logger/operations/json-logger-logger' }
      ]
    },
    {
      text: 'Scopes',
      collapsed: false,
      items: [
        { text: 'Scopes Overview', link: '/modules/json-logger/scopes/' },
        { text: 'JSON Logger - Logger Scope', link: '/modules/json-logger/scopes/json-logger-logger-scope' }
      ]
    }
  ]
}

const pdfbox = {
  text: 'PDFBox Module',
  icon: '/images/pdfbox-module-icon.svg',
  base: '/modules/mule-pdfbox-module/',
  items: [
    { text: 'Overview', link: '/modules/mule-pdfbox-module/' },
    { text: 'Set Up', link: '/modules/mule-pdfbox-module/set-up' },
    {
      text: 'Operations',
      collapsed: false,
      items: [
        { text: 'Operations Overview', link: '/modules/mule-pdfbox-module/operations/' },
        { text: 'Apache PDFBox - Extract Text', link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-extract-text' },
        { text: 'Apache PDFBox - Filter Pages', link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-filter-pages' },
        { text: 'Apache PDFBox - Get Info', link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-get-info' },
        { text: 'Apache PDFBox - Merge PDFs', link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-merge-pdfs' },
        { text: 'Apache PDFBox - Rotate Pages', link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-rotate-pages' },
        { text: 'Apache PDFBox - Split Pages', link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-split-pages' },
        { text: 'Apache PDFBox - Image to PDF', link: '/modules/mule-pdfbox-module/operations/apache-pdfbox-image-to-pdf' }
      ]
    }
  ]
}

const studioAi = {
  text: 'MuleSoftForge Studio AI',
  icon: '/images/favicon.png',
  base: '/studio-ai/',
  items: [
    { text: 'Overview', link: '/studio-ai/' },
    { text: 'Install', link: '/studio-ai/install' },
    { text: 'Set Up', link: '/studio-ai/set-up' },
    { text: 'Use the Chat', link: '/studio-ai/use-the-chat' },
    { text: 'Update and Roll Back', link: '/studio-ai/update' },
    { text: 'Build It Yourself', link: '/studio-ai/build-it-yourself' },
    { text: 'Troubleshooting', link: '/studio-ai/troubleshooting' }
  ]
}

const sections = [
  { text: 'Connectors', groups: [typesafe, chunking, idp, infaMdm, lettuceRedis] },
  { text: 'Modules', groups: [jsonLogger, pdfbox] },
  { text: 'Tools', groups: [studioAi] }
]

const home = {
  text: 'Getting Started',
  collapsed: false,
  items: [
    { text: 'Home', link: '/' },
    { text: 'All Assets', link: '/assets' },
    { text: "What's New", link: '/whats-new' }
  ]
}

const forge = {
  text: 'MuleSoft Forge Initiative',
  collapsed: false,
  items: [
    { text: 'Overview', link: '/forge-initiative/overview' },
    { text: 'How to Contribute', link: '/forge-initiative/how-to-contribute' }
  ]
}

function strip({ base, ...group }) {
  return group
}

const fullSidebar = [
  home,
  forge,
  ...sections.map((section) => ({
    text: section.text,
    collapsed: false,
    items: section.groups.map((group) => ({ ...strip(group), collapsed: true }))
  }))
]

function assetSidebar(group) {
  return [
    {
      text: '← All assets',
      items: [
        { text: 'Browse every asset', link: '/assets' },
        { text: 'Home', link: '/' }
      ]
    },
    { ...strip(group), collapsed: false }
  ]
}

export const sidebar = Object.fromEntries([
  ...sections.flatMap((section) => section.groups.map((group) => [group.base, assetSidebar(group)])),
  ['/', fullSidebar]
])
