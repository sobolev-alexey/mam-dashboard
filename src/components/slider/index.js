import React from 'react';
import styled from 'styled-components'

export default ({ min, max, value, onChange }) => (
  <Slider
    id="typeinp"
    type="range"
    min={min}
    max={max}
    value={value}
    onChange={onChange}
    step="1"
  />
)

const Slider = styled.input`min-height: 30px;`
