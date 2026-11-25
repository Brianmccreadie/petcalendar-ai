import { MONTH_NAMES } from '../calendar/layout'

// ---------------------------------------------------------------------------
// HyperFrames composition for the calendar "reveal" film.
//
// HyperFrames (https://github.com/heygen-com/hyperframes) renders plain HTML +
// a paused GSAP timeline to video. This module returns that HTML, so the same
// film can be:
//   • played in the browser with <hyperframes-player>  (app/reveal/[projectId])
//   • rendered to MP4 with `npx hyperframes render`     (scripts/render-reveal.mjs)
//
// All text here is real type, animated — the artwork itself never has text.
// ---------------------------------------------------------------------------

export interface RevealInput {
  title: string // "Luna’s 2027"
  subtitle: string // "The Space Explorer edition"
  year: number
  accent: string
  coverUrl: string
  monthUrls: string[] // 12, January first
  /** The customer's own photos, shown first: "it started with these". Up to five are used. */
  referenceUrls?: string[]
  /** Where instrument-serif.woff2 / geist.woff2 live (URL or relative path, no trailing slash). */
  fontBase: string
  /** URL of gsap.min.js (self-hosted at /vendor/gsap.min.js). */
  gsapUrl: string
  siteLabel?: string
}

export const REVEAL = {
  width: 1920,
  height: 1080,
  fps: 30,
  introSeconds: 3.2,
  titleSeconds: 2.8,
  coverSeconds: 2.4,
  monthSeconds: 1.25,
  outroSeconds: 3.6,
}

export function revealDuration(hasReferences = false): number {
  return (hasReferences ? REVEAL.introSeconds : 0) + REVEAL.titleSeconds + REVEAL.coverSeconds + 12 * REVEAL.monthSeconds + REVEAL.outroSeconds
}

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function safeColor(value: string, fallback: string): string {
  return /^#[0-9a-f]{3,8}$/i.test(value) ? value : fallback
}

export function buildRevealComposition(input: RevealInput): string {
  const { titleSeconds: T, coverSeconds: C, monthSeconds: M, outroSeconds: O } = REVEAL
  const refs = (input.referenceUrls ?? []).filter(Boolean).slice(0, 5)
  // Everything after the photo intro is shifted by its length.
  const I = refs.length ? REVEAL.introSeconds : 0
  const total = revealDuration(refs.length > 0)
  const monthsStart = I + T + C
  const outroStart = monthsStart + 12 * M
  const accent = safeColor(input.accent, '#c9a45c')
  const months = input.monthUrls.slice(0, 12)
  const titleWords = input.title.split(/\s+/).filter(Boolean)

  const monthScenes = months
    .map((url, i) => {
      const start = monthsStart + i * M
      return `
      <section class="clip scene month" id="m${i}" data-start="${start.toFixed(3)}" data-duration="${M}" data-track-index="2">
        <div class="month-art" id="m${i}-art"><img src="${esc(url)}" alt="" /></div>
        <div class="month-copy">
          <div class="month-num" id="m${i}-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="mask"><div class="month-name" id="m${i}-name">${MONTH_NAMES[i]}</div></div>
          <div class="month-year" id="m${i}-year">${input.year}</div>
        </div>
      </section>`
    })
    .join('\n')

  const thumbs = months.map((url, i) => `<img class="thumb" id="t${i}" src="${esc(url)}" alt="" />`).join('')

  const monthTweens = months
    .map((_, i) => {
      const at = (monthsStart + i * M).toFixed(3)
      const tilt = i % 2 === 0 ? -1.5 : 1.5
      return `
      tl.fromTo("#m${i}-art", { opacity: 0, y: 70, rotation: ${tilt * 2}, scale: 0.94 }, { opacity: 1, y: 0, rotation: ${tilt}, scale: 1, duration: 0.42, ease: "power3.out" }, ${at});
      tl.fromTo("#m${i}-name", { y: 150 }, { y: 0, duration: 0.42, ease: "power4.out" }, ${at} + 0.08);
      tl.fromTo("#m${i}-num", { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, ${at} + 0.05);
      tl.fromTo("#m${i}-year", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${at} + 0.22);
      tl.to("#m${i}-art", { scale: 1.025, duration: ${(M - 0.42).toFixed(2)}, ease: "none" }, ${at} + 0.42);`
    })
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${REVEAL.width}, height=${REVEAL.height}" />
    <title>${esc(input.title)} — reveal</title>
    <script src="${esc(input.gsapUrl)}"></script>
    <style>
      @font-face { font-family: "Instrument Serif"; src: url("${esc(input.fontBase)}/instrument-serif.woff2") format("woff2"); font-weight: 400; font-display: block; }
      @font-face { font-family: "Geist"; src: url("${esc(input.fontBase)}/geist.woff2") format("woff2"); font-weight: 100 900; font-display: block; }
      :root { --paper: #f4efe6; --ink: #0c0b0a; --muted: #8d867c; --accent: ${accent}; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${REVEAL.width}px; height: ${REVEAL.height}px; overflow: hidden; background: var(--paper); }
      #root { position: relative; width: 100%; height: 100%; color: var(--ink); font-family: "Geist", sans-serif; }
      .scene { position: absolute; inset: 0; overflow: hidden; visibility: hidden; }
      .display { font-family: "Instrument Serif", Georgia, serif; font-weight: 400; letter-spacing: -0.02em; line-height: 1; }
      .mask { overflow: hidden; padding-bottom: 0.14em; }
      .eyebrow { font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; font-size: 26px; }
      img { display: block; width: 100%; height: 100%; object-fit: cover; }

      /* Photo intro */
      #intro { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 70px; background: var(--paper);
        background-image: radial-gradient(rgba(29, 26, 22, 0.05) 2px, transparent 2px); background-size: 34px 34px; }
      #intro .eyebrow { color: #86672a; font-size: 34px; }
      #intro-photos { display: flex; align-items: center; justify-content: center; gap: 36px; }
      .snap { width: ${refs.length > 3 ? 300 : 400}px; height: ${refs.length > 3 ? 375 : 500}px; padding: 14px 14px 54px; background: #fff; border-radius: 4px;
        box-shadow: 0 40px 70px -34px rgba(29, 26, 22, 0.55), 0 3px 8px rgba(29, 26, 22, 0.14); }

      /* Title card */
      #title-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; text-align: center; padding: 0 140px;
        background-image: radial-gradient(rgba(29, 26, 22, 0.05) 2px, transparent 2px); background-size: 34px 34px; }
      #title-card .eyebrow { color: #86672a; }
      #title-words { display: flex; flex-wrap: wrap; justify-content: center; gap: 0 0.24em; font-size: ${titleWords.join(' ').length > 22 ? 190 : 270}px; }
      #title-rule { width: 420px; height: 2px; background: #86672a; transform-origin: center; }
      #title-sub { font-size: 40px; font-weight: 500; color: #4a443c; }

      /* Cover */
      #cover-art { position: absolute; inset: 0; }
      #cover-scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15, 13, 10, 0.82), rgba(15, 13, 10, 0.3) 38%, transparent 62%); }
      #cover-copy { position: absolute; left: 110px; right: 110px; bottom: 100px; color: #fff; }
      #cover-copy .display { font-size: ${input.title.length > 22 ? 170 : 230}px; }
      #cover-copy .eyebrow { margin-top: 22px; opacity: 0.9; }

      /* Months */
      .month { background: var(--paper); }
      .month-art { position: absolute; left: 110px; top: 105px; width: 1125px; height: 870px; border-radius: 6px; overflow: hidden;
        box-shadow: 0 50px 90px -40px rgba(29, 26, 22, 0.55), 0 4px 10px rgba(29, 26, 22, 0.12); }
      .month-copy { position: absolute; left: 1320px; right: 80px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
      .month-num { font-weight: 600; font-size: 30px; letter-spacing: 0.26em; color: #86672a; margin-bottom: 18px; }
      .month-name { font-family: "Instrument Serif", Georgia, serif; font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; font-size: 132px; }
      .month-year { font-family: "Instrument Serif", Georgia, serif; font-weight: 400; font-style: normal; font-size: 54px; color: var(--muted); margin-top: 10px; }

      /* Outro */
      #outro { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 44px; background: var(--ink); color: var(--paper); }
      #outro-grid { display: grid; grid-template-columns: repeat(6, 250px); gap: 18px; }
      .thumb { width: 250px; height: 193px; border-radius: 4px; }
      #outro-title { font-size: 160px; }
      #outro-site { font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; font-size: 26px; color: var(--accent); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="reveal" data-start="0" data-duration="${total.toFixed(3)}" data-width="${REVEAL.width}" data-height="${REVEAL.height}" data-fps="${REVEAL.fps}">
      ${refs.length ? `<section class="clip scene" id="intro" data-start="0" data-duration="${I}" data-track-index="4">
        <div class="eyebrow" id="intro-eyebrow">It started with ${refs.length === 1 ? 'one photo' : 'a few photos'}</div>
        <div id="intro-photos">
          ${refs.map((url, i) => `<div class="snap" id="r${i}"><img src="${esc(url)}" alt="" /></div>`).join('')}
        </div>
      </section>` : ''}
      <section class="clip scene" id="title-card" data-start="${I}" data-duration="${T}" data-track-index="0">
        <div class="eyebrow" id="title-eyebrow">Now showing</div>
        <div class="display" id="title-words">
          ${titleWords.map((w, i) => `<span class="mask"><span class="word" id="w${i}" style="display:inline-block">${esc(w)}</span></span>`).join('')}
        </div>
        <div id="title-rule"></div>
        <div id="title-sub">${esc(input.subtitle)}</div>
      </section>

      <section class="clip scene" id="cover" data-start="${I + T}" data-duration="${C}" data-track-index="1">
        <div id="cover-art"><img src="${esc(input.coverUrl)}" alt="" /></div>
        <div id="cover-scrim"></div>
        <div id="cover-copy">
          <div class="mask"><div class="display" id="cover-title">${esc(input.title)}</div></div>
          <div class="eyebrow" id="cover-sub">${esc(input.subtitle)}</div>
        </div>
      </section>
${monthScenes}

      <section class="clip scene" id="outro" data-start="${outroStart.toFixed(3)}" data-duration="${O}" data-track-index="3">
        <div id="outro-grid">${thumbs}</div>
        <div class="display" id="outro-title">${esc(input.title)}</div>
        <div id="outro-site">${esc(input.siteLabel ?? 'petcalendar.ai')}</div>
      </section>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });

      // Scene visibility is driven by the timeline itself, so the film plays the
      // same in <hyperframes-player>, the HyperFrames renderer, or a bare browser.
      const scenes = ${JSON.stringify([
        ...(refs.length ? [['#intro', 0, I]] : []),
        ['#title-card', I, I + T],
        ['#cover', I + T, I + T + C],
        ...months.map((_, i) => [`#m${i}`, monthsStart + i * M, monthsStart + (i + 1) * M]),
        ['#outro', outroStart, total],
      ])};
      scenes.forEach(([id, start, end], i) => {
        tl.set(id, { visibility: "visible" }, start);
        if (i < scenes.length - 1) tl.set(id, { visibility: "hidden" }, end);
      });

      // Photo intro
      ${refs.length ? `tl.fromTo("#intro-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.15);
      ${refs.map((_, i) => `tl.fromTo("#r${i}", { opacity: 0, y: 120, rotation: ${(i % 2 ? 9 : -9)}, scale: 0.8 }, { opacity: 1, y: 0, rotation: ${((i - (refs.length - 1) / 2) * 4).toFixed(1)}, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, ${(0.35 + i * 0.16).toFixed(2)});`).join('\n      ')}
      tl.to("#intro", { opacity: 0, duration: 0.35 }, ${(I - 0.35).toFixed(2)});` : ''}

      // Title card
      tl.fromTo("#title-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, ${I} + 0.1);
      ${titleWords.map((_, i) => `tl.fromTo("#w${i}", { y: 260 }, { y: 0, duration: 0.7, ease: "power4.out" }, ${(I + 0.25 + i * 0.12).toFixed(2)});`).join('\n      ')}
      tl.fromTo("#title-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, ${I} + 0.9);
      tl.fromTo("#title-sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, ${I} + 1.1);
      tl.to("#title-card", { opacity: 0, duration: 0.3 }, ${(I + T - 0.3).toFixed(2)});

      // Cover
      tl.fromTo("#cover-art", { scale: 1.12 }, { scale: 1, duration: ${C}, ease: "power1.out" }, ${I + T});
      tl.fromTo("#cover", { opacity: 0 }, { opacity: 1, duration: 0.35 }, ${I + T});
      tl.fromTo("#cover-title", { y: 220 }, { y: 0, duration: 0.7, ease: "power4.out" }, ${I + T} + 0.3);
      tl.fromTo("#cover-sub", { opacity: 0, y: 16 }, { opacity: 0.9, y: 0, duration: 0.45 }, ${I + T} + 0.75);

      // Months
${monthTweens}

      // Outro
      const O = ${outroStart.toFixed(3)};
      ${months.map((_, i) => `tl.fromTo("#t${i}", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, O + ${(0.1 + i * 0.07).toFixed(2)});`).join('\n      ')}
      tl.fromTo("#outro-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, O + 1.0);
      tl.fromTo("#outro-site", { opacity: 0 }, { opacity: 1, duration: 0.5 }, O + 1.5);

      // Hold the final frame to the full duration.
      tl.to("#outro-site", { opacity: 1, duration: 0.05 }, ${(total - 0.05).toFixed(3)});

      window.__timelines["reveal"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`
}
