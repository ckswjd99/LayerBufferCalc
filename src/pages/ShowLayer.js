import { 
  Button, 
  Stack,
  Paper,
  TextField,
  Divider,
  Chip,
  List,
  ListItem,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material'

import {
  Delete as DeleteIcon,
  HelpCenter as HelpCenterIcon,
  AddCircle as AddCircleIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material'


import { styled } from '@mui/material/styles'

import Layer from '../utils/Layer'

const copyLayer = (layer) => {
  const newLayer = new Layer()
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
  const {layers, index, layerModifiers} = props

  return (
    <Item elevation={10} sx={{width: 200}}>
      <Typography sx={{fontSize: 24}}>L{index}</Typography>
      <Stack>
        <List>
          <Divider>
            <Chip label="FEATURE MAP" />
          </Divider>
          <ListItem>
            <LayerProperty 
              id='layer-width' 
              label='Layer Width' 
              size='small' 
              defaultValue={layers[index].layerWidth}
              onChange={(e) => {
                e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                layers[index].layerWidth = parseInt(e.target.value)
                layerModifiers.modifyLayer(layers[index], index)
              }}
              value={layers[index].layerWidth}
              disabled={index !== 0}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='layer-height' 
              label='Layer Height' 
              size='small' 
              defaultValue={layers[index].layerHeight} 
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                const newLayer = copyLayer(layers[index])
                newLayer.layerHeight = parseInt(parsedNumber)
                layerModifiers.modifyLayer(newLayer, index)
                e.target.value = parsedNumber
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
              defaultValue={layers[index].layerChannel} 
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                const newLayer = copyLayer(layers[index])
                newLayer.layerChannel = parseInt(parsedNumber)
                layerModifiers.modifyLayer(newLayer, index)
                e.target.value = parsedNumber
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
              defaultValue={layers[index].kernelType}
              onChange={(e) => {
                const newLayer = copyLayer(layers[index])
                newLayer.kernelType = e.target.value
                layerModifiers.modifyLayer(newLayer, index)
              }}
              fullWidth
            >
              <MenuItem value='conv'>Convolution</MenuItem>
              <MenuItem value='pool'>Pooling</MenuItem>
              <MenuItem value='output'>Output</MenuItem>
            </Select>
          </ListItem>

          <ListItem disabled={layers[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-width' 
              label='Kernel Width' 
              size='small' 
              defaultValue={layers[index].kernelWidth} 
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                const newLayer = copyLayer(layers[index])
                newLayer.kernelWidth = parseInt(parsedNumber)
                layerModifiers.modifyLayer(newLayer, index)
                e.target.value = parsedNumber
              }}
              fullWidth
            />
          </ListItem>
          <ListItem disabled={layers[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-height' 
              label='Kernel Height' 
              size='small' 
              defaultValue={layers[index].kernelHeight} 
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                const newLayer = copyLayer(layers[index])
                newLayer.kernelHeight = parseInt(parsedNumber)
                layerModifiers.modifyLayer(newLayer, index)
                e.target.value = parsedNumber
              }}
              fullWidth
            />
          </ListItem>
          <ListItem disabled={layers[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-channel' 
              label='Kernel Channel' 
              size='small' 
              defaultValue={layers[index].kernelChannel} 
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                const newLayer = copyLayer(layers[index])
                newLayer.kernelChannel = parseInt(parsedNumber)
                layerModifiers.modifyLayer(newLayer, index)
                e.target.value = parsedNumber
              }}
              fullWidth
              disabled={layers[index].kernelType === "pool"}
            />
          </ListItem>
          <ListItem disabled={layers[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-padding' 
              label='Kernel Padding' 
              size='small' 
              defaultValue={layers[index].kernelPadding} 
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                const newLayer = copyLayer(layers[index])
                newLayer.kernelPadding = parseInt(parsedNumber)
                layerModifiers.modifyLayer(newLayer, index)
                e.target.value = parsedNumber
              }}
              fullWidth
            />
          </ListItem>
          <ListItem disabled={layers[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-stride' 
              label='Kernel Stride' 
              size='small' 
              defaultValue={layers[index].kernelStride} 
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
                const newLayer = copyLayer(layers[index])
                newLayer.kernelStride = parseInt(parsedNumber)
                layerModifiers.modifyLayer(newLayer, index)
                e.target.value = parsedNumber
              }}
              fullWidth
            />
          </ListItem>

        </List>
      </Stack>

      <Stack direction='row' sx={{display: 'flex', justifyContent: 'space-between'}}>
        <IconButton onClick={() => {layerModifiers.addLayer(new Layer(), index)}}>
          <ArrowBackIosIcon/>
          <AddCircleIcon/>
        </IconButton>
        <IconButton onClick={() => {layerModifiers.deleteLayer(index)}}>
          <DeleteIcon/>
        </IconButton>
        <IconButton onClick={() => {console.log(layers[index])}}>
          <HelpCenterIcon/>
        </IconButton>
        <IconButton onClick={() => {layerModifiers.addLayer(new Layer(), index+1)}}>
          <AddCircleIcon/>
          <ArrowForwardIosIcon/>
        </IconButton>
      </Stack>

    </Item>
  )
}

export {
  copyLayer, ShowLayer
}
