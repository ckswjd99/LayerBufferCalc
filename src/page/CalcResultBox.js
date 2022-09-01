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

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import {
  baselineCalculator, layerBufferCalculator
} from '../utils/Calculator'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CalcResultBox = (props) => {
  const { layers, startLayer, endLayer, chunkHeight, dataVolume, cacheVolume } = props
  const cacheSize = Math.floor(cacheVolume / dataVolume)

  const baselineResult = baselineCalculator(layers, startLayer, endLayer)
  const bufferedResult = layerBufferCalculator(layers, startLayer, endLayer, chunkHeight, cacheSize)

  const options = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }

  const labels = ['Mem Read (FM)', 'Mem Write (FM)', 'Mem Read (Kernel)', 'Mem Write (Kernel)', 'Mem Read (Total)', 'Mem Write (Total)']

  const data = {
    labels,
    datasets: [
      {
        label: 'Baseline',
        data: [baselineResult.fmRead, baselineResult.fmWrite, baselineResult.kernelRead, baselineResult.kernelWrite, baselineResult.memRead, baselineResult.memWrite],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Layer Buffered',
        data: [bufferedResult.fmRead, bufferedResult.fmWrite, bufferedResult.kernelRead, bufferedResult.kernelWrite, bufferedResult.memRead, bufferedResult.memWrite],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <Box textAlign={'center'}>
      {/* Summarized Section */}
      <Grid container spacing={8} padding={4} sx={{width: '960px', marginLeft: 'auto', marginRight: 'auto'}}>
        <Grid item xs={4}>
          <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read Reduced</Typography>
          <Typography variant="h2">{ `${((1 - bufferedResult.memRead / baselineResult.memRead) * 100).toFixed(2)} %` }</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write Reduced</Typography>
          <Typography variant="h2">{ `${((1 - bufferedResult.memWrite / baselineResult.memWrite) * 100).toFixed(2)} %` }</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access Reduced</Typography>
          <Typography variant="h2">{ `${((1 - (bufferedResult.memRead + bufferedResult.memWrite) / (baselineResult.memRead + baselineResult.memWrite)) * 100).toFixed(2)} %` }</Typography>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Box width={'960px'} sx={{margin: '0 auto 100px auto'}}>
        <Bar options={options} data={data} />
      </Box>

      {/* Detailed Section */}
      <Grid container spacing={8} padding={4}>
        <Grid item xs={6}>
          <Typography sx={{textAlign: 'center', color: 'dimgray', fontSize: '24px'}}>ORIGINAL</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.memRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.memWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.memRead + baselineResult.memWrite) }</Typography>
            </CardContent></Card></Grid>

            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.fmRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.fmWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.fmRead + baselineResult.fmWrite) }</Typography>
            </CardContent></Card></Grid>

            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.kernelRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(baselineResult.kernelRead + baselineResult.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Typography sx={{textAlign: 'center', color: 'dimgray', fontSize: '24px'}}>LAYER BUFFERED</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.memRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.memWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.memRead + bufferedResult.memWrite) }</Typography>
            </CardContent></Card></Grid>
            
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.fmRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.fmWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Feature Map)</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.fmRead + bufferedResult.fmWrite) }</Typography>
            </CardContent></Card></Grid>
            
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Read<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.kernelRead) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Write<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
            <Grid item xs={4}><Card><CardContent>
              <Typography color="text.secondary" sx={{ fontSize: 20 }} gutterBottom>Memory Access<br/>(Kernel)</Typography>
              <Typography variant="h3">{ numberWithCommas(bufferedResult.kernelRead + bufferedResult.kernelWrite) }</Typography>
            </CardContent></Card></Grid>
          </Grid>
        </Grid>
      </Grid>

    </Box>
  )
}

export default CalcResultBox