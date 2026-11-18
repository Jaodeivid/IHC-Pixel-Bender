import { HERO } from '../data/hero.js'

export function renderizarHero() {
  const pasos = HERO.steps
    .map((paso) => `<li><div><strong>${paso.title}</strong><span>${paso.text}</span></div></li>`)
    .join('')
  const { preview } = HERO
  return `
    <section class="hero" aria-label="Presentación">
      <h1 class="hero__title">${HERO.title}</h1>
      <p class="hero__lead">${HERO.lead}</p>
      <ol class="steps">${pasos}</ol>
      <div class="preview" aria-hidden="true">
        <div class="preview__row"><span>${preview.problem}</span><span>${preview.language}</span></div>
        <div class="preview__row"><span>Último envío</span><span class="preview__verdict">${preview.verdict}</span></div>
      </div>
    </section>`
}
