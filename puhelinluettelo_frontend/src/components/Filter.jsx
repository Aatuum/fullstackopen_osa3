const Filter = ({ value, onChange }) => {
  return (
    <div>
      <input value={value} onChange={onChange} />
    </div>
  );
};

export default Filter;
