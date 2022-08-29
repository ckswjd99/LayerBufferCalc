import { 
  Box, 
  Button, 
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Chip,
  Card,
  Grid,
  CardContent
} from '@mui/material'


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DoCalc = (props) => {
  const { layers, startLayer, endLayer, chunkHeight, dataSize, cacheL1Size } = props
  const cacheL1Length = cacheL1Size / dataSize
  console.log(startLayer, endLayer)

  const accessCounter = (new Array(endLayer - startLayer + 1)).fill(0).map(_ => ({
    original: {
      featureMap: {
        memoryRead: 0,
        memoryWrite: 0,
      },
      kernel: {
        memoryRead: 0,
        memoryWrite: 0,
      }
    },
    buffered: {
      featureMap: {
        memoryRead: 0,
        memoryWrite: 0,
      },
      kernel: {
        memoryRead: 0,
        memoryWrite: 0,
      }
    }
  }))
  console.log(accessCounter)

  // Calculate naive original version
  for (let i=0; i<endLayer-startLayer; i++) {
    const lNow = layers[startLayer+i]
    if(i === 0) console.log(lNow)
    const lNext = layers[startLayer+i+1]
    const layerFeatureMapSize = lNow.layerWidth * lNow.layerHeight * lNow.layerChannel
    const kernelSize = lNow.kernelWidth * lNow.kernelHeight * lNow.kernelChannel * lNow.layerChannel
    const outputFeatureMapSize = lNext.layerWidth * lNext.layerHeight * lNext.layerChannel

    accessCounter[i].original.featureMap.memoryRead += layerFeatureMapSize
    accessCounter[i+1].original.featureMap.memoryWrite += outputFeatureMapSize
    accessCounter[i].original.kernel.memoryRead += kernelSize
  }

  const totalOriginal = {
    memRead: accessCounter
      .map(counted => (
        counted.original.featureMap.memoryRead +
        counted.original.kernel.memoryRead
      ))
      .reduce((a, b) => a + b, 0),
    memWrite: accessCounter
      .map(counted => (
        counted.original.featureMap.memoryWrite +
        counted.original.kernel.memoryWrite
      ))
      .reduce((a, b) => a + b, 0),

    fmRead: accessCounter
      .map(counted => counted.original.featureMap.memoryRead)
      .reduce((a, b) => a + b, 0),
    fmWrite: accessCounter
      .map(counted => counted.original.featureMap.memoryWrite)
      .reduce((a, b) => a + b, 0),

    kernelRead: accessCounter
      .map(counted => counted.original.kernel.memoryRead)
      .reduce((a, b) => a + b, 0),
    kernelWrite: accessCounter
      .map(counted => counted.original.kernel.memoryWrite)
      .reduce((a, b) => a + b, 0),
  }

  // Calculate buffered case
  let bufferConfig = (new Array(endLayer - startLayer + 1)).fill(0).map((_, i) => ({
    filledHeight: 0,
    fullHeight: layers[startLayer + i].layerHeight,
    bufferSize: layers[startLayer + i].kernelHeight * layers[startLayer + i].layerWidth * layers[startLayer + i].layerChannel
  }))

  let j = 1000
  while (true) {
    if (bufferConfig[bufferConfig.length-1].filledHeight >= bufferConfig[bufferConfig.length-1].fullHeight) break
    if (
      startLayer >= endLayer || 
      bufferConfig[0].filledHeight < 0 ||
      chunkHeight <= 0
    ) break

    let pipeSize = chunkHeight
    for (let i=0; i<endLayer-startLayer+1; i++) {
      // Calc mem access - read former layer data
      if (i === 0) {  // at first, data should be read from memory
        const lNow = layers[startLayer + i]
        accessCounter[i].buffered.featureMap.memoryRead += pipeSize * lNow.layerWidth * lNow.layerChannel
        accessCounter[i].buffered.kernel.memoryRead += lNow.kernelWidth * lNow.kernelHeight * lNow.kernelChannel * lNow.layerChannel
      }
      else if (i === endLayer - startLayer) { // do nothing for last iter
      }
      else {  // during pipelining, data can be read from cache
        const lNow = layers[startLayer + i]
        accessCounter[i].buffered.featureMap.memoryRead += Math.max(pipeSize * lNow.layerWidth * lNow.layerChannel - cacheL1Length, 0)
        accessCounter[i].buffered.kernel.memoryRead += lNow.kernelWidth * lNow.kernelHeight * lNow.kernelChannel * lNow.layerChannel
      }

      // Do calc and modify state
      if (bufferConfig[i].filledHeight === 0) {
        bufferConfig[i].filledHeight = Math.min(bufferConfig[i].filledHeight + pipeSize, bufferConfig[i].fullHeight)
        pipeSize = Math.ceil(
          layers[startLayer + i].kernelType === 'conv' 
            ? pipeSize - Math.floor(layers[startLayer + i].kernelHeight / 2) 
            : pipeSize / layers[startLayer + i].kernelHeight
        )
      }
      else {
        bufferConfig[i].filledHeight = Math.min(bufferConfig[i].filledHeight + pipeSize, bufferConfig[i].fullHeight)
        pipeSize = Math.ceil(
          layers[startLayer + i].kernelType === 'conv'
            ? pipeSize 
            : pipeSize / layers[startLayer + i].kernelHeight
        )
      }

      // Calc mem access - write result at next layer
      if (i === endLayer - startLayer - 1) {  // at layer before last, all result should be written in memory.
        const lNext = layers[startLayer + i + 1]
        accessCounter[i+1].buffered.featureMap.memoryWrite += pipeSize * lNext.layerWidth * lNext.layerChannel
      }
      else if (i === endLayer - startLayer) { // at last iter, do nothing
      }
      else {  // pipelined result will be stored in cache and memory
        const lNext = layers[startLayer + i + 1]
        accessCounter[i+1].buffered.featureMap.memoryWrite += Math.max(pipeSize * lNext.layerWidth * lNext.layerChannel - cacheL1Length, 0)
      }

    }

    if(--j < 0) {
      alert('overflow!')
      break
    }
  }

  const totalBuffered = {
    memRead: accessCounter
      .map(counted => (
        counted.buffered.featureMap.memoryRead +
        counted.buffered.kernel.memoryRead
      ))
      .reduce((a, b) => a + b, 0),
    memWrite: accessCounter
      .map(counted => (
        counted.buffered.featureMap.memoryWrite +
        counted.buffered.kernel.memoryWrite
      ))
      .reduce((a, b) => a + b, 0),

    fmRead: accessCounter
      .map(counted => counted.buffered.featureMap.memoryRead)
      .reduce((a, b) => a + b, 0),
    fmWrite: accessCounter
      .map(counted => counted.buffered.featureMap.memoryWrite)
      .reduce((a, b) => a + b, 0),

    kernelRead: accessCounter
      .map(counted => counted.buffered.kernel.memoryRead)
      .reduce((a, b) => a + b, 0),
    kernelWrite: accessCounter
      .map(counted => counted.buffered.kernel.memoryWrite)
      .reduce((a, b) => a + b, 0),
  }

  return (
    <Box>
      <Grid container spacing={8} padding={4}>
        <Grid item xs={6}>
          <Typography sx={{textAlign: 'center', color: 'dimgray', fontSize: '24px'}}>ORIGINAL</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.memRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.memWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.memRead + totalOriginal.memWrite) }</Typography>
            </CardContent></Card></Grid>

            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.fmRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.fmWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.fmRead + totalOriginal.fmWrite) }</Typography>
            </CardContent></Card></Grid>

            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.kernelRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalOriginal.kernelRead + totalOriginal.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Typography sx={{textAlign: 'center', color: 'dimgray', fontSize: '24px'}}>LAYER BUFFERED</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.memRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.memWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.memRead + totalBuffered.memWrite) }</Typography>
            </CardContent></Card></Grid>
            
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.fmRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.fmWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.fmRead + totalBuffered.fmWrite) }</Typography>
            </CardContent></Card></Grid>
            
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.kernelRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(totalBuffered.kernelRead + totalBuffered.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
          </Grid>
        </Grid>
      </Grid>

      <Button onClick={() => {console.log(accessCounter, bufferConfig)}}>Debug</Button>
    </Box>
  )
}


export default DoCalc