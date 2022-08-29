class Layer {
  layerWidth=64
  layerHeight=64
  layerChannel=3

  kernelType='conv'

  kernelWidth=3
  kernelHeight=3
  kernelChannel=64

  kernelPadding=1
  kernelStride=1

  asJson () {
    return {
      layerWidth: this.layerWidth,
      layerHeight: this.layerHeight,
      layerChannel: this.layerChannel,
      kernelType: this.kernelType,
      kernelWidth: this.kernelWidth,
      kernelHeight: this.kernelHeight,
      kernelChannel: this.kernelChannel,
      kernelPadding: this.kernelPadding,
      kernelStride: this.kernelStride,
    }
  }
}

export default Layer