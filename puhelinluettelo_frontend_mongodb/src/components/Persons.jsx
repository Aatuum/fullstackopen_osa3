const Persons = ({ filteredPersons, deleteperson }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deleteperson(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
