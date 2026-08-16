import { useConfig, type DocsThemeConfig } from 'nextra-theme-docs'

const siteName = 'Digital Documentation'
const siteDescription = '日々の発見、仕事、学び、旅を月ごとに綴る個人日記。'

function Head() {
  const { title, frontMatter } = useConfig()
  const pageTitle = title === siteName ? siteName : `${title} | ${siteName}`
  const description =
    typeof frontMatter.description === 'string'
      ? frontMatter.description
      : siteDescription

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="theme-color" content="#060b18" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ja_JP" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
    </>
  )
}

const config: DocsThemeConfig = {
  logo: (
    <span className="site-logo">
      <span className="site-logo__mark" aria-hidden="true" />
      Digital Documentation
    </span>
  ),
  logoLink: '/',
  project: { link: undefined },
  editLink: { component: null },
  feedback: { content: null },
  navigation: { next: true, prev: true },
  nextThemes: { defaultTheme: 'dark' },
  search: { placeholder: '日記を検索…' },
  sidebar: { autoCollapse: true, defaultMenuCollapseLevel: 1 },
  toc: { title: 'このページ', backToTop: 'ページ上部へ' },
  themeSwitch: {
    useOptions: { light: 'ライト', dark: 'ダーク', system: 'システム' }
  },
  footer: {
    content: (
      <span className="site-footer">
        © {new Date().getFullYear()} Digital Documentation
      </span>
    )
  },
  head: Head,
  color: { hue: 24, saturation: 78, lightness: 45 }
}

export default config
