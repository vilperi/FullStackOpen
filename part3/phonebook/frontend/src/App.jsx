import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import phonebookService from './services/persons'

const Filter = ({ newSearch, handleSearchChange}) => (
  <div>
    filter shown with 
    <input value={newSearch} onChange={handleSearchChange}/>
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange}/>
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = (props) => (
  <div>
    {props.filtered.map(p => 
      <Person key={p.name} person={p} handleRemove={props.handleRemove}></Person>
    )}
  </div>
)

const Person = ({ person, handleRemove }) => {
  return (
  <div>
    {person.name} {person.number}
    <button type="button" onClick={() => handleRemove(person)}>delete</button>
  </div>
)}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: 'info'
  })

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const clearNotification = () => {
    setTimeout(() => setNotificationMessage({ message: null, type: 'info' }), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (!nameExists()) {
      phonebookService
        .create(personObject)
        .then(returned => {
          setPersons(persons.concat(returned))
          setNotificationMessage(prev => ({
            ...prev,
            message: `Added ${personObject.name}`
          }))
          clearNotification()
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotificationMessage({
            message: error.response.data.error,
            type: 'error'
          })
          clearNotification()
        })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = persons.find(p => p.name === newName)?.id
        phonebookService
          .update(id, personObject)
          .then(returned => {
            setPersons(persons.map(p =>
              p.id == id ? { ...p, number: newNumber } : p
            ))
            setNotificationMessage({
              message: `Updated ${personObject.name}`,
              type: 'info'
            })
            clearNotification()
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            if (error.status === 400) {
            setNotificationMessage({
              message: error.response.data.error,
              type: 'error'
            })
            } else {
            setNotificationMessage({
              message: `${newName} was already removed from the server`,
              type: 'error'
            })
            }
            clearNotification()
          })
      }
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const handleRemove = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
    phonebookService
      .remove(person.id)
      .then(returned => {
        setPersons(persons.filter(p => p.id !== person.id))
      })
    } else {
      return
    }
  }

  const nameExists = () => {
    const condition = persons.some(p => p.name === newName)
    return (condition)
  }

  const filterName = persons.filter(p =>
    p.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification message={notificationMessage.message} notificationType={notificationMessage.type}/>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      
      <h3>add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>

      <Persons filtered={filterName} handleRemove={handleRemove}/>
    </div>
  )
}

export default App
