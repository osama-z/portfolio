# CNN from scratch

[Portfolio home](../../README.md)

Train a small convolutional neural network using NumPy, export its learned
weights, and verify inference through independent C and C++ implementations.
The project also includes VHDL convolution building blocks and testbenches.

- [Source and documentation](https://github.com/osama-z/cnn-from-scratch)
- [v0.1.0 release and model bundle](https://github.com/osama-z/cnn-from-scratch/releases/tag/v0.1.0)
- [Technical guide](https://github.com/osama-z/cnn-from-scratch/blob/main/docs/guide.md)
- [Recorded baseline](https://github.com/osama-z/cnn-from-scratch/blob/main/reports/trained-baseline.md)

## Recorded v0.1.0 results

| Check | Result |
|---|---|
| Trained CNN accuracy | 91.87% on 10,000 MNIST test images |
| Native deployment verification | 32/32 predictions and 224 layer tensors agree per engine with the NumPy reference within the documented tolerances |
| VHDL convolution verification | 384 outputs checked in each of two convolution testbenches |

The trained CNN uses float32 CPU inference. The VHDL tests use a separate frozen
integer fixture; complete deployment of the trained network on an FPGA has not
been demonstrated.

The [next project](cortex-m4-int8/README.md) develops integer inference and
functional verification on an emulated Cortex-M4.
