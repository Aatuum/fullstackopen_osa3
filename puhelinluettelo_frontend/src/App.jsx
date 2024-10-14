import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import personsService from './services/persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredSearch, setFilteredSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('');

  useEffect(() => {
    personsService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const handleAddingName = (event) => {
    setNewName(event.target.value);
  };
  const handleAddingNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setFilteredSearch(event.target.value);
  };

  const lisaaUusiHenkilo = (event) => {
    event.preventDefault();

    const duplicatedPerson = persons.find(
      (henkilo) => henkilo.name === newName
    );

    if (duplicatedPerson) {
      if (
        window.confirm(
          `${newName} is already in the phonebook. Do you want to replace the old number with the new one?`
        )
      ) {
        const newUpdatedPerson = { ...duplicatedPerson, number: newNumber };

        personsService
          .update(duplicatedPerson.id, newUpdatedPerson)
          .then((returnedDude) => {
            setPersons(
              persons.map((person) =>
                person.id !== duplicatedPerson.id ? person : returnedDude
              )
            );
            setSuccessMessage(`Updated ${newName}'s number`);
            setNotificationType('success');
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch((error) => {
            setSuccessMessage(
              `Information of ${newName} has already been removed from the server`
            );
            setNotificationType('error');
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
            setPersons(persons.filter((p) => p.id !== duplicatedPerson.id));
          });
      }
      return;
    }
    const newDude = {
      name: newName,
      number: newNumber,
    };
    personsService.create(newDude).then(() => {
      setPersons(persons.concat(newDude));
      setSuccessMessage(`${newName} added`);
      setNotificationType('success');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setNewName('');
      setNewNumber('');
    });
  };

  const deleteperson = (id) => {
    const personsId = persons.find((person) => person.id === id);
    if (window.confirm(`Are you sure you want to delete ${personsId.name}?`)) {
      personsService.deleteOne(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setSuccessMessage(`${personsId.name} deleted`);
        setNotificationType('delete');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      });
    }
  };

  const filteredPersons = filteredSearch
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filteredSearch.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type={notificationType} />
      <div>
        Filter shown with:
        <Filter value={filteredSearch} onChange={handleSearchChange} />
      </div>
      <h2>Add new</h2>
      <PersonForm
        onSubmit={lisaaUusiHenkilo}
        newName={newName}
        handleAddingName={handleAddingName}
        newNumber={newNumber}
        handleAddingNumber={handleAddingNumber}
      />
      <h2>Persons/numbers</h2>
      <Persons persons={filteredPersons} deleteperson={deleteperson} />
    </div>
  );
};

export default App;
