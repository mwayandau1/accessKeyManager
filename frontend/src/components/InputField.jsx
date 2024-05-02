// eslint-disable-next-line react/prop-types
const InputField = ({ type, id, value, onChange, label }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 border rounded-md w-full"
      />
    </div>
  );
};

export default InputField;
