import { readFileSync } from 'node:fs'
import nextra from 'nextra'

const site = JSON.parse(readFileSync(new URL('./data/site.json', import.meta.url), 'utf8'))
const withNextra = nextra({ search: false })

export default withNextra({
  agentRules: false,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  async redirects() {
    return Object.entries(site.redirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))
  },
})
