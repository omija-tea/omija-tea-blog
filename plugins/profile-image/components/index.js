import { h } from "preact"

// v4 quartz/util/path.ts 의 pathToRoot 이식 (홈으로의 상대 경로 계산)
function pathToRoot(slug) {
  let rootPath = slug
    .split("/")
    .filter((x) => x !== "")
    .slice(0, -1)
    .map(() => "..")
    .join("/")
  if (rootPath.length === 0) {
    rootPath = "."
  }
  return rootPath
}

// QuartzComponentConstructor: (opts) => QuartzComponent
export const ProfileImage = () => {
  const Component = ({ fileData, displayClass }) => {
    const baseDir = pathToRoot(fileData.slug ?? "")
    return h(
      "div",
      { class: `profile-image-container ${displayClass ?? ""}` },
      h(
        "a",
        { href: baseDir },
        h("img", {
          src: "/static/profile.png",
          alt: "프로필 사진",
          class: "profile-image",
        }),
      ),
    )
  }

  Component.css = `
    .profile-image-container {
      display: flex;
      justify-content: center;
      padding: 1rem 0 0.5rem 0;
    }

    .profile-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
  `

  return Component
}
