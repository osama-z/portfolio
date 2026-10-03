import { profile } from '../content/site.mjs';
import { projects } from '../content/projects.mjs';
import { networkArt, chipArt } from './illustrations.mjs';
export { networkArt, chipArt };

export const arrow = '<svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export const external = (href, label, className = '') => `<a href="${href}" class="${className}" target="_blank" rel="noopener noreferrer">${label}${arrow}<span class="sr-only"> (opens in a new tab)</span></a>`;
export const spark = '<svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="m50 3 7 30 25-18-17 26 32 9-32 8 17 26-25-18-7 31-8-31-25 18 17-26-31-8 31-9-17-26 25 18Z" fill="currentColor"/></svg>';

export function coverArt(kind) {
  if (kind === 'chip') return chipArt().replace('>CORTEX<', '>ARM<').replace('>M4<', '>MCU<').replace('INT8 · 32 BIT · ARM', 'REGISTERS / INTERRUPTS');
  if (kind === 'trading') return '<svg viewBox="0 0 300 240" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="35" y="37" width="230" height="162" rx="12" fill="#f8f7f2"/><path d="M35 70h230M58 92v83h182"/><path d="m65 143 34-29 32 22 34-40 32 25 36-16" stroke="#267d68"/><path d="M82 159h32m14 0h32m14 0h32"/><circle cx="54" cy="54" r="3" fill="currentColor"/><circle cx="68" cy="54" r="3" fill="currentColor"/></g></svg>';
  if (kind === 'network') return networkArt();
  if (kind === 'terminal') return '<div class="terminal-art" aria-hidden="true"><span class="terminal-dots">● ● ●</span><code>$ make something<br><span>hello, world.</span><br>$ <b>_</b></code><span class="terminal-bracket">{ }</span></div>';
  if (kind === 'aid') return '<svg viewBox="0 0 300 240" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="2.5"><rect x="51" y="52" width="160" height="158" rx="8" fill="#f4d738" transform="rotate(-12 130 130)"/><rect x="88" y="29" width="160" height="174" rx="8" fill="#f8f7f2" transform="rotate(8 170 115)"/><circle cx="146" cy="77" r="14" fill="#b9a2e3"/><path d="M123 117c0-30 47-30 47 0Z" fill="#b9a2e3"/><path d="M190 75h30m-30 16h24M118 140h99m-99 17h99m-99 17h64"/><circle cx="230" cy="183" r="30" fill="#38c6d4"/><path d="m216 183 10 10 18-20"/></g></svg>';
  if (kind === 'home') return '<svg viewBox="0 0 300 240" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="m61 117 89-73 89 73v96H61Z" fill="#f4d738"/><path d="m40 119 110-91 110 91"/><rect x="126" y="142" width="49" height="71" fill="#f8f7f2"/><rect x="83" y="135" width="23" height="28" fill="#38c6d4"/><rect x="194" y="135" width="23" height="28" fill="#38c6d4"/><path d="M118 99q32-33 64 0m-52 10q20-21 40 0"/><circle cx="150" cy="119" r="3" fill="currentColor"/></g></svg>';
  return '<svg viewBox="0 0 300 240" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="3"><path d="M36 119s44-67 114-67 114 67 114 67-44 67-114 67S36 119 36 119Z" fill="#f8f7f2"/><circle cx="150" cy="119" r="43" fill="#38c6d4"/><circle cx="150" cy="119" r="20" fill="currentColor"/><path d="M33 49V26h26m182 0h26v23M33 189v23h26m182 0h26v-23"/></g></svg>';
}

export function projectCover(project, className = '') {
  return `<div class="project-cover color-${project.color} ${className}"><span class="cover-category">${project.category}</span><span class="cover-title">${project.cover.replaceAll('\n', '<br>')}</span><div class="cover-art">${coverArt(project.kind)}</div><span class="cover-bottom">${project.stack.slice(0, 2).join(' / ')}<span aria-hidden="true">↗</span></span></div>`;
}

export function projectCards(list = projects) {
  return `<div class="project-grid">${list.map(p => `<article class="project-card"><a href="${p.href}" aria-label="Explore ${p.full}">${projectCover(p)}<div class="project-caption"><span class="project-status">${p.status}</span><h3>${p.title} ${arrow}</h3><p>${p.summary}</p></div></a></article>`).join('')}</div>`;
}

export function header(active = '') {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><a class="brand" href="index.html" aria-label="Osama Zuraid — home">osama<span class="brand-spark">${spark}</span><span class="brand-last">zuraid</span></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu <span aria-hidden="true">+</span></button>
  <nav class="main-nav" id="primary-nav" aria-label="Main navigation"><a href="work.html" ${active==='work'?'aria-current="page"':''}>My work</a><a href="about.html" ${active==='about'?'aria-current="page"':''}>About me</a><a href="#contact" class="nav-contact">Say hello ${arrow}</a></nav></header>`;
}

export function footer() {
  return `<footer id="contact" class="site-footer"><div class="footer-top"><div><p class="footer-intro">Have a project, a question, or a good idea?</p><h2>Let’s make<br>something work.</h2></div><a class="contact-orbit" href="mailto:${profile.email}" aria-label="Email Osama">${arrow}</a></div>
  <div class="footer-links"><a class="email-link" href="mailto:${profile.email}">${profile.email}</a>${external(profile.github, 'GitHub')}<span>Open to remote roles & relocation</span></div>
  <div class="footer-bottom"><span>© ${new Date().getFullYear()} Osama Zuraid</span><span>Made with curiosity. From Gaza.</span><a href="#top">Back to top ↑</a></div></footer>`;
}

export function layout(title, description, body, active = '', className = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f4d738"><title>${title}</title><meta name="description" content="${description}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="assets/portfolio-sans.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="assets/styles.css"><script src="assets/main.js" defer></script></head><body class="${className}" id="top">${header(active)}<main id="main">${body}</main>${footer()}</body></html>`;
}
