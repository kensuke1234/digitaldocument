// next.config.mjs
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx' // or .js
})

export default withNextra({
  reactStrictMode: true
})
