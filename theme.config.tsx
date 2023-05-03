import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image'

const config: DocsThemeConfig = {
  // Add the logo image to the logo config with the Name
  logo: (
    <>
      <Image src="/images/bengal_logo.png" alt="Logo" width={50} height={50} style={{ marginRight: "100px" }} />
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
      
      <div className="responsive-footer" style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        <div>
        ISU {new Date().getFullYear()} © <a href="https://www2.cose.isu.edu/~mcnudust/" target="_blank">Dr. McNulty</a>
        </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "325px",
        flexWrap: "wrap",
      }}>
        <a href="https://www.isu.edu" target="_blank">
          <Image src="/images/isu_logo.png" alt="Logo" width={40} height={40} style={{ marginRight: "100px" }} />
        </a>

        <a href="https://www.energy.gov" target="_blank">
          <Image src="/images/doe_logo.png" alt="Logo" width={80} height={80} style={{ marginRight: "100px" }} />
        </a>

        <a href="https://www.jlab.org" target="_blank"> 
          <Image src="/images/jlab_logo.png" alt="Logo" width={160} height={160} style={{ marginRight: "100px" }} /> 
        </a>

      </div>
    </div>,
  },

  
  // Add the useNextSeoProps hook here
  useNextSeoProps() {
    return {
      titleTemplate: '%s – McNulty Group',
    }
  }
}

export default config
