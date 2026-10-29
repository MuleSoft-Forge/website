import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { loadAssets } from './forge/remote.js'
import { sidebar } from './forge/sidebar.js'
import { SITE_URL, UNLISTED_PAGES, pageUrl, substituteVersions, writeForgeOutputs } from './forge/outputs.js'

const DESCRIPTION = 'Open-source MuleSoft connectors, modules and tools, built by the community for the community'

const versions = Object.fromEntries((await loadAssets()).map((asset) => [asset.id, asset.version]))

function forgeVersions(md) {
  md.core.ruler.push('forge-versions', (state) => {
    for (const token of state.tokens) {
      if (token.type === 'fence' || token.type === 'code_block') token.content = substituteVersions(token.content, versions)
      for (const child of token.children ?? []) child.content = substituteVersions(child.content, versions)
    }
  })
}

const analyticsHead = process.env.PLAUSIBLE_DOMAIN
  ? [['script', { defer: '', 'data-domain': process.env.PLAUSIBLE_DOMAIN, src: 'https://plausible.io/js/script.js' }]]
  : []

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MuleSoftForge',
  description: DESCRIPTION,

  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: SITE_URL,
    transformItems: (items) => items.filter((item) => ![...UNLISTED_PAGES].some((page) => item.url === page.replace(/\.md$/, '')))
  },

  head: [
    ['link', { rel: 'icon', href: '/images/favicon.png', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/favicon.png' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: "MuleSoftForge: What's New", href: '/feed.xml' }],
    ['meta', { name: 'theme-color', content: '#00a3e0' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'MuleSoftForge' }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/images/hero.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ...analyticsHead
  ],

  transformHead({ pageData, title, description }) {
    const url = pageUrl(pageData.relativePath)
    const pageDescription = description || DESCRIPTION
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: pageDescription }]
    ]
  },

  buildEnd(siteConfig) {
    writeForgeOutputs(siteConfig, versions)
  },

  themeConfig: {
    logo: '/images/favicon.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'All Assets', link: '/assets' },
      { text: "What's New", link: '/whats-new' },
      {
        text: 'Community',
        items: [
          { text: 'GitHub Organization', link: 'https://github.com/MuleSoft-Forge' },
          { text: 'How to Contribute', link: '/forge-initiative/how-to-contribute' },
          { text: 'Propose an Asset', link: '/forge-initiative/how-to-contribute#propose-a-new-asset' },
          { text: 'Report an Issue', link: 'https://github.com/MuleSoft-Forge/website/issues' }
        ]
      }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MuleSoft-Forge' }
    ],

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    editLink: {
      pattern: 'https://github.com/MuleSoft-Forge/website/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'medium' }
    },

    footer: {
      message: 'Site content released under the <a href="https://github.com/MuleSoft-Forge/website/blob/main/LICENSE">Apache License 2.0</a>. Each asset carries its own license. <a href="/feed.xml">RSS</a> · <a href="/llms.txt">llms.txt</a>',
      copyright: `Copyright © 2025–${new Date().getFullYear()} MuleSoft Forge Community`
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(forgeVersions)
    }
  }
})
