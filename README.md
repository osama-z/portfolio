# Embedded systems portfolio

A collection of projects exploring neural networks, embedded C/C++, numerical
verification, and digital hardware design.

## Projects

| Project | Status | Explore |
|---|---|---|
| CNN from scratch | v0.1.0 released | [Overview](projects/cnn-from-scratch.md) · [Source](https://github.com/osama-z/cnn-from-scratch) |
| Int8 CNN on an emulated Cortex-M4 | Planned; implementation has not started | [Project brief](projects/cortex-m4-int8/README.md) · [Implementation plan](projects/cortex-m4-int8/PLAN.md) |

## Start building

The next project is a verified integer CNN running as Cortex-M4 firmware in
QEMU. It can be developed on a laptop without a physical board.

1. Read the [project brief](projects/cortex-m4-int8/README.md).
2. Begin with milestone 1 in the [implementation plan](projects/cortex-m4-int8/PLAN.md).
3. Commit a small working result and record its verification command.
4. Update the checklist when its completion criteria pass.

The existing CNN source remains in its own repository. This repository contains
the portfolio overview and the starting workspace for the next project.

## How results are presented

Each project should explain its problem, design, reproduction commands, measured
results, and limitations. Label planned work, simulation results, host timings,
and physical hardware measurements explicitly.

Keep personal application documents, credentials, and private notes outside this
repository. See [.gitignore](.gitignore) for local artifact exclusions.

[MIT license](LICENSE)
