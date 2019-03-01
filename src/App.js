import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components'
import { format } from 'date-fns'
import LineChart from './components/line-chart'
import PieChart from './components/pie-chart'
import Layout from './components/layout'
import TitleBar from './components/title-bar'
import Audit from './components/audit'
import Slider from './components/slider'
import { initializeMamState, explorer, fetch, publish, updateMamState } from './mam'

const initialState = {
  temperature: 23,
  gradient: 50,
  loading: false,
  messages: []
}

class App extends Component {
  state = initialState

  async componentDidMount() {
    await initializeMamState()
    await this.setInitialState()
    await this.getChannel()

    const mamState = localStorage.getItem('state')
    if (mamState) {
      updateMamState(JSON.parse(mamState))
    }
  }

  setInitialState = () => {
    this.setState({
      ...initialState,
      messages: [],
      lineChartData: {
        labels: [],
        series: [[]]
      },
      pieData: {
        series: [122, 123]
      }
    })
  }

  getChannel = async () => {
    const root = await localStorage.getItem('root')
    if (root && typeof root === 'string') {
      const messages = await fetch(root)

      // Fill the chart from retrieved data
      const lineChartData = this.state.lineChartData
      messages && messages.forEach(msg => {
        lineChartData.labels.push(msg.ts)
        lineChartData.series[0].push(msg.t)
      })

      const temperature = (messages && messages[messages.length - 1].t) || this.state.temperature
      // Adjust temp guage
      const pieData = this.state.pieData
      pieData.series = [
        parseInt(temperature) + 65,
        180 - parseInt(temperature)
      ]

      this.setState({ messages, lineChartData, pieData, temperature })
    }
  }

  sendMessage = async () => {
    this.setState({ loading: true }, async () => {
      // Message construction
      const messages = this.state.messages
      const packet = {
        t: Number(this.state.temperature),
        g: Number(this.state.gradient),
        ts: Date.now()
      }
      const message = await publish(packet)
      localStorage.setItem('state', JSON.stringify(message.state))
      const root = localStorage.getItem('root')
      if (!root) {
        localStorage.setItem('root', message.root)
      }

      // packet.tx = message.root
      messages.push(packet)

      /// Adjust line chart
      const lineChartData = this.state.lineChartData
      lineChartData.labels.push(Date.now())
      lineChartData.series[0].push(this.state.temperature)

      // Adjust temp guage
      const pieData = this.state.pieData
      pieData.series = [
        parseInt(this.state.temperature) + 65,
        180 - parseInt(this.state.temperature)
      ]

      this.setState({ messages, lineChartData, pieData, loading: false })
    })
  }

  changeStream = async () => {
    localStorage.clear()
    await initializeMamState()
    this.setInitialState()
  }

  handleChange = (e, name) => {
    this.setState({ [name]: Number(e.target.value) })
  }

  getMessageCounter = () => {
    const state = localStorage.getItem('state')
    return state ? JSON.parse(state).channel.start : 0
  }

  render() {
    const { messages, loading, gradient, temperature } = this.state
    const root = localStorage.getItem('root')
    const last = messages && messages[messages.length - 1]

    return (
      <React.Fragment>
        <GlobalStyle />
        <Layout>
          <TitleBar
            title='Fictional Temperature controlled unit'
            connected={true}
            click={this.changeStream}
          />
          {/* FIRST ROW OF BOXES */}
          <Row>
            {/* FIRST CARD */}
            <Card>
              <Block>Temperature</Block>
              <PieChart data={this.state.pieData} />
              <Temperature>
                { last ? `${last.t}°` : '--' }
              </Temperature>

              <Block top>
                <Items>
                  Last command:{' '}
                  <Value>
                    { last ? format(last.ts, 'HH:mm:ss') : '--' }
                  </Value>
                </Items>
                <Items>
                  Commands sent: <Value>{this.getMessageCounter()}</Value>
                </Items>
              </Block>

              <Block>
                <Items>
                  Verify with MAM Explorer:{' '}
                  <Value>
                    <Link
                      href={explorer(root)}
                      target='_blank'
                    >Link</Link>
                  </Value>
                </Items>
    
              </Block>
            </Card>

            <Card flex={1.6}>
              <Block>Historical Temperature</Block>
              <LineChart data={this.state.lineChartData} />
              <Block>Control options</Block>
              <Block>
                <span>Temperature</span>
                <Slider
                  min='-65'
                  max='180'
                  value={temperature}
                  onChange={e => this.handleChange(e, 'temperature')}
                />
                <TinyRick>
                  <span>-65</span>
                  <span>{temperature}</span>
                  <span>180</span>
                </TinyRick>
                <span>Gradient</span>
                <Slider
                  min='0'
                  max='100'
                  value={gradient}
                  onChange={e => this.handleChange(e, 'gradient')}
                />
                <TinyRick>
                  <span>0</span>
                  <span>{gradient}</span>
                  <span>100</span>
                </TinyRick>
              </Block>

              <Block>
                <Row>
                  <Button
                    loading={loading}
                    onClick={() => (loading ? null : this.sendMessage())}
                  >
                    {loading ? 'Attaching Log...' : 'Send Command'}
                  </Button>
                </Row>
              </Block>
            </Card>
          </Row>
          {/* SECOND ROW OF BOXES */}
          <Row>
            <Card>
              <Block>Audit Trail - {root || ''}</Block>
              <Audit messages={messages} />
            </Card>
          </Row>
        </Layout>
      </React.Fragment>
    )
  }
}

export default App;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0 auto;
    font-family: 'Helvetica','Arial',sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 2px;
    color: #444;
    -webkit-font-smoothing: antialiased;
    padding: 0;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`

const Link = styled.a`
  color: #516073;
  font-weight: 700;
  font-size: 22px;
  margin: 10px;
`

const Temperature = styled.h2`
  position: absolute;
  width: 50px;
  left: calc(50% - 25px);
  top: 160px;
  font-size: 36px;
  text-align: center;
`

const Button = styled.button`
  flex: 1;
  height: 45px;
  padding: 10px;
  background: ${props => (props.loading ? 'grey' : '#1d75bc')};
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  margin: 1rem 1rem 0;
  &:active {
    outline: none;
    opacity: 0.6;
  }
  &:focus {
    outline: none;
  }
`

const TinyRick = styled.div`
  font-size: 9px;
  display: flex;
  justify-content: space-between;
`

const Items = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Value = styled.span`
  color: #516073;
  font-weight: 700;
  font-size: 22px;
  margin: 10px;
`

const Card = styled.div`
  position: relative;
  margin: 1rem 1rem;
  background: white;
  flex: ${props => (props.flex ? props.flex : 1)};
`

const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-top: ${props => (props.top ? '1px solid rgba(0,0,0,0.1)' : null)};
  word-break: break-all;
`

const Row = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`