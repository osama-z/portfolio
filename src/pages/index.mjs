import { layout } from '../components/site.mjs';
import { home } from './home.mjs';
import { work } from './work.mjs';
import { about } from './about.mjs';
import { cnn } from './cnn.mjs';
import { cortex } from './cortex.mjs';
import { notFound } from './not-found.mjs';
import { projects } from '../content/projects.mjs';
import { projectPage } from './project.mjs';

export const pages = {
  'index.html': layout('Osama Zuraid — Code meets the real world.', 'Computer engineer from Gaza. Explore Osama’s work in embedded systems, backend development, neural networks and software.', home, '', 'home'),
  'work.html': layout('My work — Osama Zuraid', 'Explore seven projects across embedded systems, backend development, computer vision and neural networks.', work, 'work'),
  'about.html': layout('About me — Osama Zuraid', 'Meet Osama Zuraid, a computer engineer from Gaza working across software, hardware and humanitarian data.', about, 'about'),
  'cnn.html': layout('CNN from scratch — Osama', 'A NumPy-trained CNN with verified C and C++ inference. Explore the released model, 91.87% MNIST test accuracy, and VHDL convolution tests.', cnn, 'work'),
  'cortex.html': layout('The Cortex-M4 experiment — Osama', 'A planned exploration of verified integer CNN inference on an emulated Cortex-M4. Read the question, targets, and roadmap.', cortex, 'work'),
  '404.html': layout('Page not found — Osama', 'Find your way back to Osama’s portfolio.', notFound),
  ...Object.fromEntries(projects.filter(p => p.description).map(p => [p.href, layout(`${p.full} — Osama Zuraid`, p.summary, projectPage(p), 'work')])),
};
