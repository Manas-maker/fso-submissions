import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({label, value}) => <tr><td>{label}</td><td>{value}</td></tr>

const Statistics = ({good, neutral, bad}) => {
  if (good===0 && neutral===0 && bad===0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <div>
      <h2>statistics</h2>
      <table><tbody>
        <StatisticLine label='good' value={good}/>
        <StatisticLine label='neutral' value={neutral}/>
        <StatisticLine label='bad' value={bad}/>
        <StatisticLine label='all' value={good + neutral + bad}/>
        <StatisticLine label='average' value={(good - bad)/(good+bad+neutral)}/>
        <StatisticLine label='positive' value={(good)/(good+bad+neutral)}/>
      </tbody></table>
    </div>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodHandler = () => {
    setGood(good+1)
  }

  const neutralHandler = () => {
    setNeutral(neutral+1)
  }

  const badHandler = () => {
    setBad(bad+1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={goodHandler} text='good'/>
      <Button onClick={neutralHandler} text='neutral'/>
      <Button onClick={badHandler} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad}/> 
    </div>
  )
}

export default App