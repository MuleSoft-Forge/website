import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MuleSoft Forge",
  description: "Community-contributed connectors and modules for MuleSoft",

  // Enable dead link checking - all links in Part D validation passed
  // ignoreDeadLinks removed to catch future broken link regressions

  // Head tags for SEO, favicon, and social sharing
  head: [
    ['link', { rel: 'icon', href: '/images/mulesoftdevelopers_logo.jpeg' }],
    ['meta', { name: 'theme-color', content: '#00a3e0' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'MuleSoft Forge Documentation' }],
    ['meta', { property: 'og:description', content: 'Community-contributed connectors and modules for MuleSoft' }],
    ['meta', { property: 'og:image', content: '/images/mulesoftdevelopers_logo.jpeg' }],
    ['meta', { property: 'og:url', content: 'https://docs.mulesoftforge.com' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'MuleSoft Forge Documentation' }],
    ['meta', { name: 'twitter:description', content: 'Community-contributed connectors and modules for MuleSoft' }]
  ],

  // Theme configuration
  themeConfig: {
    // Site logo
    logo: '/images/mulesoftdevelopers_logo.jpeg',

    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples/components' },
      {
        text: 'Community',
        items: [
          { text: 'GitHub Organization', link: 'https://github.com/MuleSoft-Forge' },
          { text: 'How to Contribute', link: '/forge-initiative/how-to-contribute' },
          { text: 'Report an Issue', link: 'https://github.com/MuleSoft-Forge/website/issues' }
        ]
      }
    ],

    // Sidebar navigation - Complete navigation structure (Phase 1.3 Part A)
    sidebar: [
      // Getting Started
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Home', link: '/' },
          { text: 'Component Examples', link: '/examples/components' }
        ]
      },

      // MuleSoft Forge Initiative
      {
        text: 'MuleSoft Forge Initiative',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/forge-initiative/overview' },
          { text: 'How to Contribute', link: '/forge-initiative/how-to-contribute' }
        ]
      },

      // Connectors
      {
        text: 'Connectors',
        collapsed: false,
        items: [
          {
            text: 'mule-idp-connector',
            collapsed: false,
            items: [
              { text: 'Overview', link: '/connectors/mule-idp-connector/' },
              { text: 'Set Up', link: '/connectors/mule-idp-connector/set-up' },
              {
                text: 'Operations',
                collapsed: true,
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
        ]
      },

      // Modules
      {
        text: 'Modules',
        collapsed: false,
        items: [
          {
            text: 'mule-pdfbox-module',
            collapsed: false,
            items: [
              { text: 'Overview', link: '/modules/mule-pdfbox-module/' },
              { text: 'Set Up', link: '/modules/mule-pdfbox-module/set-up' },
              {
                text: 'Operations',
                collapsed: true,
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
        ]
      }
    ],

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MuleSoft-Forge' }
    ],

    // Table of contents configuration
    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    // Edit link configuration
    editLink: {
      pattern: 'https://github.com/MuleSoft-Forge/website/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // Footer
    footer: {
      message: 'Released under the <a href="https://github.com/MuleSoft-Forge/website/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2025 MuleSoft Forge Community'
    },

    // Search
    search: {
      provider: 'local'
    }
  },

  // Markdown configuration - integrate tabs plugin
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  }
})
