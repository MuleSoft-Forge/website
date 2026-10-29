import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { assets, ASSET_TYPES_PLURAL, isExternal } from './catalog.js'
import { news } from './news.js'

export const SITE_URL = 'https://mulesoftforge.com'

export const UNLISTED_PAGES = new Set(['examples/components.md'])

export function pageUrl(relativePath) {
  return `${SITE_URL}/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
}

function absolute(link) {
  return isExternal(link) ? link : `${SITE_URL}${link}`
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c])
}

function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { meta: {}, body: source }
  const meta = Object.fromEntries(
    match[1]
      .split('\n')
      .map((line) => line.match(/^(title|description):\s*(.+)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.replace(/^["']|["']$/g, '')])
  )
  return { meta, body: source.slice(match[0].length) }
}

function writeFeed(outDir) {
  const items = news
    .map((item) => {
      const url = absolute(item.link)
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="false">${escapeXml(`${item.date}-${item.title}`)}</guid>
      <pubDate>${new Date(`${item.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(item.summary)}</description>
    </item>`
    })
    .join('\n')

  writeFileSync(
    resolve(outDir, 'feed.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MuleSoftForge: What's New</title>
    <link>${SITE_URL}/whats-new</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>New community connectors, modules, tools and releases from MuleSoftForge.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
  )
}

const VERSION_TOKEN = /@forge:version:([a-z0-9-]+)@/g

export function substituteVersions(text, versions) {
  return text.replace(VERSION_TOKEN, (token, id) => versions[id] ?? token)
}

function writeLlms(srcDir, outDir, pages, versions) {
  const docs = pages
    .filter((page) => !UNLISTED_PAGES.has(page))
    .sort()
    .map((page) => {
      const source = substituteVersions(readFileSync(resolve(srcDir, page), 'utf8'), versions)
      const { meta, body } = splitFrontmatter(source)
      const target = resolve(outDir, page)
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, body)
      return { page, meta, body, markdownUrl: `${SITE_URL}/${page}` }
    })

  const assetLines = Object.entries(ASSET_TYPES_PLURAL)
    .map(([type, label]) => {
      const lines = assets
        .filter((a) => a.type === type)
        .map((a) => `- [${a.name}](${absolute(a.link)}): ${a.summary}`)
      return lines.length ? `## ${label}\n\n${lines.join('\n')}` : ''
    })
    .filter(Boolean)
    .join('\n\n')

  const pageLines = docs
    .map(({ page, meta, markdownUrl }) => {
      const title = meta.title || page.replace(/\.md$/, '')
      return `- [${title}](${markdownUrl})${meta.description ? `: ${meta.description}` : ''}`
    })
    .join('\n')

  writeFileSync(
    resolve(outDir, 'llms.txt'),
    `# MuleSoftForge

> Open-source MuleSoft connectors, modules and tools, built by the community for the community. Every page below is also available as plain Markdown.

${assetLines}

## Documentation pages

${pageLines}

## Optional

- [Full documentation in one file](${SITE_URL}/llms-full.txt)
`
  )

  writeFileSync(
    resolve(outDir, 'llms-full.txt'),
    docs.map(({ page, body }) => `<!-- Source: ${pageUrl(page)} -->\n\n${body.trim()}\n`).join('\n\n---\n\n')
  )
}

export function writeForgeOutputs(siteConfig, versions) {
  writeFeed(siteConfig.outDir)
  writeLlms(siteConfig.srcDir, siteConfig.outDir, siteConfig.pages, versions)
}
