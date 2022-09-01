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

import { Layer, copyLayer } from '../utils/Layer'


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

const LayerBox = (props) => {
  const { layerList, index, layerModifiers } = props
  const { addLayer, updateLayer, deleteLayer } = layerModifiers
  
  const numberChangedHandler = (propertyName) => {
    return (e) => {
      const parsedNumber = parseInt(e.target.value.replace(/[^0-9]/g, ''))
      const newLayer = copyLayer(layerList[index], true)

      e.target.value = parsedNumber
      newLayer[propertyName] = parsedNumber
      updateLayer(newLayer, index)
    }
  }

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
              defaultValue={layerList[index].layerWidth}
              onChange={numberChangedHandler('layerWidth')}
              disabled={index !== 0}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='layer-height' 
              label='Layer Height' 
              size='small' 
              defaultValue={layerList[index].layerHeight} 
              onChange={numberChangedHandler('layerHeight')}
              disabled={index !== 0}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <LayerProperty 
              id='layer-channel' 
              label='Layer Channel' 
              size='small' 
              defaultValue={layerList[index].layerChannel} 
              onChange={numberChangedHandler('layerChannel')}
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
              defaultValue={layerList[index].kernelType}
              onChange={(e) => {
                const newLayer = copyLayer(layerList[index], true)
                newLayer.kernelType = e.target.value
                updateLayer(newLayer, index)
              }}
              fullWidth
            >
              <MenuItem value='conv'>Convolution</MenuItem>
              <MenuItem value='pool'>Pooling</MenuItem>
              <MenuItem value='output'>Output</MenuItem>
            </Select>
          </ListItem>

          <ListItem disabled={layerList[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-width' 
              label='Kernel Width' 
              size='small' 
              defaultValue={layerList[index].kernelWidth} 
              onChange={numberChangedHandler('kernelWidth')}
              fullWidth
            />
          </ListItem>
          <ListItem disabled={layerList[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-height' 
              label='Kernel Height' 
              size='small' 
              defaultValue={layerList[index].kernelHeight} 
              onChange={numberChangedHandler('kernelHeight')}
              fullWidth
            />
          </ListItem>
          <ListItem disabled={layerList[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-channel' 
              label='Kernel Channel' 
              size='small' 
              defaultValue={layerList[index].kernelChannel} 
              onChange={numberChangedHandler('kernelChannel')}
              fullWidth
              disabled={layerList[index].kernelType === "pool"}
            />
          </ListItem>
          <ListItem disabled={layerList[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-padding' 
              label='Kernel Padding' 
              size='small' 
              defaultValue={layerList[index].kernelPadding} 
              onChange={numberChangedHandler('kernelPadding')}
              fullWidth
            />
          </ListItem>
          <ListItem disabled={layerList[index].kernelType === 'output'}>
            <LayerProperty 
              id='kernel-stride' 
              label='Kernel Stride' 
              size='small' 
              defaultValue={layerList[index].kernelStride} 
              onChange={numberChangedHandler('kernelStride')}
              fullWidth
            />
          </ListItem>

        </List>
      </Stack>

      <Stack direction='row' sx={{display: 'flex', justifyContent: 'space-between'}}>
        <IconButton onClick={() => {addLayer(copyLayer(layerList[index], false), index)}}>
          <ArrowBackIosIcon/>
          <AddCircleIcon/>
        </IconButton>
        <IconButton onClick={() => {deleteLayer(index)}}>
          <DeleteIcon/>
        </IconButton>
        <IconButton onClick={() => {console.log(layerList[index])}}>
          <HelpCenterIcon/>
        </IconButton>
        <IconButton onClick={() => {addLayer(copyLayer(layerList[index], false), index+1)}}>
          <AddCircleIcon/>
          <ArrowForwardIosIcon/>
        </IconButton>
      </Stack>

    </Item>
  )
}

export default LayerBox