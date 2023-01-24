import { useState, useEffect } from 'react'

import axios from 'axios'

const Filter = ({value, onChange}) => <input value={value} onChange={onChange} />

const Input = ({name, value, onChange}) => <div>{name}: <input value={value} onChange={onChange} /></div>

const Persons = ({personsToShow}) => 
  <ul>
  {personsToShow.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
  </ul>

const PersonForm = (props) => <form onSubmit={props.onSubmit}>
  <div>
    <Input name='name' value={props.newName} onChange={props.nameChangeHandler} />
    <Input name='number' value={props.newNumber} onChange={props.numberChangeHandler} />
    <button type='submit'>add</button>
  </div>
</form>

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState(111)
  const [showAll, setShowAll] = useState(true)
  const [nameSearch, setNameSearch] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  const nameChangeHandler = (event) => {
    setNewName(event.target.value);
  }
  const numberChangeHandler = (event) => {
    setNewNumber(event.target.value);
  }

  const handleNameSearchChange = (event) => {
    setNameSearch(event.target.value)
    if (event.target.value==='') {
      setShowAll(true)
    }
    else {
      setShowAll(false)
    }
    
  }
  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`)
    }
    else {
      axios
        .post('http://localhost:3001/persons', newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber(111)
        })
    }
    
  }
  const personsToShow = showAll?persons:persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))
  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <Filter value={nameSearch} onChange={handleNameSearchChange}/></div>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} nameChangeHandler={nameChangeHandler} numberChangeHandler={numberChangeHandler}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} /> 
    </div>
  )
}

export default App
