const Persons = ({ persons, deleteperson }) => {
  return (
    <ul>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deleteperson(person.id)}>delete</button>
        </p>
      ))}
    </ul>
  );
};

export default Persons;
