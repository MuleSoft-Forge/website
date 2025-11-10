import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MuleSoft Forge",
  description: "Community-contributed connectors and modules for MuleSoft",

  // Theme configuration
  themeConfig: {
    // Site logo - TODO: Add logo in Phase 1.2
    // logo: '/logo.svg',

    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples/components' }
    ],

    // Sidebar navigation
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Examples', link: '/examples/components' }
        ]
      }
    ],

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MuleSoft-Forge/website' }
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
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
