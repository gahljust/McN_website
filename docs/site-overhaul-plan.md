# McNulty Lab website assessment and overhaul plan

November 7, 2026

Build the site around two audiences: incoming students learning how to work in the lab, and active members looking for instructions and resources. Preserve the useful scientific explanations, tutorials, and lab imagery, then give them a clearer structure and a consistent ISU visual identity. The highest priorities are a useful homepage, guided onboarding, reliable technical instructions, and quick access to everyday resources.

## Current repository

| Area | Current state |
| --- | --- |
| Content | 13 MDX pages, totaling 3,756 source lines |
| Framework | Installed Next.js 13.1.6, Nextra 2.2.14, React 18.2.0, TypeScript 4.9.5; Next.js Pages Router |
| Images | 107 files under `public/images`, totaling 47.9 MiB of source assets; this is not the amount downloaded by each visitor |
| Interactive features | Working documentation search, sidebar navigation, table of contents, theme selection, OS tabs, and code copying |
| Custom components | YouTube embed, local video embed, and an unused counter example |
| Content maintenance | Most content dates from 2023; the latest local commit is June 4, 2024 |
| Repository maintenance | Two package lockfiles, `latest` Nextra dependency ranges, template package metadata, and a minimal README |
| Verification | Production build passes; no dedicated lint or test scripts and no CI workflow are present |

The assessment covers the local checkout at commit `4c73737`, all content pages and custom components, configuration and assets, a production build, rendered links and metadata, and browser checks at desktop and 390-pixel mobile widths. Search was exercised with “ROOT.” The deployed site's hosting settings and private lab services need a separate check when preparing release.

The existing documentation features are a useful foundation. The content already connects real lab work to learning ROOT, Geant4, CAD, and printing. A modern presentation can retain that practical character and keep content editable as MDX.

## Findings that affect the redesign

| Priority | Finding and evidence | Required outcome |
| --- | --- | --- |
| Before launch | Next.js 13 is outside the vendor's supported versions. The npm audit reports 21 affected packages: 1 critical, 11 high, 8 moderate, and 1 low. These are dependency findings; feature use and hosting determine exposure. [Package configuration](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/package.json#L20), [Next.js support policy](https://nextjs.org/support-policy) | Upgrade to a supported, compatible framework combination and review remaining applicable advisories before release. |
| High | The homepage contains a heading and university logo, with no introduction, starting path, or shortcuts. [Homepage](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/index.mdx#L7) | Give both audiences an immediate next action. |
| High | The tutorials introduction describes categories but gives little help choosing a first task. Lab equipment is grouped under MOLLER, and website maintenance occupies student tutorial navigation. [Navigation](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/_meta.json#L1), [Tutorial introduction](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Getting_started.mdx#L10) | Organize around onboarding, learning, lab work, research, and resources. |
| High | The ROOT tutorial changes the tree name from `Rec` to `t` in later examples, declares an uninitialized histogram pointer, and includes a `gstyle` typo. Fit bounds in prose and code also disagree. [Initial tree](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/ROOT.mdx#L271), [Later macro](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/ROOT.mdx#L588), [Style typo](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/ROOT.mdx#L725) | Publish one complete, tested example and derive snippets from it. |
| High | The Geant4 page has ROOT title and description metadata, so search presents it as a ROOT tutorial. It also instructs users to delete the analysis manager, contrary to Geant4 guidance for version 11 onward. [Metadata](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/G4.mdx#L1), [Cleanup instruction](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/G4.mdx#L394), [Geant4 analysis documentation](https://geant4.web.cern.ch/documentation/dev/bfad_html/ForApplicationDevelopers/Analysis/managers.html) | Correct metadata and validate the tutorial against an explicitly identified Geant4 version. |
| High | The Autodesk resource link has invalid nested Markdown. The former McNulty profile, Ubuntu tutorial URL, and a representative generated GitHub edit link returned HTTP 404 on both HEAD and GET requests. [Resource links](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/links.mdx#L8), [Malformed Autodesk link](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/links.mdx#L53), [Edit link configuration](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/theme.config.tsx#L20) | Repair destinations and use a shared resource catalog with descriptions and access requirements. |
| High | Video embeds remain 560 pixels wide at a 390-pixel viewport. On the MOLLER page, article content has a 616-pixel scroll width. The footer also uses a 325-pixel left margin and repeated 100-pixel margins. [Video component](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/components/yvideos.tsx#L9), [Footer](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/theme.config.tsx#L34) | Make media, figures, navigation, and the footer responsive. |
| Medium | 85 rendered content images have absent or empty alternative text; other images use placeholder descriptions. Many figures use layout tables and repeated blank lines. [Lab figures](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/MOLLER/Labsandequip.mdx#L23), [ShowerMax figures](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/MOLLER/Showermax.mdx#L14) | Use consistent figure components with useful descriptions, captions, correct proportions, and credits. |
| Medium | The ShowerMax source references `showermax_6.png`, while the tracked file is `Showermax_6.png`. This succeeds on this Mac but can fail during a build on a case-sensitive filesystem. [Reference](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/MOLLER/Showermax.mdx#L120) | Normalize asset names and check them on Linux. |
| Medium | The lab equipment page ends mid-sentence. The about page describes the website rather than introducing the group or explaining how to get help. [Equipment page](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/MOLLER/Labsandequip.mdx#L115), [About page](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/about.mdx#L4) | Complete the handbook and add verified group and contact information. |
| Medium | Rendered pages retain the template description “Nextra: the next docs builder”; several also emit a second description. The header has an empty text label, and its Discord link points to the generic Discord homepage. [Theme configuration](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/theme.config.tsx#L7) | Establish a clear lab identity, unique page metadata, meaningful link labels, and verified communication destinations. |

The Terminal page also needs a platform review: the Windows examples describe `more +10` as showing the last ten lines and attempt to set an `IsExecutable` property. ROOT installation guidance should be reconciled with the official installation options and tested on the platforms the lab supports. [Terminal examples](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/Terminal.mdx#L147), [ROOT installation guidance](https://root.cern.ch/install/)

### Resource link results

The rendered site contains 78 distinct external URLs, including generated feedback and edit links. A sample covering 54 public destinations returned 39 HTTP 200 responses, three HTTP 404 responses, and 12 inconclusive results caused by timeouts, protocol errors, HTTP 403, or HTTP 503. Three successful destinations redirected. Private DocDB pages, the lab Elog, account creation pages, and issue submission links were excluded from the request checks.

Treat timeouts and access restrictions as requiring review, rather than automatically removing those resources. A successful HTTP response also needs an editorial check that the destination still provides the intended information. The measurements and request results are in [audit evidence](/Users/justingahley/github_projects/McN_website/docs/site-audit-evidence.json).

Use the current [Ubuntu command line guide](https://ubuntu.com/desktop/docs/en/latest/tutorial/the-linux-command-line-for-beginners/) in place of the missing tutorial. For the old McNulty page, confirm the intended current faculty or group destination. Correct GitHub edit links to include the branch and valid edit path.

## Proposed navigation

| Primary destination | What belongs there | Main visitor action |
| --- | --- | --- |
| Home | Lab introduction, starting path, everyday shortcuts, research overview | Choose a task immediately |
| Start Here | Orientation, access prerequisites, software setup, first tasks, who can help | Begin a clear onboarding sequence |
| Tutorials | Terminal, ROOT, Geant4, CAD, and printing guides | Follow a learning path or find a specific procedure |
| Lab Handbook | Equipment, DAQ and CODA references, lab procedures, troubleshooting | Find practical instructions while working |
| Research | MOLLER overview, ShowerMax, the group's contribution, credited diagrams | Understand the work and its context |
| Resources | Searchable official documentation, repositories, Elog, collaboration links, downloads | Open the right tool or reference |

Keep About and Contact in the footer, with a short group introduction on Home. Put website maintenance in a separate maintainer area. Keep search prominent throughout the site, with a compact mobile menu and clear indication of the current section.

The recommended introductory sequence is **Start Here → Terminal → ROOT → Geant4**, with **CAD → 3D Printing** as a second path. Give each guide a visible prerequisite, expected result, estimated effort, and next step. Active members should also be able to jump directly to a command, equipment page, or reference.

## Visual direction

Use a clean academic style with real detector and lab imagery. A warm white reading surface, charcoal text, restrained orange accents, generous spacing, and strong typography will give the lab a recognizable identity. Provide an equivalent dark theme that follows the visitor's preference.

ISU's digital palette supplies charcoal `#222222`, accent orange `#F47920`, button orange `#D4441C`, and link color `#B82B00`. Use the brighter orange primarily for accents; test text and background combinations in both themes. A warm neutral background can be a proposed supporting color. [ISU digital color guidance](https://www.isu.edu/brand/design/colors/)

Use readable sans serif typography, a comfortable article width, 16–18-pixel body text, and monospace styling for commands. Build a consistent spacing scale, subtle borders, modest corner rounding, and clear hover and keyboard focus states. Preserve the proportions of photographs and CAD figures. Use concise annotations to explain technical imagery.

### Homepage layout

1. **Header:** recognizable lab name and university identity, six navigation destinations, search, and theme control.
2. **Introduction:** what the lab does and what students can find here, beside one strong, credited lab or detector image. Primary action: Start Here. Secondary action: Browse Lab Resources.
3. **Everyday shortcuts:** Elog, MOLLER wiki, remoll, and documentation, with access requirements where relevant.
4. **Learning paths:** computing and analysis, simulation, and CAD and fabrication, each with a clear first task.
5. **Lab and research:** direct entries into the equipment handbook and the MOLLER and ShowerMax explanations.
6. **Footer:** contact, maintainer guidance, and consistently sized institutional marks.

Use the same visual system for tutorials and resources. Article pages should prioritize reading and task completion; the homepage should prioritize choosing a destination.

## Useful tools and links

| Release | Addition | Practical benefit |
| --- | --- | --- |
| First release | Resource catalog with task and topic filters | Replaces the long links list with a usable directory |
| First release | Shared quick links for Elog, collaboration wiki, remoll, ROOT, and Geant4 | Makes frequently used destinations available immediately |
| First release | Access labels such as Public, Lab Network, or JLab Account, confirmed by the lab | Explains why a destination may require additional access |
| First release | Consistent OS setup tabs and copyable commands | Helps students follow the instructions for their computer |
| First release | Complete downloadable example files and an approved or synthetic ROOT dataset | Makes tutorials reproducible without depending entirely on a private server |
| First release | Onboarding checklist, prerequisites, and next steps | Turns isolated articles into a guided introduction |
| First release | Working Edit this page and Report a correction links | Makes maintenance approachable for future students |
| After use establishes demand | Searchable command reference and locally saved checklist progress | Speeds up repeated tasks without requiring an account system |
| Later | Annotated detector overview and expanded lab troubleshooting | Explains apparatus and common problems using verified material |

Store each resource once with its title, URL, description, category, audience, access requirement, and review date. Reuse those records in the homepage shortcuts, Resources, and relevant guides. A review date should mean the content was checked, not simply that an automated request succeeded.

## Content migration

These are proposed routes. Record the final URL and anchor mapping before moving files.

| Existing page | Proposed destination | Editorial work |
| --- | --- | --- |
| [Home](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/index.mdx) | `/` | Replace the placeholder with the homepage described above |
| [About](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/about.mdx) | `/about` | Add verified group information, contact, and how students can get involved |
| [Links](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/links.mdx) | `/resources` | Convert into structured records; repair and describe links |
| [MOLLER](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/MOLLER/MOLLER.mdx) | `/research/moller` | Tighten explanations, check numerical specifications, and improve figures |
| [ShowerMax](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/MOLLER/Showermax.mdx) | `/research/showermax` | Check current design and status; confirm image reuse and attribution |
| [Lab spaces and equipment](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/MOLLER/Labsandequip.mdx) | `/lab/equipment` | Complete the page and confirm current equipment and procedures |
| [Tutorial introduction](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Getting_started.mdx) | `/start-here` | Build an actionable introduction and onboarding sequence |
| [Terminal](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/Terminal.mdx) | `/tutorials/terminal` | Recheck platform commands and separate quick reference from exercises |
| [ROOT](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/ROOT.mdx) | `/tutorials/root` | Repair examples; organize setup, first plot, and macros into clear units |
| [Geant4](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/Basics/G4.mdx) | `/tutorials/geant4` | Fix metadata, modernize version-sensitive code, and test a complete example |
| [CAD basics](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/CAD/Basics.mdx) | `/tutorials/cad` | Verify current software, education access, and lab conventions |
| [3D printing](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/CAD/3Dprinting.mdx) | `/tutorials/3d-printing` | Verify printer models, Cura workflow, screenshots, and lab procedures |
| [Website maintenance](https://github.com/gahljust/McN_website/blob/4c73737834dc76518301b57b8d94b86b26d61781/pages/Tutorials/website.mdx) | `/maintainers` | Rewrite for the selected tooling and the actual preview and release workflow |

Preserve existing inbound links with redirects and compatible anchor IDs. Where a long tutorial is split, retain a useful compatibility landing page or explicit anchor mapping. Add owner, reviewed date, applicable software version, prerequisites, and resource references to the content model.

## Technical approach

Continue with MDX content and Next.js, using a supported Nextra release for documentation features and custom layouts for the homepage and resource catalog. This keeps the content approachable for students and preserves useful search and navigation behavior.

Current Nextra 4 uses the App Router, so moving from this Nextra 2 Pages Router site is a framework migration. Before selecting exact versions, prove a compatible Next.js, React, and Nextra combination using representative MDX, tabs, images, video, and search. Pin the selected releases, use one package manager and lockfile, and record a compatible Node LTS runtime. [Nextra router support](https://nextra.site/docs)

Create reusable components for figures, responsive video, resource entries, prerequisites, and guide steps. Replace repeated inline layout code. Keep example code in runnable files and include it in guides where practical. Reduce source image sizes while preserving readable screenshot text and scientific detail.

Add build and type checks, internal link and asset checks, and a small set of browser checks for navigation, search, resource filtering, and redirects. Public link checking should distinguish a confirmed missing page from a timeout or authentication requirement. Document setup and content editing in the README, and clean up tracked machine files and template leftovers in a separate change.

## Implementation sequence

| Phase | Deliverable | Completion check |
| --- | --- | --- |
| 1. Structure and visual prototype | Final navigation, route map, design tokens, and desktop and mobile designs for Home, a ROOT guide, and Resources | The three representative pages demonstrate the visual style and the main student and member tasks |
| 2. Framework foundation | Supported dependency combination, App Router migration, pinned runtime and packages, one lockfile, and preview build | Representative MDX components, search, images, and production build work together; dependency findings are reviewed |
| 3. Layout and navigation | Shared header and footer, homepage, tutorial layout, handbook and research entries, resource catalog, and responsive media | A new student can reach the first guide; a member can reach everyday resources; all work with keyboard and mobile navigation |
| 4. Content and examples | Revised guides, working example files, verified links, metadata, captions, credits, and reviewed lab facts | Guides work with the documented software versions and sample data; each migrated page has a clear owner and review state |
| 5. Verification and release | Redirects, checks, reviewed preview, deployment instructions, and rollback reference | Existing URLs remain useful; the main tasks pass on desktop and mobile; the reviewed version is ready to publish |

The first implementation milestone should be **Home + one representative tutorial + Resources**. That is enough to assess the design, navigation, and MDX migration before applying the system to every page.

### Release criteria

- Start Here and everyday resource shortcuts are reachable in one click from Home; individual guides are reachable in at most two.
- The mobile menu, search, filters, keyboard focus, theme control, and empty search results behave clearly.
- At 390, 768, 1280, and 1440 pixels, the page stays within the viewport; wide code or data tables scroll within their own containers.
- Informative images have useful descriptions and captions, embedded media scales correctly, and colors remain readable in both themes.
- Search identifies ROOT and Geant4 correctly and opens the intended guide or section.
- Legacy routes and important section links resolve; asset paths also pass on a case-sensitive filesystem.
- Tutorial examples run using the documented environment and supplied sample data.
- Production build and relevant checks pass; applicable high and critical dependency findings are resolved before publication.
- Performance and accessibility are measured on the preview with real content, rather than inferred from the framework or source image sizes.

## Lab information needed during implementation

Confirm current people and contact details, the preferred communication channel, equipment inventory and printer models, supported computing environments, and access requirements for lab and collaboration services. Review current MOLLER and ShowerMax design details and status with a lab owner. Confirm which images and sample datasets may be redistributed. Confirm the production domain, hosting project, and who maintains releases.

These inputs are needed for the relevant content and release steps. The navigation and visual prototype can proceed with existing, clearly identified material.
