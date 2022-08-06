import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>
const VotedText = ({anecdote, points, length}) => {
  if (points.join('') === Array(length).fill(0).join('') || anecdote === undefined) {
    return (<p>start voting to view the anecdote with the most votes</p>)
  }
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdote}</p>
    </div>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const newAnecdote = () => {setSelected(Math.floor(Math.random()*(anecdotes.length - 1)+1))}
  const addVote = () => {
    const copy = [...points]
    copy[selected]++
    setPoints(copy)
    newAnecdote()}
  const mostVoted = points.indexOf(Math.max(...points))

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}<br/>
        has {points[selected]} votes
        <div>
        <Button onClick={newAnecdote} text='next anecdote' />
        <Button onClick={addVote} text='vote' />
        </div>
      </div>
      <VotedText anecdote={anecdotes[mostVoted]} points={points} length={anecdotes.length}/>
    </div>
  )
}

export default App