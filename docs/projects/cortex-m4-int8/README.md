# Verified int8 CNN on an emulated Cortex-M4

[Portfolio home](../../../README.md) · [Implementation plan](PLAN.md)

**Status: planning. There is no firmware or integer inference implementation in
this folder yet.**

## Goal

Reuse the trained MNIST model from
[CNN from scratch](https://github.com/osama-z/cnn-from-scratch), convert it to
integer arithmetic, and run a verified C implementation as Cortex-M4 firmware
under QEMU.

The central question is how much model storage and working memory can be reduced
while retaining useful accuracy and agreement across implementations.

## Planned system

```text
Saved float32 checkpoint
          |
          v
Calibration and integer model export
          |
          +--> Python integer reference
          |
          +--> Portable C on the laptop
          |
          +--> Cortex-M4 firmware in QEMU

Compare integer layer outputs across all three implementations.
Compare float32 and int8 accuracy separately.
```

## Initial targets

- QEMU board model: `mps2-an386` (Cortex-M4).
- Int8 weights and activations, with int32 accumulation where bounds permit.
- Fixed inference buffers and a documented stack allowance.
- Initial project RAM budget: 128 KiB, including static data and stack. This is
  an experiment constraint, not a claim about the emulated board's total RAM.
- Initial accuracy-loss target: at most one percentage point against the saved
  float32 baseline, subject to measured results.
- Automated tests that fail on mismatches, crashes, or timeouts.

## Tools

- Python and NumPy for calibration, export, and reference inference.
- A host C compiler and Make for native verification.
- `arm-none-eabi-gcc` and binutils for firmware builds and size reports.
- `qemu-system-arm` for functional firmware emulation.

Start with [milestone 1](PLAN.md#1-baseline-and-minimal-firmware). Record tool
versions as part of that work; setup scripts will be added during implementation.

## Measurement boundaries

QEMU validates firmware behavior for its emulated platform. Its wall-clock time
does not establish real Cortex-M4 latency or energy consumption. Physical
performance measurements are a later milestone requiring a board.

## References

- [QEMU MPS2 board models](https://www.qemu.org/docs/master/system/arm/mps2.html)
- [QEMU instruction counting and timing limitations](https://www.qemu.org/docs/master/devel/tcg-icount.html)
- [CMSIS-NN](https://github.com/ARM-software/CMSIS-NN), a possible later comparison once the reference arithmetic is stable.
