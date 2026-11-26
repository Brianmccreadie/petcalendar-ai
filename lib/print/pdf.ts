import { readFile } from 'fs/promises'
import path from 'path'
import fontkit from '@pdf-lib/fontkit'
import {
  PDFDocument,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
  type RGB,
} from 'pdf-lib'
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
  coverText,
  coverTitle,
  gridCellRect,
  joinPetNames,
  printableAccent,
} from '../calendar/layout'
import { SITE } from '../config'
import { loadSharp } from '../images'
import { sniffImageMime } from '../validate'

// ---------------------------------------------------------------------------
// Print-ready PDFs for an 11 × 8.5 in Wire-O wall calendar.
//
// Every page is 11.25 × 8.75 in (trim + 0.125 in bleed on all sides), 72 pt/in.
//
// The layout is the one Lulu's API validates for its Wire-O calendar
// (1100X0850.FC.PRE.WO.100CW200.GXX): a 4-page cover and, for twelve months,
// a 26-page interior.
//
//   cover.pdf     page 1  outside front (art + typeset title)
//                 page 2  inside front  (plain)
//                 page 3  inside back   (plain)
//                 page 4  outside back  (thumbnail index of the twelve months)
//   interior.pdf  page 1  title page (seen under the lifted cover)
//                 pages 2–25: for each month, the art page then the dates page
//                 page 26 closing page (seen above the inside back cover)
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
  /** 'dog' | 'cat' | 'other' — used in the cover caption. */
  petType?: string
  /** Raw image bytes for the cover. */
  cover: Buffer
  /** Raw image bytes for months 1-12, in order. */
  months: Buffer[]
}

interface Fonts {
  cover: PDFFont
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
  const [cover, display, displaySemi, sans, sansBold] = await Promise.all([
    load('nunito-800-italic.woff'),
    load('instrument-serif-400.woff'),
    load('instrument-serif-400.woff'),
    load('geist-400.ttf'),
    load('geist-600.ttf'),
  ])
  return { cover, display, displaySemi, sans, sansBold }
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

/**
 * Embed artwork in the document. With sharp available the image is first
 * cropped and resampled to the exact print size (optionally with the cover
 * scrim burned in). Without it, the original bytes are embedded and the page
 * drawing code crops by clipping instead.
 */
async function embedArt(doc: PDFDocument, input: Buffer, options: { scrim?: boolean } = {}): Promise<{ image: PDFImage; scrimBurned: boolean }> {
  const sharp = await loadSharp()
  if (sharp) {
    const { width, height } = ART_PX
    let pipeline = sharp(input).rotate().resize(width, height, { fit: 'cover', position: 'centre' }).toColourspace('srgb')
    if (options.scrim) {
      // Soft shade behind each block of cover text so white type holds on bright art.
      const px = (inches: number) => Math.round((inches + PAGE.bleed) * PRINT_DPI)
      const C = COVER_PAGE
      const blob = (cx: number, cy: number, rx: number, ry: number) =>
        `<ellipse cx="${px(cx)}" cy="${px(cy)}" rx="${Math.round(rx * PRINT_DPI)}" ry="${Math.round(ry * PRINT_DPI)}" fill="url(#g)"/>`
      const scrim = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <defs><radialGradient id="g">
            <stop offset="0" stop-color="#0f0d0a" stop-opacity="0.42"/>
            <stop offset="1" stop-color="#0f0d0a" stop-opacity="0"/>
          </radialGradient></defs>
          ${blob(C.left + C.zoneWidth / 2, C.centerY, C.zoneWidth * 0.75, 2.2)}
          ${blob(C.right - C.zoneWidth / 2, C.centerY, C.zoneWidth * 0.75, 2.2)}
          ${blob(C.right - 1.2, C.captionBaseline - 0.1, 2.6, 0.9)}
        </svg>`
      )
      pipeline = sharp(await pipeline.jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toBuffer()).composite([{ input: scrim }])
    }
    const jpeg = await pipeline.jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toBuffer()
    return { image: await doc.embedJpg(jpeg), scrimBurned: Boolean(options.scrim) }
  }

  const mime = sniffImageMime(input)
  if (mime === 'image/jpeg') return { image: await doc.embedJpg(input), scrimBurned: false }
  if (mime === 'image/png') return { image: await doc.embedPng(input), scrimBurned: false }
  throw new Error('Artwork must be JPEG or PNG to build print files without image processing')
}

/** Draw an image so it covers the box (centre-cropped), clipped to the box. Coordinates in points. */
function drawCover(page: PDFPage, image: PDFImage, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.width, height / image.height)
  const w = image.width * scale
  const h = image.height * scale
  page.pushOperators(pushGraphicsState(), rectangle(x, y, width, height), clip(), endPath())
  page.drawImage(image, { x: x + (width - w) / 2, y: y + (height - h) / 2, width: w, height: h })
  page.pushOperators(popGraphicsState())
}

async function drawFullBleedArt(doc: PDFDocument, page: PDFPage, image: Buffer): Promise<PDFImage> {
  const art = await embedArt(doc, image)
  drawCover(page, art.image, 0, 0, PAGE_W, PAGE_H)
  return art.image
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
    page.drawLine({ start: { x: X(L.left), y }, end: { x: X(L.right), y }, thickness: r === 0 ? 1.6 : 0.8, color: r === 0 ? ink : rule })
  }
  for (let c = 0; c <= 7; c++) {
    const x = X(L.left + c * cellWidth)
    page.drawLine({ start: { x, y: Y(L.gridTop) }, end: { x, y: Y(L.gridBottom) }, thickness: 0.8, color: rule })
  }

  // Days
  for (const cell of grid.cells) {
    const rect = gridCellRect(grid, cell.column, cell.row)
    const weekend = cell.column === 0 || cell.column === 6
    page.drawText(String(cell.day), {
      x: X(rect.x + L.dayInset),
      y: Y(rect.y + L.dayInset + L.daySize * 0.78),
      size: L.daySize * PT,
      font: fonts.sans,
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
  const font = fonts.cover
  const t = coverText(input.petNames, input.year, input.styleName, input.petType ?? 'other')
  const white = rgb(1, 1, 1)
  const shadow = rgb(0.06, 0.05, 0.04)

  // White lettering with a soft offset shadow, anchored left or right.
  const put = (text: string, anchor: 'left' | 'right', baseline: number, sizeIn: number, maxWidthIn: number) => {
    const clean = safeText(font, text)
    if (!clean) return
    const size = fitSize(font, clean, sizeIn * PT, maxWidthIn * PT)
    const width = font.widthOfTextAtSize(clean, size)
    const x = anchor === 'left' ? X(C.left) : X(C.right) - width
    const y = Y(baseline)
    const offset = size * 0.035
    page.drawText(clean, { x: x + offset * 0.4, y: y - offset, size, font, color: shadow, opacity: 0.45 })
    page.drawText(clean, { x, y, size, font, color: white })
  }

  t.nameLines.forEach((line, i) => put(line, 'left', t.nameBaselines[i], t.nameSize, C.zoneWidth))
  put(t.year, 'right', t.yearBaseline, t.yearSize, C.zoneWidth)
  t.caption.forEach((line, i) =>
    put(line, 'right', C.captionBaseline + (i - 1) * C.captionSize * C.captionLineHeight, C.captionSize, 4.5)
  )
}

/** Small copy of a page for the back-cover index (full image when sharp is unavailable). */
async function embedThumb(doc: PDFDocument, input: Buffer): Promise<PDFImage> {
  const sharp = await loadSharp()
  if (!sharp) return (await embedArt(doc, input)).image
  return doc.embedJpg(await sharp(input).rotate().resize(660, 495, { fit: 'cover' }).jpeg({ quality: 88 }).toBuffer())
}

async function drawBackCover(doc: PDFDocument, page: PDFPage, fonts: Fonts, input: PrintInput) {
  const ink = hex(INK)
  const muted = hex(MUTED)
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: hex(PAPER) })

  const heading = safeText(fonts.display, `Twelve months of ${joinPetNames(input.petNames)}`)
  const headingSize = fitSize(fonts.display, heading, 40, 10 * PT)
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
    const thumb = await embedThumb(doc, input.months[i])
    drawCover(page, thumb, X(x), Y(y + thumbH), thumbW * PT, thumbH * PT)
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

function drawPlainPage(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: hex(PAPER) })
}

/** First inside page: the name, the year and the edition, centred. */
function drawTitlePage(page: PDFPage, fonts: Fonts, input: PrintInput) {
  drawPlainPage(page)
  const centre = (text: string, font: PDFFont, size: number, baseline: number, color: RGB, spacing = 0) => {
    const width = font.widthOfTextAtSize(text, size) + spacing * Math.max(0, text.length - 1)
    page.drawText(text, { x: (PAGE_W - width) / 2, y: Y(baseline), size, font, color, characterSpacing: spacing } as Parameters<PDFPage['drawText']>[1])
  }
  const name = safeText(fonts.display, joinPetNames(input.petNames))
  centre(name, fonts.display, fitSize(fonts.display, name, 92, 9 * PT), 4.15, hex(INK))
  centre(String(input.year), fonts.display, 44, 4.95, hex(MUTED))
  centre(safeText(fonts.sansBold, `The ${input.styleName} edition`.toUpperCase()), fonts.sansBold, 9, 5.55, hex(MUTED), 1.6)
}

/** Last inside page: a quiet sign-off. */
function drawClosingPage(page: PDFPage, fonts: Fonts) {
  drawPlainPage(page)
  const text = `Made with ${SITE.name}`
  page.drawText(text, { x: (PAGE_W - fonts.sansBold.widthOfTextAtSize(text, 10)) / 2, y: Y(4.3), size: 10, font: fonts.sansBold, color: hex(MUTED) })
  const url = SITE.domain
  page.drawText(url, { x: (PAGE_W - fonts.sans.widthOfTextAtSize(url, 9)) / 2, y: Y(4.55), size: 9, font: fonts.sans, color: hex(MUTED) })
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
  const cover = await embedArt(doc, input.cover, { scrim: true })
  drawCover(front, cover.image, 0, 0, PAGE_W, PAGE_H)
  drawCoverTitle(front, fonts, input)

  drawPlainPage(newPage(doc))
  drawPlainPage(newPage(doc))

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

  drawTitlePage(newPage(doc), fonts, input)
  for (let month = 1; month <= 12; month++) {
    await drawFullBleedArt(doc, newPage(doc), input.months[month - 1])
    drawGridPage(newPage(doc), fonts, month, input)
  }
  drawClosingPage(newPage(doc), fonts)
  return doc.save()
}
