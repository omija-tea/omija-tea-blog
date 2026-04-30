import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

/**
 * omija-tea blog — 레이아웃 설정
 * 
 * "최근 작성한 글" 탭이 오른쪽 사이드바에 표시됩니다.
 * 이 파일을 /data/quartz-blog/quartz.layout.ts 에 덮어씁니다.
 */

// 모든 페이지에 공통으로 적용되는 컴포넌트
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "omija-tea/omija-tea-blog",
        repoId: "R_kgDORs-kCQ",
        category: "Announcements",
        categoryId: "DIC_kwDORs-kCc4C49T9",
        lang: "ko",
        mapping: "pathname",
        reactionsEnabled: true,
        inputPosition: "bottom",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/omija-tea",
    },
  }),
}

// 일반 콘텐츠 페이지 레이아웃 (블로그 글)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.MobileOnly(Component.TableOfContents()),
  ],
  left: [
    Component.DesktopOnly(Component.ProfileImage()),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.Explorer({
        title: "탐색",
        sortFn: (a, b) => {
          // 폴더는 항상 위로
          if (a.isFolder && !b.isFolder) return -1
          if (!a.isFolder && b.isFolder) return 1

          // 둘 다 파일이면 날짜 내림차순 (최신 글이 위)
          if (!a.isFolder && !b.isFolder) {
            const dateA = a.data?.date ? new Date(a.data.date) : new Date(0)
            const dateB = b.data?.date ? new Date(b.data.date) : new Date(0)
            return dateB.getTime() - dateA.getTime()
          }

          // 둘 다 폴더면 이름순
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        },
      }),
    ),
    Component.MobileOnly(
      Component.Explorer({
        title: "탐색",
        sortFn: (a, b) => {
          // 폴더는 항상 위로
          if (a.isFolder && !b.isFolder) return -1
          if (!a.isFolder && b.isFolder) return 1

          // 둘 다 파일이면 날짜 내림차순 (최신 글이 위)
          if (!a.isFolder && !b.isFolder) {
            const dateA = a.data?.date ? new Date(a.data.date) : new Date(0)
            const dateB = b.data?.date ? new Date(b.data.date) : new Date(0)
            return dateB.getTime() - dateA.getTime()
          }

          // 둘 다 폴더면 이름순
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        },
      }),
    ),
  ],
  right: [
    Component.DesktopOnly(Component.Graph({
      localGraph: { depth: 2, showTags: true }
    })),
    Component.MobileOnly(Component.Graph({
      localGraph: { depth: 1, showTags: true }
    })),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "최근 작성한 글",
        limit: 10,
        showTags: true,
        filter: (f) => !f.frontmatter?.draft,
        sort: (f1, f2) => {
          const d1 = f1.dates?.published ?? new Date(0)
          const d2 = f2.dates?.published ?? new Date(0)
          return d2.getTime() - d1.getTime()
        }
      }),
    ),
  ],
}

// 폴더/태그 목록 페이지 레이아웃
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.slug !== "index",  // index에서만 숨김
    }),
  ],
  left: [
    Component.DesktopOnly(Component.ProfileImage()),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.Explorer({
        title: "탐색",
        sortFn: (a, b) => {
          if (a.isFolder && !b.isFolder) return -1
          if (!a.isFolder && b.isFolder) return 1
          if (!a.isFolder && !b.isFolder) {
            const dateA = a.data?.date ? new Date(a.data.date) : new Date(0)
            const dateB = b.data?.date ? new Date(b.data.date) : new Date(0)
            return dateB.getTime() - dateA.getTime()
          }
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        },
      }),
    ),
    Component.MobileOnly(
      Component.Explorer({
        title: "탐색",
        folderDefaultState: "collapsed",
        sortFn: (a, b) => {
          if (a.isFolder && !b.isFolder) return -1
          if (!a.isFolder && b.isFolder) return 1
          if (!a.isFolder && !b.isFolder) {
            const dateA = a.data?.date ? new Date(a.data.date) : new Date(0)
            const dateB = b.data?.date ? new Date(b.data.date) : new Date(0)
            return dateB.getTime() - dateA.getTime()
          }
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        },
      }),
    ),
  ],
  right: [],
}

