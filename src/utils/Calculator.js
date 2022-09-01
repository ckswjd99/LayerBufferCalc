const baselineCalculator = (layerList, startIndex, endIndex) => {
  let counter = {
    fmRead: 0,
    fmWrite: 0,
    kernelRead: 0,
    kernelWrite: 0,
    memRead: 0,
    memWrite: 0,
  }

  if (startIndex >= endIndex) return counter

  for (let i=startIndex; i<endIndex; i++) {
    const lNow = layerList[i]
    const lNext = layerList[i+1]

    const inputSize = lNow.layerWidth * lNow.layerHeight * lNow.layerChannel
    const kernelSize = lNow.kernelType === 'conv' ? lNext.layerChannel * lNow.kernelWidth * lNow.kernelHeight * lNow.kernelChannel : 0
    const outputSize = lNext.layerWidth * lNext.layerHeight * lNext.layerChannel

    counter.fmRead += inputSize
    counter.kernelRead += kernelSize
    counter.fmWrite += outputSize
  }

  counter.memRead = counter.fmRead + counter.kernelRead
  counter.memWrite = counter.fmWrite + counter.kernelWrite

  return counter
}

const layerBufferCalculator = (layerList, startIndex, endIndex, chunkHeight, cacheSize) => {
  let counter = {
    fmRead: 0,
    fmWrite: 0,
    kernelRead: 0,
    kernelWrite: 0,
    memRead: 0,
    memWrite: 0,
  }

  if (
    startIndex >= endIndex ||
    !chunkHeight ||
    !cacheSize
  ) return counter

  const targetLayerList = layerList.slice(startIndex, endIndex+1)
  const filledCounter = targetLayerList.map(layer => ({
    filled: 0,
    height: layer.layerHeight,
  }))

  while(true) { // repeatedly calculate chunks
    let calcHeight = Math.min(chunkHeight, filledCounter[0].height - filledCounter[0].filled)
    if (calcHeight <= 0) break

    filledCounter[0].filled += calcHeight

    for (let i=0; i<targetLayerList.length-1; i++) {  // for each kernel pass
      const lNow = targetLayerList[i]
      const lNext = targetLayerList[i+1]
      const calcHeightNext = filledCounter[i].filled === 0
        ? (calcHeight + lNow.kernelPadding - lNow.kernelHeight) / lNow.kernelStride + 1
        : calcHeight / lNow.kernelStride

      const inputSize = lNow.layerWidth * calcHeight * lNow.layerChannel
      const inputAlphaSize = lNow.layerWidth * Math.floor(lNow.kernelHeight / 2) * lNow.layerChannel
      console.log(inputSize, inputAlphaSize)
      const kernelSize = lNext.layerChannel * lNow.kernelWidth * lNow.kernelHeight * lNow.kernelChannel
      const outputSize = lNext.layerWidth * calcHeightNext * lNext.layerChannel

      if (i === 0 && i === targetLayerList.length - 2) {  // no buffering case
        counter.fmRead += filledCounter[i].filled === 0
          ? inputSize
          : inputSize + inputAlphaSize
        counter.kernelRead += lNow.kernelType === 'conv' ? kernelSize : 0
        counter.fmWrite += outputSize
      }
      else if (i === 0) {  // getting input data
        counter.fmRead += filledCounter[i].filled === 0
          ? inputSize
          : inputSize + inputAlphaSize
        counter.kernelRead += lNow.kernelType === 'conv' ? kernelSize : 0
        counter.fmWrite += Math.max(outputSize - cacheSize, 0)
      }
      else if (0 < i && i < targetLayerList.length - 2) { // middle
        counter.fmRead += Math.max(inputSize - cacheSize, 0) + filledCounter[i].filled === 0
          ? 0
          : inputAlphaSize
        counter.kernelRead += lNow.kernelType === 'conv' ? kernelSize : 0
        counter.fmWrite += Math.max(outputSize - cacheSize, 0)
      }
      else {  // final
        counter.fmRead += Math.max(inputSize - cacheSize, 0) + filledCounter[i].filled === 0
          ? 0
          : inputAlphaSize
        counter.kernelRead += lNow.kernelType === 'conv' ? kernelSize : 0
        counter.fmWrite += outputSize
      }

      filledCounter[i+1].filled += calcHeightNext
      calcHeight = calcHeightNext
    }

  }

  counter.memRead = counter.fmRead + counter.kernelRead
  counter.memWrite = counter.fmWrite + counter.kernelWrite

  return counter
}

export {
  baselineCalculator, layerBufferCalculator
}