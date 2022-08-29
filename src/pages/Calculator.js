import React, { useEffect } from "react";
import { useState } from "react";

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
  CardContent,
  TextField,
  Select,
  MenuItem
} from '@mui/material'

import Layer from '../utils/Layer'
import { copyLayer, ShowLayer } from './ShowLayer'
import DoCalc from './DoCalc'

const CalculatorPage = () => {
  const [layers, setLayers] = useState([new Layer()])
  const [blanker, setBlanker] = useState(false)
  const [startLayer, setStartLayer] = useState(0)
  const [endLayer, setEndLayer] = useState(0)
  const [chunkHeight, setChunkHeight] = useState(0)
  const [dataSize, setDataSize] = useState(0)
  const [cacheL1Size, setCacheL1Size] = useState(0)

  const autoCompletedLayer = (layerList) => {
    const newLayerList = layerList.map(layer => copyLayer(layer))
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

  const deleteLayer = (index) => {
    const newLayer = [...layers.slice(0, index), ...layers.slice(index+1)]
    if (newLayer.length < 1) return
    setBlanker(true)
    setLayers(autoCompletedLayer(newLayer))
  }
  const addLayer = (layer, index) => {
    const newLayer = [...layers.slice(0, index), layer, ...layers.slice(index)]
    setBlanker(true)
    setLayers(autoCompletedLayer(newLayer))
  }
  const modifyLayer = (layer, index) => {
    const newLayer = [...layers.slice(0, index), layer, ...layers.slice(index+1)]
    setBlanker(true)
    setLayers(autoCompletedLayer(newLayer))
  }

  const layerModifiers = {
    deleteLayer, addLayer, modifyLayer
  }

  const loadModel = (e) => {
    console.log(e.target.files[0])
    console.log(e.target.value)

    const reader = new FileReader()
    reader.addEventListener('load', e => {
      const fileContent = JSON.parse(e.target.result)
      setBlanker(true)
      setLayers(autoCompletedLayer(fileContent))
    })
    reader.readAsText(e.target.files[0])
  }

  const saveModel = () => {
    const layerList = layers.map(layer => layer.asJson())
    const fileName = "model";
    const json = JSON.stringify(layerList, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  useEffect(() => {
    setBlanker(false)
  }, [layers])

  return (
    <Box component='div'>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Layer Buffering Calculator
          </Typography>
          <Button color="inherit" onClick={() => {console.log(layers)}}>debug</Button>
          <Button color="inherit" onClick={saveModel}>Save</Button>
          <Button color="inherit" component="label">
            Load
            <input hidden type="file" accept=".json" onChange={loadModel}/>
          </Button>
        </Toolbar>
      </AppBar>

      <Box>
        <Typography sx={{fontSize: 36, textAlign: 'center', margin: 4, color: 'dimgray'}}>Model Config</Typography>
      </Box>

      <Box>
        <Stack direction='row' spacing={2} sx={{overflowX: 'auto', padding: 2}}>
          {
            blanker ? '' :
            layers.map((_, index) => (
              <ShowLayer key={index} layers={layers} index={index} layerModifiers={layerModifiers}/>
            ))
          }
        </Stack>
      </Box>

      <Box>
        <Typography sx={{fontSize: 36, textAlign: 'center', margin: '72px 0 12px 0', color: 'dimgray'}}>Calculation</Typography>
      </Box>

      <Box sx={{display: 'flex', justifyContent: 'center', mb:'32px'}}>
        <Grid container width='960px' spacing={4}>
          <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography mb='4'>Start Layer</Typography>
            <Select size='small' onChange={(e) => {setStartLayer(e.target.value)}}>
              {(new Array(layers.length)).fill(0).map((_, i) => (
                <MenuItem value={i}>L{i}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>End Layer</Typography>
            <Select size='small' onChange={(e) => {setEndLayer(e.target.value)}}>
              {(new Array(layers.length)).fill(0).map((_, i) => (
                <MenuItem value={i}>L{i}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>Chunk Height</Typography>
            <TextField size='small' onChange={(e) => {setChunkHeight(parseInt(e.target.value.replace(/[^0-9]/g, '')))}} />
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>Data Size (Byte)</Typography>
            <TextField size='small' onChange={(e) => {setDataSize(parseInt(e.target.value.replace(/[^0-9]/g, '')))}} />
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>L1 Cache Size (Byte)</Typography>
            <TextField size='small' onChange={(e) => {setCacheL1Size(parseInt(e.target.value.replace(/[^0-9]/g, '')))}} />
          </Grid>
          
        </Grid>
      </Box>

      <DoCalc 
        layers={layers}
        startLayer={startLayer}
        endLayer={endLayer}
        chunkHeight={chunkHeight}
        dataSize={dataSize}
        cacheL1Size={cacheL1Size}
      />

      <Box sx={{paddingTop: 24}}/>

    </Box>
  )
}

export default CalculatorPage