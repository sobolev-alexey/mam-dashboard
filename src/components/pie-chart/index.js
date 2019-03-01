import React from 'react';
import ChartistGraph from 'react-chartist'

const pieChartOptions = {
  donut: true,
  donutWidth: 60,
  startAngle: 270,
  total: 245 * 2,
  showLabel: false
}

export default ({ data }) => (
  <ChartistGraph
    style={{ height: 300, marginBottom: -100 }}
    data={data || {}}
    options={pieChartOptions}
    type={'Pie'}
  />
)