import { readFile } from 'fs/promises'
import path from 'path'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib'
import sharp from 'sharp'
import {
  COVER_PAGE,
  GRID_PAGE,
  INK,
  MONTH_NAMES,
  MUTED,
  PAGE,
  PAPER,
  RULE,
  WEEKDAY_LABELS,
  buildMonthGrid,
  coverSubtitle,
  coverTitle,
  gridCellRect,
  joinPetNames,
  printableAccent,
} from '../calendar/layout'
import { SITE } from '../config'

// ---------------------------------------------------------------------------
// Print-ready PDFs for an 11 × 8.5 in Wire-O wall calendar.
//
// Every page is 11.25 × 8.75 in (trim + 0.125 in bleed on all sides), 72 pt/in.
//
//   cover.pdf     page 1  front cover (art + typeset title)
//                 page 2  back cover  (thumbnail index of the twelve months)
//   interior.pdf  24 pages: for each month, the art page then the dates page.
//
// Artwork never contains text — titles, month names and dates are typeset here
// from the same layout constants the on-screen preview uses.
// ---------------------------------------------------------------------------

const PT = 72
const PAGE_W = (PAGE.trimWidth + PAGE.bleed * 2) * PT
const PAGE_H = (PAGE.trimHeight + PAGE.bleed * 2) * PT
const PRINT_DPI = 300
const ART_PX = {
  width: Math.round((PAGE.trimWidth + PAGE.bleed * 2) * PRINT_DPI),
  height: Math.round((PAGE.trimHeight + PAGE.bleed * 2) * PRINT_DPI),
}

export interface PrintInput {
  petNames: string[]
  styleName: string
  accentColor: string
  year: number
  /** Raw image bytes for the cover. */
  cover: Buffer
  /** Raw image bytes for months 1-12, in order. */
  months: Buffer[]
}

interface Fonts {
  display: PDFFont
  displaySemi: PDFFont
  sans: PDFFont
  sansBold: PDFFont
}

/** x from the trim's left edge, in inches → PDF points. */
const X = (inches: number) => (inches + PAGE.bleed) * PT
/** y measured DOWN from the trim's top edge, in inches → PDF points (origin bottom-left). */
const Y = (inches: number) => PAGE_H - (inches + PAGE.bleed) * PT

function hex(color: string): RGB {
  const value = color.replace('#', '')
  const n = parseInt(value.length === 3 ? value.replace(/./g, '$&$&') : value, 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

async function loadFonts(doc: PDFDocument): Promise<Fonts> {
  doc.registerFontkit(fontkit)
  const dir = path.join(process.cwd(), 'lib', 'print', 'fonts')
  const load = async (file: string) => doc.embedFont(await readFile(path.join(dir, file)), { subset: true })
  const [display, displaySemi, sans, sansBold] = await Promise.all([
    load('fraunces-900.woff'),
    load('fraunces-600.woff'),
    load('dm-sans-400.woff'),
    load('dm-sans-700.woff'),
  ])
  return { display, displaySemi, sans, sansBold }
}

/** Drop characters the embedded font cannot draw (emoji, non-Latin scripts). */
function safeText(font: PDFFont, text: string): string {
  const supported = new Set(font.getCharacterSet())
  const out = Array.from(text.normalize('NFC'))
    .map((ch) => (supported.has(ch.codePointAt(0)!) ? ch : ch === '’' ? "'" : ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
  return out
}

function fitSize(font: PDFFont, text: string, size: number, maxWidth: number): number {
  const width = font.widthOfTextAtSize(text, size)
  return width > maxWidth ? (size * maxWidth) / width : size
}

async function artJpeg(input: Buffer, width = ART_PX.width, height = ART_PX.height): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .toColourspace('srgb')
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toBuffer()
}

/** Burn the bottom-up dark gradient into the cover art so the white title stays legible. */
async function withCoverScrim(image: Buffer): Promise<Buffer> {
  const { width, height } = ART_PX
  const start = (COVER_PAGE.scrimTop + PAGE.bleed) / (PAGE.trimHeight + PAGE.bleed * 2)
  const scrim = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="${start}" stop-color="#0f0d0a" stop-opacity="0"/>
        <stop offset="${start + (1 - start) * 0.55}" stop-color="#0f0d0a" stop-opacity="${COVER_PAGE.scrimMaxOpacity * 0.6}"/>
        <stop offset="1" stop-color="#0f0d0a" stop-opacity="${COVER_PAGE.scrimMaxOpacity}"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`
  )
  return sharp(await artJpeg(image)).composite([{ input: scrim }]).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toBuffer()
}

async function drawFullBleedArt(doc: PDFDocument, page: PDFPage, image: Buffer) {
  const jpg = await doc.embedJpg(await artJpeg(image))
  page.drawImage(jpg, { x: 0, y: 0, width: PAGE_W, height: PAGE_H })
}

function drawGridPage(page: PDFPage, fonts: Fonts, month: number, input: PrintInput) {
  const grid = buildMonthGrid(month, input.year)
  const accent = hex(printableAccent(input.accentColor))
  const ink = hex(INK)
  const muted = hex(MUTED)
  const rule = hex(RULE)
  const L = GRID_PAGE

  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: hex(PAPER) })

  // Month + year
  page.drawText(grid.name, { x: X(L.left), y: Y(L.titleBaseline), size: L.titleSize * PT, font: fonts.display, color: ink })
  const year = String(grid.year)
  const yearSize = L.yearSize * PT
  page.drawText(year, {
    x: X(L.right) - fonts.displaySemi.widthOfTextAtSize(year, yearSize),
    y: Y(L.titleBaseline),
    size: yearSize,
    font: fonts.displaySemi,
    color: accent,
  })

  // Small caption above the year: "LUNA · SPACE EXPLORER"
  const caption = safeText(fonts.sansBold, `${joinPetNames(input.petNames)} · ${input.styleName}`.toUpperCase())
  const captionSize = L.captionSize * PT
  const captionWidth = fonts.sansBold.widthOfTextAtSize(caption, captionSize) + caption.length * 0.6
  page.drawText(caption, {
    x: X(L.right) - captionWidth,
    y: Y(L.titleBaseline - L.yearSize - 0.08),
    size: captionSize,
    font: fonts.sansBold,
    color: muted,
    characterSpacing: 0.6,
  } as Parameters<PDFPage['drawText']>[1])

  // Weekday labels
  const cellWidth = (L.right - L.left) / 7
  WEEKDAY_LABELS.forEach((label, column) => {
    page.drawText(label.toUpperCase(), {
      x: X(L.left + column * cellWidth + L.dayInset),
      y: Y(L.weekdayBaseline),
      size: L.weekdaySize * PT,
      font: fonts.sansBold,
      color: column === 0 || column === 6 ? accent : muted,
    })
  })

  // Grid rules
  const rowHeight = (L.gridBottom - L.gridTop) / grid.rows
  for (let r = 0; r <= grid.rows; r++) {
    const y = Y(L.gridTop + r * rowHeight)
    page.drawLine({ start: { x: X(L.left), y }, end: { x: X(L.right), y }, thickness: r === 0 ? 1.2 : 0.5, color: r === 0 ? ink : rule })
  }
  for (let c = 1; c < 7; c++) {
    const x = X(L.left + c * cellWidth)
    page.drawLine({ start: { x, y: Y(L.gridTop) }, end: { x, y: Y(L.gridBottom) }, thickness: 0.5, color: rule })
  }

  // Days
  for (const cell of grid.cells) {
    const rect = gridCellRect(grid, cell.column, cell.row)
    const weekend = cell.column === 0 || cell.column === 6
    page.drawText(String(cell.day), {
      x: X(rect.x + L.dayInset),
      y: Y(rect.y + L.dayInset + L.daySize * 0.78),
      size: L.daySize * PT,
      font: fonts.displaySemi,
      color: weekend ? accent : ink,
    })
    if (cell.holiday) {
      const size = fitSize(fonts.sans, cell.holiday, L.holidaySize * PT, (rect.width - L.dayInset * 2) * PT)
      page.drawText(cell.holiday, {
        x: X(rect.x + L.dayInset),
        y: Y(rect.y + rect.height - L.dayInset),
        size,
        font: fonts.sans,
        color: muted,
      })
    }
  }
}

function drawCoverTitle(page: PDFPage, fonts: Fonts, input: PrintInput) {
  const C = COVER_PAGE
  const white = rgb(1, 1, 1)
  const title = safeText(fonts.display, coverTitle(input.petNames, input.year)) || String(input.year)
  const titleSize = fitSize(fonts.display, title, C.titleSize * PT, C.titleMaxWidth * PT)
  page.drawText(title, { x: X(C.left), y: Y(C.titleBaseline), size: titleSize, font: fonts.display, color: white })

  page.drawText(safeText(fonts.sansBold, coverSubtitle(input.styleName).toUpperCase()), {
    x: X(C.left),
    y: Y(C.subtitleBaseline),
    size: C.subtitleSize * PT * 0.72,
    font: fonts.sansBold,
    color: white,
    opacity: 0.85,
    characterSpacing: 1.2,
  } as Parameters<PDFPage['drawText']>[1])
}

async function drawBackCover(doc: PDFDocument, page: PDFPage, fonts: Fonts, input: PrintInput) {
  const ink = hex(INK)
  const muted = hex(MUTED)
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: hex(PAPER) })

  const heading = safeText(fonts.display, `Twelve months of ${joinPetNames(input.petNames)}`)
  const headingSize = fitSize(fonts.display, heading, 30, 10 * PT)
  page.drawText(heading, { x: X(0.5), y: Y(0.95), size: headingSize, font: fonts.display, color: ink })

  // 4 × 3 index of the months
  const columns = 4
  const gap = 0.2
  const thumbW = (10 - gap * (columns - 1)) / columns
  const thumbH = thumbW * (PAGE.trimHeight / PAGE.trimWidth)
  const top = 1.25
  const rowPitch = thumbH + 0.3
  for (let i = 0; i < input.months.length && i < 12; i++) {
    const col = i % columns
    const row = Math.floor(i / columns)
    const x = 0.5 + col * (thumbW + gap)
    const y = top + row * rowPitch
    const jpg = await doc.embedJpg(await artJpeg(input.months[i], 660, Math.round(660 * (thumbH / thumbW))))
    page.drawImage(jpg, { x: X(x), y: Y(y + thumbH), width: thumbW * PT, height: thumbH * PT })
    page.drawText(MONTH_NAMES[i].toUpperCase(), {
      x: X(x),
      y: Y(y + thumbH + 0.16),
      size: 7,
      font: fonts.sansBold,
      color: muted,
      characterSpacing: 0.8,
    } as Parameters<PDFPage['drawText']>[1])
  }

  const footer = `Made with ${SITE.name}`
  page.drawText(footer, { x: X(0.5), y: Y(8.05), size: 9, font: fonts.sansBold, color: ink })
  const note = 'Artwork created from your photos. Dates typeset for print.'
  page.drawText(note, {
    x: X(10.5) - fonts.sans.widthOfTextAtSize(note, 8),
    y: Y(8.05),
    size: 8,
    font: fonts.sans,
    color: muted,
  })
}

function newPage(doc: PDFDocument): PDFPage {
  const page = doc.addPage([PAGE_W, PAGE_H])
  const b = PAGE.bleed * PT
  page.setTrimBox(b, b, PAGE_W - b * 2, PAGE_H - b * 2)
  page.setBleedBox(0, 0, PAGE_W, PAGE_H)
  return page
}

export async function buildCoverPdf(input: PrintInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(`${coverTitle(input.petNames, input.year)} — cover`)
  doc.setCreator(SITE.name)
  const fonts = await loadFonts(doc)

  const front = newPage(doc)
  await drawFullBleedArt(doc, front, await withCoverScrim(input.cover))
  drawCoverTitle(front, fonts, input)

  const back = newPage(doc)
  await drawBackCover(doc, back, fonts, input)

  return doc.save()
}

export async function buildInteriorPdf(input: PrintInput): Promise<Uint8Array> {
  if (input.months.length !== 12) throw new Error(`Expected 12 month images, got ${input.months.length}`)
  const doc = await PDFDocument.create()
  doc.setTitle(`${coverTitle(input.petNames, input.year)} — interior`)
  doc.setCreator(SITE.name)
  const fonts = await loadFonts(doc)

  for (let month = 1; month <= 12; month++) {
    await drawFullBleedArt(doc, newPage(doc), input.months[month - 1])
    drawGridPage(newPage(doc), fonts, month, input)
  }
  return doc.save()
}
