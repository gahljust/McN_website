import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image'

const config: DocsThemeConfig = {
  // Add the logo image to the logo config with the Name
  logo: (
    <>
      <Image src="/images/bengal_logo.png" alt="Logo" width={50} height={50} />
      <span style={{ marginLeft: '.4em', fontWeight: 700 }}></span>
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
    text:
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div>
      ISU {new Date().getFullYear()} © <a href="https://www2.cose.isu.edu/~mcnudust/" target="_blank">Dr. McNulty</a>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "325px",
      }}>
        <Image src="/images/isu_logo.png" alt="Logo" width={40} height={40} style={{ marginRight: "100px" }} />

        <Image src="/images/doe_logo.png" alt="Logo" width={80} height={80} style={{ marginRight: "100px" }} />

        <Image src="/images/jlab_logo.png" alt="Logo" width={160} height={160} style={{ marginRight: "100px" }} />
      </div>
    </div>,
  },

  

  // Add the useNextSeoProps hook here
  useNextSeoProps() {
    return {
      titleTemplate: '%s – LENS'
    }
  }
}

export default config
