#!/usr/bin/env node
// post-build: content-index가 클라이언트 contentIndex.json에서 의도적으로 제거하는 `date`를
// sitemap.xml(모든 페이지의 <lastmod> 보유)에서 복원해 Explorer 날짜 정렬을 가능케 한다.
//
// 왜 빌드 후 별도 실행인가:
//   emitter는 quartz/processors/emit.ts에서 Promise.all로 "병렬" 실행된다. 따라서
//   빌드 중에 contentIndex.json을 읽어-수정-쓰기 하는 플러그인은 content-index의 쓰기와
//   경쟁(race)한다. 빌드가 끝난 뒤 실행하면 경쟁 없이 안전하게 date를 주입할 수 있다.
//   (커뮤니티 플러그인 fork 없이 해결하기 위한 방식.)
//
// 사용: node scripts/patch-explorer-dates.mjs [output-dir]   (기본 output-dir = public)

import fs from "node:fs"
import path from "node:path"

const out = process.argv[2] || "public"
const sitemapPath = path.join(out, "sitemap.xml")
const indexPath = path.join(out, "static", "contentIndex.json")

if (!fs.existsSync(sitemapPath) || !fs.existsSync(indexPath)) {
  console.warn(
    `[patch-explorer-dates] 건너뜀: ${sitemapPath} 또는 ${indexPath} 없음 ` +
      `(content-index 비활성?)`,
  )
  process.exit(0)
}

// 1) sitemap.xml → slug -> lastmod(ISO) 맵
const sitemap = fs.readFileSync(sitemapPath, "utf-8")
const dateBySlug = new Map()
const re = /<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g
let m
while ((m = re.exec(sitemap)) !== null) {
  let pathname
  try {
    pathname = new URL(m[1]).pathname
  } catch {
    pathname = m[1]
  }
  const slug = decodeURIComponent(pathname.replace(/^\/+/, "").replace(/\/+$/, "")) || "index"
  dateBySlug.set(slug, m[2])
}

// 2) contentIndex.json 각 항목에 date 주입 (폴더 인덱스는 `<folder>/index` ↔ sitemap `<folder>` 대응)
const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"))
let n = 0
for (const key of Object.keys(index)) {
  const d = dateBySlug.get(key) ?? dateBySlug.get(key.replace(/\/index$/, ""))
  if (d) {
    index[key].date = d
    n++
  }
}
fs.writeFileSync(indexPath, JSON.stringify(index))
console.log(`[patch-explorer-dates] ${n}/${Object.keys(index).length} 항목에 date 주입 완료`)
