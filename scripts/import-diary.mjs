import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const inputPath = process.argv[2]

if (!inputPath) {
  throw new Error('日記本文のテキストファイルを指定してください。')
}

const source = await readFile(resolve(inputPath), 'utf8')
const monthPattern = /^2026年([3-8])月\s*$/gm
const matches = [...source.matchAll(monthPattern)]

function splitLongParagraph(block) {
  const lines = block.split('\n')
  const containsMarkdownStructure = lines.some(line =>
    /^(?:\s*[-*+]\s|\s*\d+[.)]\s|\s*#{1,6}\s|\s*>\s|[①-⑳]|◼️|→)/.test(line)
  )

  if (containsMarkdownStructure || block.length < 300) {
    return block
  }

  const prose = lines.join(' ').replace(/\s+/g, ' ').trim()
  const sentences = prose.match(/[^。！？!?]+[。！？!?]+|[^。！？!?]+$/g) ?? [prose]
  const paragraphs = []
  let paragraph = ''

  for (const sentence of sentences) {
    if (paragraph && paragraph.length + sentence.length > 190) {
      paragraphs.push(paragraph.trim())
      paragraph = ''
    }
    paragraph += sentence
  }

  if (paragraph) {
    paragraphs.push(paragraph.trim())
  }

  return paragraphs.join('\n\n')
}

function formatBody(value) {
  return value
    .trim()
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .split(/\n{2,}/)
    .map(splitLongParagraph)
    .join('\n\n')
}

if (matches.length !== 6) {
  throw new Error(`2026年3月〜8月の見出しを6件取得できませんでした（${matches.length}件）。`)
}

for (const [index, match] of matches.entries()) {
  const month = match[1].padStart(2, '0')
  const bodyStart = match.index + match[0].length
  const bodyEnd = matches[index + 1]?.index ?? source.length
  const body = formatBody(source.slice(bodyStart, bodyEnd))

  const page = `---
title: 2026年${Number(month)}月
description: 2026年${Number(month)}月の日記
---

# 2026年${Number(month)}月

<p className="diary-month-label">2026 / ${month}</p>

${body}
`

  await writeFile(resolve(`pages/2026-${month}.mdx`), page)
}

console.log('2026年3月〜8月の日記を更新しました。')
