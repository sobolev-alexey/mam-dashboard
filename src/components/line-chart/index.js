import React from 'react';
import ChartistGraph from 'react-chartist'
import { format } from 'date-fns'

const lineChartOptions = {
  low: -65,
  showArea: true,
  axisX: {
    labelInterpolationFnc: function(value) {
      // Will return Mon, Tue, Wed etc. on medium screens
      return format(value, 'hh:mm:ss')
    }
  }
}

export default ({ data }) => (
  <ChartistGraph
    data={data || {}}
    options={lineChartOptions}
    type={'Line'}
  />
)