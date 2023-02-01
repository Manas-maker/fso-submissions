import { useState, useEffect } from 'react'

import personService from './services/persons.js'

const Filter = ({value, onChange}) => <input value={value} onChange={onChange} />

const Notification = ({message}) => {
  if (message == null) {
    return null
  }
  const notifStyleSuccess = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
}

const notifStyleUnsuccess = {
  color: 'red',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
}
  return (
    <div style={(message[1])?notifStyleSuccess:notifStyleUnsuccess}>
      {message[0]}
    </div>
  )
}

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
  const [notification, setNotification] = useState(['some notification', true])

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
            setNotification([`Updated ${returnedperson.name}`, true])
            setTimeout(()=>{
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setNotification([`Information of ${newPerson.name} has already been removed from server`, false])
            setTimeout(()=>{
              setNotification(null)
            }, 5000)
            setPersons(persons.filter(p=>p.id!==id))
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
          setNotification([`Added ${newPerson.name}`, true])
          setTimeout(()=>{
            setNotification(null)
          }, 5000)
        })
    }
    
  }

  const removePerson =  (id) => {
    const confirmation = window.confirm(`Delete ${persons.find(person=>person.id === id).name}?`)
    if (confirmation) {
      personService
      .remove(id)
      .then(() => {
        setNotification([`Deleted ${persons.find(p=>p.id===id).name}`, true])
        setPersons(persons.filter(p=>p.id!==id))
        setTimeout(()=>{
          setNotification(null)
        }, 5000)
      })
    }
  }
  const personsToShow = showAll?persons:persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <div>filter shown with <Filter value={nameSearch} onChange={handleNameSearchChange}/></div>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} nameChangeHandler={nameChangeHandler} numberChangeHandler={numberChangeHandler}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} removePerson={removePerson}/> 
    </div>
  )
}

export default App
