import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let total = good + neutral + bad

  if (total !== 0) {
    return (
      <div>
        <h1>give feedback</h1>
        <Button onClick={() => setGood(good + 1)} text="good"></Button>
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral"></Button>
        <Button onClick={() => setBad(bad + 1)} text="bad"></Button>
        <h1>statistics</h1>

        <Statistics good={good} neutral={neutral} bad={bad} total={total}></Statistics>
      </div>
    )
  }
  else {
    return (
      <div>
        <h1>give feedback</h1>
        <Button onClick={() => setGood(good + 1)} text="good"></Button>
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral"></Button>
        <Button onClick={() => setBad(bad + 1)} text="bad"></Button>
        <h1>statistics</h1>
        No feedback given
      </div>
    )
  }
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Statistics = ({good, neutral, bad, total}) => {
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={(good * 1 + bad * -1) / total} />
        <StatisticLine text="positive" value={good / total * 100 + " %"} />
      </tbody>
    </table>
  )
}

const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

export default App