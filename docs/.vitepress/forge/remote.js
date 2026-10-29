import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { assets } from './catalog.js'

const PUBLIC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../public')
const TIMEOUT_MS = 8000
const OFFLINE = process.env.FORGE_OFFLINE === '1'

let cachedAssets
let cachedContributors

async function fetchText(url, headers = {}) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

function compareSemver(a, b) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0)
  }
  return 0
}

function latestLocalVersion(dir, fallback) {
  try {
    const versions = readdirSync(resolve(PUBLIC_DIR, dir)).filter((v) => /^\d+\.\d+\.\d+$/.test(v))
    return versions.sort(compareSemver).at(-1) ?? fallback
  } catch {
    return fallback
  }
}

async function mavenRelease({ groupId, artifactId }) {
  const xml = await fetchText(
    `https://repo1.maven.org/maven2/${groupId.replace(/\./g, '/')}/${artifactId}/maven-metadata.xml`
  )
  const version = xml.match(/<release>([^<]+)<\/release>/)?.[1]
  const stamp = xml.match(/<lastUpdated>(\d{8})/)?.[1]
  return {
    version,
    updated: stamp ? `${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}` : undefined
  }
}

async function repoContributors(repoUrl) {
  const slug = repoUrl.replace('https://github.com/', '')
  const headers = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const list = JSON.parse(await fetchText(`https://api.github.com/repos/${slug}/contributors?per_page=50`, headers))
  return list.filter((c) => c.type === 'User' && !c.login.endsWith('[bot]'))
}

async function resolveAsset(asset) {
  const out = { ...asset, version: asset.maven?.version ?? asset.install?.version, updated: undefined, live: false }
  if (asset.install?.versionsDir) {
    out.version = latestLocalVersion(asset.install.versionsDir, out.version)
    out.live = true
  }
  if (asset.maven && !OFFLINE) {
    try {
      const release = await mavenRelease(asset.maven)
      if (release.version) {
        out.version = release.version
        out.updated = release.updated
        out.live = true
      }
    } catch (err) {
      console.warn(`[forge] Maven Central lookup failed for ${asset.id}: ${err.message}`)
    }
  }
  return out
}

async function resolveContributors() {
  if (OFFLINE) return []
  const repos = assets.map((a) => a.repo).filter((r) => r?.startsWith('https://github.com/MuleSoft-Forge/'))
  repos.push('https://github.com/MuleSoft-Forge/website')
  const byLogin = new Map()
  const results = await Promise.allSettled(repos.map(repoContributors))
  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    for (const c of result.value) {
      const prev = byLogin.get(c.login)
      byLogin.set(c.login, {
        login: c.login,
        avatar: c.avatar_url,
        url: c.html_url,
        contributions: (prev?.contributions ?? 0) + c.contributions
      })
    }
  }
  return [...byLogin.values()].sort((a, b) => b.contributions - a.contributions)
}

export function loadAssets() {
  cachedAssets ??= Promise.all(assets.map(resolveAsset))
  return cachedAssets
}

export async function loadForgeData() {
  cachedContributors ??= resolveContributors()
  const [resolved, contributors] = await Promise.all([loadAssets(), cachedContributors])
  return { assets: resolved, contributors, generatedAt: new Date().toISOString() }
}
