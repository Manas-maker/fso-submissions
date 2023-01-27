import { useState, useEffect } from 'react'

import personService from './services/persons.js'

const Filter = ({value, onChange}) => <input value={value} onChange={onChange} />

const Input = ({name, value, onChange}) => <div>{name}: <input value={value} onChange={onChange} /></div>

const Persons = ({personsToShow, removePerson}) => 
  <ul>
  {personsToShow.map(person => <li key={person.name}>{person.name} {person.number} <button onClick={() => removePerson(person.id)}>delete</button></li>)}
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
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
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
      const updateCheck = window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)
      console.log(`update: ${updateCheck}`)
      console.log((`${newPerson}`))
      if (updateCheck) {
        const id = persons.find(p => p.name === newPerson.name).id
        personService
          .update(id, newPerson )
          .then(returnedperson => {
            setPersons(persons.map(p=>p.id !== id? p:returnedperson))
          })
      }
    }
    else {
      personService
        .addNew(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber(111)
        })
    }
    
  }

  const removePerson =  (id) => {
    const confirmation = window.confirm(`Delete ${persons.find(person=>person.id === id).name}?`)
    if (confirmation) {
      personService
      .remove(id)
      .then(
        setPersons(persons.filter(p=>p.id!==id))
      )
    }
  }
  const personsToShow = showAll?persons:persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))
  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <Filter value={nameSearch} onChange={handleNameSearchChange}/></div>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} nameChangeHandler={nameChangeHandler} numberChangeHandler={numberChangeHandler}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} removePerson={removePerson}/> 
    </div>
  )
}

export default App
