import { h } from "preact"

// 클라이언트 스크립트 (afterDOMLoaded): v4 커스텀 — 사용자 인터랙션 전까지 giscus 로딩 지연.
// 템플릿 리터럴 escape를 피하려 내부 문자열은 concat으로 작성.
const LAZY_SCRIPT = `
const changeTheme = (e) => {
  const theme = e.detail.theme
  const iframe = document.querySelector("iframe.giscus-frame")
  if (!iframe || !iframe.contentWindow) return
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: getThemeUrl(getThemeName(theme)) } } },
    "https://giscus.app",
  )
}
const getThemeName = (theme) => {
  if (theme !== "dark" && theme !== "light") return theme
  const c = document.querySelector(".giscus")
  if (!c) return theme
  const darkGiscus = c.dataset.darkTheme || "dark"
  const lightGiscus = c.dataset.lightTheme || "light"
  return theme === "dark" ? darkGiscus : lightGiscus
}
const getThemeUrl = (theme) => {
  const c = document.querySelector(".giscus")
  const base = (c && c.dataset.themeUrl) || "https://giscus.app/themes"
  return base + "/" + theme + ".css"
}

const cleanup = []
const addCleanup = (fn) => cleanup.push(fn)

if (typeof document !== "undefined") {
  const INTERACTION_EVENTS = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"]

  const setupComments = () => {
    cleanup.forEach((fn) => fn())
    cleanup.length = 0

    const giscusContainer = document.querySelector(".giscus")
    if (!giscusContainer) return

    let loaded = false
    const loadGiscus = () => {
      if (loaded) return
      loaded = true
      INTERACTION_EVENTS.forEach((ev) => window.removeEventListener(ev, loadGiscus))

      const s = document.createElement("script")
      s.src = "https://giscus.app/client.js"
      s.async = true
      s.crossOrigin = "anonymous"
      s.setAttribute("data-loading", "lazy")
      s.setAttribute("data-emit-metadata", "0")
      s.setAttribute("data-repo", giscusContainer.dataset.repo)
      s.setAttribute("data-repo-id", giscusContainer.dataset.repoId)
      s.setAttribute("data-category", giscusContainer.dataset.category)
      s.setAttribute("data-category-id", giscusContainer.dataset.categoryId)
      s.setAttribute("data-mapping", giscusContainer.dataset.mapping)
      s.setAttribute("data-strict", giscusContainer.dataset.strict)
      s.setAttribute("data-reactions-enabled", giscusContainer.dataset.reactionsEnabled)
      s.setAttribute("data-input-position", giscusContainer.dataset.inputPosition)
      s.setAttribute("data-lang", giscusContainer.dataset.lang)
      const theme = document.documentElement.getAttribute("saved-theme")
      if (theme) s.setAttribute("data-theme", getThemeUrl(getThemeName(theme)))

      giscusContainer.appendChild(s)
      document.addEventListener("themechange", changeTheme)
      addCleanup(() => document.removeEventListener("themechange", changeTheme))
    }

    INTERACTION_EVENTS.forEach((ev) =>
      window.addEventListener(ev, loadGiscus, { once: true, passive: true }),
    )
    addCleanup(() =>
      INTERACTION_EVENTS.forEach((ev) => window.removeEventListener(ev, loadGiscus)),
    )
  }

  document.addEventListener("nav", setupComments)
  document.addEventListener("render", setupComments)
}
`

const boolToStringBool = (b) => (b ? "1" : "0")

// QuartzComponentConstructor: (opts) => QuartzComponent
export const Comments = (opts) => {
  const o = (opts && opts.options) || {}

  const Component = ({ displayClass, fileData, cfg }) => {
    const override = fileData.frontmatter?.comments
    if (override === false || override === "false") {
      return null
    }
    return h("div", {
      class: `${displayClass ?? ""} giscus`.trim(),
      "data-repo": o.repo,
      "data-repo-id": o.repoId,
      "data-category": o.category,
      "data-category-id": o.categoryId,
      "data-mapping": o.mapping ?? "url",
      "data-strict": boolToStringBool(o.strict ?? true),
      "data-reactions-enabled": boolToStringBool(o.reactionsEnabled ?? true),
      "data-input-position": o.inputPosition ?? "bottom",
      "data-light-theme": o.lightTheme ?? "light",
      "data-dark-theme": o.darkTheme ?? "dark",
      "data-theme-url": o.themeUrl ?? `https://${cfg.baseUrl ?? "example.com"}/static/giscus`,
      "data-lang": o.lang ?? "en",
    })
  }

  Component.afterDOMLoaded = LAZY_SCRIPT
  return Component
}
