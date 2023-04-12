import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image'

const config: DocsThemeConfig = {
  // Add the logo image to the logo config with the Name
  logo: (
    <>
      <Image src="/images/logo.svg" alt="Logo" width={20} height={20} />
      <span style={{ marginLeft: '.4em', fontWeight: 700 }}>LENS</span>
    </>
  ),

  project: {
    link: 'https://github.com/gahljust/McN_website',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/gahljust/McN_website',
  footer: {
    text: '2023 © Lens. All rights reserved.',
  },

  // Add the useNextSeoProps hook here
  useNextSeoProps() {
    return {
      titleTemplate: '%s – LENS'
    }
  }
}

export default config
