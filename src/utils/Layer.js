let layerIdCount = 0

class Layer {
  constructor() {
    this.ID = ++layerIdCount
  }
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

const copyLayer = (layer, legacy=true) => {
  const newLayer = new Layer()
  if(legacy === true) newLayer.ID = layer.ID
  newLayer.layerWidth = layer.layerWidth
  newLayer.layerHeight = layer.layerHeight
  newLayer.layerChannel = layer.layerChannel
  newLayer.kernelType = layer.kernelType
  newLayer.kernelWidth = layer.kernelWidth
  newLayer.kernelHeight = layer.kernelHeight
  newLayer.kernelChannel = layer.kernelChannel
  newLayer.kernelPadding = layer.kernelPadding
  newLayer.kernelStride = layer.kernelStride
  
  return newLayer
}

const autoCompleteLayerList = (layerList) => {
  const newLayerList = layerList.map(layer => copyLayer(layer, true))
  for (let i=1; i<newLayerList.length; i++) {
    newLayerList[i].layerWidth = (newLayerList[i-1].layerWidth + newLayerList[i-1].kernelPadding * 2 - newLayerList[i-1].kernelWidth) / newLayerList[i-1].kernelStride + 1
    newLayerList[i].layerHeight = (newLayerList[i-1].layerHeight + newLayerList[i-1].kernelPadding * 2 - newLayerList[i-1].kernelHeight) / newLayerList[i-1].kernelStride + 1
    newLayerList[i].layerChannel = newLayerList[i-1].kernelChannel
    if(newLayerList[i].kernelType === 'pool') {
      newLayerList[i].kernelChannel = newLayerList[i].layerChannel
    }
  }
  return newLayerList
}

export {
  Layer, copyLayer, autoCompleteLayerList
}