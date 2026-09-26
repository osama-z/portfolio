import { projectCards } from '../components/site.mjs';
import { projects } from '../content/projects.mjs';
export const work = `<section class="page-intro content-width"><p class="section-kicker">Software. Hardware. Everything I learn along the way.</p><h1>A collection<br>of curiosities.</h1><p>Personal builds, academic projects, and the next experiment.<br>Open one to explore the problem and the work behind it.</p></section><section class="work-page content-width" aria-label="All projects">${projectCards(projects)}</section>`;
