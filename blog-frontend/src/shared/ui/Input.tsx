import { InputFieldProps } from "../types/InputField";

export const Input: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => (
  <div className="flex flex-col gap-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      className="mt-1 block w-full h-16 border border-gray-300 bg-white rounded-md p-2 dark:bg-gray-900 text-black dark:text-white"
    />
    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
  </div>
);
