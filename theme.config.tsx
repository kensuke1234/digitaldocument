import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>My Docs</span>,
  project: { link: 'https://example.com' },
  // ▼ ここを text ではなく content に
  footer: { content: <span>© {new Date().getFullYear()} My Docs</span> }
}

export default config
