import React from "react";
import { useState } from "react";

import { 
  Box, 
  Button, 
  Stack,
  Paper,
  TextField,
  Divider,
  Chip,
  List,
  ListItem,
  Select,
  MenuItem
} from '@mui/material'

import { styled } from '@mui/material/styles'

import Layer from '../utils/Layer'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const LayerProperty = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
}))

const ShowLayer = (props) => {
  const {layer, index, layerModifiers} = props

  return (
    <Item elevation={10}>
      <Stack>
        <List>
          <Divider>
            <Chip label="LAYER" />
          </Divider>
          <ListItem>
            <LayerProperty 
              id='layer-width' 
              label='Layer Width' 
              size='small' 
              defaultValue={layer.layerWidth}
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.layerWidth = parseInt(e.target.value)
              }}
              value={layer.layerWidth}
              disabled={index !== 0}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='layer-height' 
              label='Layer Height' 
              size='small' 
              defaultValue={layer.layerWidth} 
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.layerHeight = parseInt(e.target.value)
              }}
              disabled={index !== 0}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='layer-channel' 
              label='Layer Channel' 
              size='small' 
              defaultValue={layer.layerChannel} 
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.layerChannel = parseInt(e.target.value)
              }}
              disabled={index !== 0}
              fullWidth
            />
          </ListItem>
        </List>

        <List>
          <Divider>
            <Chip label="KERNEL" />
          </Divider>
          <ListItem>
            <Select
              id='kernel-type'
              label='Kernel Type'
              size='small'
              defaultValue={layer.kernelType}
              onChange={(e) => {
                layer.kernelType = e.target.value
              }}
              fullWidth
            >
              <MenuItem value='conv'>Convolution</MenuItem>
              <MenuItem value='pool'>Pooling</MenuItem>
            </Select>
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='kernel-width' 
              label='Kernel Width' 
              size='small' 
              defaultValue={layer.kernelWidth} 
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.kernelWidth = parseInt(e.target.value)
              }}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='kernel-height' 
              label='Kernel Height' 
              size='small' 
              defaultValue={layer.kernelWidth} 
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.kernelHeight = parseInt(e.target.value)
              }}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='kernel-channel' 
              label='Kernel Channel' 
              size='small' 
              defaultValue={layer.kernelChannel} 
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.kernelChannel = parseInt(e.target.value)
              }}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='kernel-padding' 
              label='Kernel Padding' 
              size='small' 
              defaultValue={layer.kernelPadding} 
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.kernelPadding = parseInt(e.target.value)
              }}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='kernel-stride' 
              label='Kernel Stride' 
              size='small' 
              defaultValue={layer.kernelStride} 
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layer.kernelStride = parseInt(e.target.value)
              }}
              fullWidth
            />
          </ListItem>

        </List>
      </Stack>

      <Stack direction='row'>
        <Button onClick={() => {layerModifiers.addLayer(new Layer(), index-1)}}>push left</Button>
        <Button onClick={() => {layerModifiers.deleteLayer(index)}}>delete</Button>
        <Button onClick={() => {console.log({layer, index})}}>debug</Button>
        <Button onClick={() => {layerModifiers.addLayer(new Layer(), index+1)}}>push right</Button>
      </Stack>

      
    </Item>
  )
}


const CalculatorPage = () => {
  const [layers, setLayers] = useState([new Layer()])

  const deleteLayer = (index) => {
    console.log(index)
    console.log(layers.slice(0, index))
    console.log(layers.slice(index+1))
    console.log([...layers.slice(0, index), ...layers.slice(index+1)])
    const newLayer = [...layers.slice(0, index), ...layers.slice(index+1)]
    if (newLayer.length < 1) return
    setLayers(newLayer)
  }
  const addLayer = (layer, index) => {
    const newLayer = [...layers.slice(0, index), layer, ...layers.slice(index)]
    setLayers(newLayer)
  }

  const layerModifiers = {
    deleteLayer, addLayer
  }

  return (
    <Box component='div'>
      <Box component='h1'
       sx={{
        border: '2px black solid',
        padding: '24px 12px 24px 12px'
  
       }}
      >
        Layer Buffering Calculator
      </Box>
      <Stack direction='row' spacing={2}>
        {
          layers.map((layer, index) => (
            <ShowLayer key={index} layer={layer} index={index} layerModifiers={layerModifiers}/>
          ))
        }
      </Stack>
      <Button onClick={()=>{console.log(layers)}}>debug</Button>
    </Box>
  )
}

export default CalculatorPage