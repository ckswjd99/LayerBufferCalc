import { useState } from 'react'
import { Layer, copyLayer, autoCompleteLayerList } from '../utils/Layer'

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
import LayerBox from './LayerBox'
import CalcResultBox from './CalcResultBox'



const CalculatorPage = (props) => {

  // States
  const [layerList, setLayerList] = useState([new Layer()])
  const [startLayer, setStartLayer] = useState(0)
  const [endLayer, setEndLayer] = useState(0)
  const [chunkHeight, setChunkHeight] = useState(0)
  const [dataVolume, setDataVolume] = useState(0)
  const [cacheVolume, setCacheVolume] = useState(0)

  // Layer list and modifiers
  const addLayer = (layer, index) => {
    const newLayerList = [...layerList.slice(0, index), layer, ...layerList.slice(index).map(layer => copyLayer(layer, false))]
    setLayerList(autoCompleteLayerList(newLayerList))
  }
  const updateLayer = (layer, index) => {
    const newLayerList = [...layerList.slice(0, index), layer, ...layerList.slice(index+1).map(layer => copyLayer(layer, false))]
    setLayerList(autoCompleteLayerList(newLayerList))
  }
  const deleteLayer = (index) => {
    if(layerList.length <= 1) return
    const newLayerList = [...layerList.slice(0, index), ...layerList.slice(index+1).map(layer => copyLayer(layer, false))]
    setLayerList(autoCompleteLayerList(newLayerList))
  }

  const layerModifiers = {
    addLayer, updateLayer, deleteLayer
  }

  // Model I/O
  const loadModel = (e) => {
    console.log(e.target.files[0])
    console.log(e.target.value)

    const reader = new FileReader()
    reader.addEventListener('load', e => {
      const fileContent = JSON.parse(e.target.result)
      setLayerList(autoCompleteLayerList(fileContent))
    })
    reader.readAsText(e.target.files[0])
  }

  const saveModel = () => {
    const layers = layerList.map(layer => layer.asJson())
    const fileName = "model";
    const json = JSON.stringify(layers, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  // Calculation parameters
  


  return (
    <Box component='div'>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Layer Buffering Calculator
          </Typography>
          <Button color="inherit" onClick={console.log(layerList)}>debug</Button>
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
        <Stack direction='row' spacing={2} sx={{overflowX: 'auto', padding: 2}}>{
          layerList.map((layer, index) => (<LayerBox 
            key={layer.ID}
            layerList={layerList}
            index={index}
            layerModifiers={layerModifiers}
          />))
        }</Stack>
      </Box>

      <Box>
        <Typography sx={{fontSize: 36, textAlign: 'center', margin: '72px 0 12px 0', color: 'dimgray'}}>Calculation</Typography>
      </Box>

      <Box sx={{display: 'flex', justifyContent: 'center', mb:'32px'}}>
        <Grid container width='960px' spacing={4}>

          <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography mb='4'>Start Layer</Typography>
            <Select size='small' onChange={(e) => {setStartLayer(parseInt(e.target.value))}}>
              {(new Array(layerList.length)).fill(0).map((_, i) => (
                <MenuItem value={i}>L{i}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>End Layer</Typography>
            <Select size='small' onChange={(e) => {setEndLayer(parseInt(e.target.value))}}>
              {(new Array(layerList.length)).fill(0).map((_, i) => (
                <MenuItem value={i}>L{i}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>Chunk Height</Typography>
            <TextField size='small' onChange={(e) => {setChunkHeight(parseInt(e.target.value.replace(/[^0-9]/g, '')))}} />
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>Data Volume (Byte)</Typography>
            <TextField size='small' onChange={(e) => {setDataVolume(parseInt(e.target.value.replace(/[^0-9]/g, '')))}} />
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography>Cache Volume (Byte)</Typography>
            <TextField size='small' onChange={(e) => {setCacheVolume(parseInt(e.target.value.replace(/[^0-9]/g, '')))}} />
          </Grid>
          
        </Grid>
      </Box>

      <CalcResultBox
        layers={layerList}
        startLayer={startLayer}
        endLayer={endLayer}
        chunkHeight={chunkHeight}
        dataVolume={dataVolume}
        cacheVolume={cacheVolume}
      />

      <Box height={'240px'} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Typography color="text.secondary" fontSize={'16px'}>Copyright ⓒ 2022. ckswjd99 All Rights Reserved.</Typography>
        <a href="https://5iq.cc">https://5iq.cc</a>
      </Box>

    </Box>
  )
}

export default CalculatorPage