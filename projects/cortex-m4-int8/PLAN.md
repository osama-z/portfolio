# Implementation plan

[Project brief](README.md) · [Portfolio home](../../README.md)

Planning estimate: 40–60 focused hours, with additional learning/debugging time
as needed. Complete each milestone's checks before marking it done.

## 1. Baseline and minimal firmware

- [ ] Obtain the v0.1.0 checkpoint and verification samples from the original project.
- [ ] Record source revision, artifact hashes, compiler version, and QEMU version.
- [ ] Reproduce the saved float32 baseline and native verification.
- [ ] Build a minimal Cortex-M4 program with startup code and a linker script.
- [ ] Boot it in QEMU, print a success message, and return an observable exit status.

**Completion check:** an automated runner distinguishes success, failure, and timeout.

## 2. Python integer reference

- [ ] Specify tensor layouts, scales, zero points, rounding, saturation, and padding.
- [ ] Use a deterministic subset of the original training split for calibration.
- [ ] Use validation data to select settings; freeze settings before test evaluation.
- [ ] Quantize weights and biases and implement integer inference in Python.
- [ ] Derive accumulator bounds; use wider intermediates for requantization as needed.
- [ ] Export versioned model metadata, parameters, and expected integer layer outputs.
- [ ] Compare final test accuracy with the saved float32 model and report the difference.

**Completion check:** reproducible export and a documented accuracy comparison.
The one-percentage-point loss is a target; report the observed result honestly.

## 3. Portable C inference

- [ ] Implement convolution, ReLU, max pooling, and Dense inference using fixed buffers.
- [ ] Use a common scale for final class scores before selecting the largest score.
- [ ] Match the reference's signed rounding, clipping, and zero-point behavior exactly.
- [ ] Test boundary values, accumulator limits, padding, pooling, and repeated inference.
- [ ] Compare every exported integer layer with Python.
- [ ] Run native memory and undefined-behavior checks.

**Completion check:** exact Python/C integer agreement on normal and edge-case fixtures.
Float32/int8 agreement is evaluated through accuracy rather than byte equality.

## 4. Cortex-M4 integration

- [ ] Compile the portable C engine for `mps2-an386`.
- [ ] Embed constant weights and fixtures in the firmware image.
- [ ] Keep desktop file I/O outside the embedded inference path.
- [ ] Run one example, then the 32-image verification set.
- [ ] Compare firmware layer outputs with the integer reference.
- [ ] Record code/model storage, static RAM, stack allowance, and measured stack usage
      on the exercised workloads. Do not describe observed stack usage as a proven maximum.
- [ ] Enforce the selected memory budget at build time where possible.

**Completion check:** all firmware fixtures agree and the documented allocation
fits the selected budget, including stack and runtime overhead.

## 5. Automated verification

- [ ] Add a single command for building and testing the emulated firmware.
- [ ] Keep routine tests independent of dataset downloads and retraining.
- [ ] Make mismatches, crashes, and timeouts fail the command.
- [ ] Add a GitHub Actions job with recorded tool versions and readable failure logs.
- [ ] Confirm that a deliberately changed expected output makes the check fail.

**Completion check:** a fresh checkout passes locally and in GitHub Actions.

## 6. Results and release

- [ ] Write setup instructions and an explanation of the integer arithmetic.
- [ ] Publish accuracy, storage, and memory results with reproduction commands.
- [ ] Record a short terminal demonstration of the verification pipeline.
- [ ] Package the firmware, model artifacts, metadata, and checksums.
- [ ] Update the portfolio status and decide how this milestone maps to the original
      CNN project's v0.2 release; keep source ownership and release links explicit.

**Completion check:** another developer can reproduce the documented firmware
verification using only a laptop.

## Proposed implementation layout

These directories will be created as their implementation begins:

```text
reference/    Python quantization, calibration, and reference inference
engine/       Portable integer C inference
firmware/     Startup code, linker script, and QEMU entry point
tests/        Arithmetic, native, and emulation checks
scripts/      Build, export, and verification helpers
reports/      Recorded measurements and interpretation
build/        Generated files; ignored by Git
```

## First working session

Begin with milestone 1: reproduce the existing model verification, then build
and boot the smallest possible Cortex-M4 firmware. Commit that working result
before adding the CNN to the firmware.
