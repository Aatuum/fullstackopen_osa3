const PersonForm = ({
  onSubmit,
  newName,
  handleAddingName,
  newNumber,
  handleAddingNumber,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={handleAddingName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleAddingNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
